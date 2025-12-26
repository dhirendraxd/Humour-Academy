import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { moduleService, Curriculum, Teacher } from '@/lib/modules';
import { useToast } from '@/hooks/use-toast';
import { FadeIn } from '@/components/FadeIn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, User as UserIcon, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BODDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const BODDashboard = ({ user }: BODDashboardProps) => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [faculty, setFaculty] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // New Curriculum State
  const [newCurricTitle, setNewCurricTitle] = useState('');
  const [newCurricDesc, setNewCurricDesc] = useState('');
  const [newCurricOutcomes, setNewCurricOutcomes] = useState('');
  const [newCurricPrereqs, setNewCurricPrereqs] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [curricData, facultyData] = await Promise.all([
        moduleService.listCurriculums(),
        api.get<Teacher[]>('/faculty')
      ]);

      // Load modules for each curriculum
      const withModules = await Promise.all(curricData.map(async (c) => {
        const modules = await moduleService.listModules(c.id);
        return { ...c, modules };
      }));

      setCurriculums(withModules);
      setFaculty(facultyData);
    } catch (error) {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCurriculum = async () => {
    if (!newCurricTitle) return;
    try {
      await api.post('/curriculums', {
        title: newCurricTitle,
        description: newCurricDesc,
        outcomes: newCurricOutcomes,
        prerequisites: newCurricPrereqs
      });
      toast({ title: "Curriculum Created Successfully" });
      setNewCurricTitle('');
      setNewCurricDesc('');
      setNewCurricOutcomes('');
      setNewCurricPrereqs('');
      loadInitialData();
    } catch (error) {
      toast({ title: "Creation Failed", variant: "destructive" });
    }
  };

  const handleAddModule = async (curriculumId: number) => {
    const title = prompt("Module Title:");
    const description = prompt("Module Description:");
    if (!title || !description) return;

    try {
      await api.post('/modules', {
        curriculum_id: curriculumId,
        title,
        description,
        teacher_id: faculty[0]?.id, // Default to first for now, user can change later
        order_index: (curriculums.find(c => c.id === curriculumId)?.modules?.length || 0) + 1,
        duration_months: 1
      });
      loadInitialData();
      toast({ title: "Module Added" });
    } catch (error) {
      toast({ title: "Failed to add module", variant: "destructive" });
    }
  };

  const handleUpdateModuleTeacher = async (moduleId: number, teacherId: string) => {
    try {
      await api.put(`/modules/${moduleId}`, { teacher_id: parseInt(teacherId) });
      loadInitialData();
      toast({ title: "Teacher Assigned" });
    } catch (error) {
      toast({ title: "Failed to assign teacher", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-slate-400">Loading Administrative Control...</div>;

  return (
    <FadeIn>
      <div className="space-y-10 pb-20">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-4 tracking-tighter text-slate-900 uppercase">
              <div className="p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-100">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <span>BOD Oversight</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Welcome, {user.name}. Architecting the future of humor mastery.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Curriculum Creation */}
          <Card className="xl:col-span-1 border-slate-100 shadow-xl shadow-slate-100/50 rounded-[2.5rem] bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" /> Draft New Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ">Program Title</label>
                <Input value={newCurricTitle} onChange={(e) => setNewCurricTitle(e.target.value)} placeholder="e.g., Satire Mastery" className="rounded-xl border-slate-100 bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vision & Summary</label>
                <Textarea value={newCurricDesc} onChange={(e) => setNewCurricDesc(e.target.value)} placeholder="What is this program about?" className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-blue-600">Learning Outcomes</label>
                <Textarea value={newCurricOutcomes} onChange={(e) => setNewCurricOutcomes(e.target.value)} placeholder="What will they master?" className="rounded-xl border-blue-50/30 bg-blue-50/10 min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-orange-500">Prerequisites</label>
                <Input value={newCurricPrereqs} onChange={(e) => setNewCurricPrereqs(e.target.value)} placeholder="e.g., Basic Sarcasm" className="rounded-xl border-orange-50/30 bg-orange-50/10" />
              </div>
              <Button onClick={handleCreateCurriculum} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-100">
                Launch Program
              </Button>
            </CardContent>
          </Card>

          {/* Management List */}
          <div className="xl:col-span-2 space-y-8">
            {curriculums.map(curric => (
              <Card key={curric.id} className="border-slate-100 shadow-xl shadow-slate-100/50 rounded-[2.5rem] bg-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{curric.title}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 italic">{curric.description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAddModule(curric.id)} className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold px-4">
                    <Plus className="w-4 h-4 mr-2" /> Add Phase
                  </Button>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {curric.modules?.length === 0 ? (
                      <p className="text-center py-10 text-slate-300 text-sm italic font-medium">No phases designed yet.</p>
                    ) : (
                      curric.modules?.map((m, idx) => (
                        <div key={m.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{m.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.duration_months} Months</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                              <label className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1.5">Assigned Architect</label>
                              <Select
                                defaultValue={m.teacher_id?.toString()}
                                onValueChange={(val) => handleUpdateModuleTeacher(m.id, val)}
                              >
                                <SelectTrigger className="w-[180px] h-9 rounded-xl border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-700">
                                  <SelectValue placeholder="Select faculty" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                  {faculty.map(f => (
                                    <SelectItem key={f.id} value={f.id.toString()} className="text-xs font-medium focus:bg-slate-50">
                                      {f.name} ({f.rank})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};