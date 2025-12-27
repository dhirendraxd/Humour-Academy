import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { moduleService, Curriculum, Teacher, Cohort } from '@/lib/modules';
import { useToast } from '@/hooks/use-toast';
import { FadeIn } from '@/components/FadeIn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Plus,
  Trash2,
  User as UserIcon,
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Settings,
  TrendingUp,
  Users2,
  Briefcase,
  DollarSign,
  MoreHorizontal,
  ArrowUpRight,
  Search,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ClipboardList,
  GraduationCap,
  X
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend as RechartsLegend
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeacherApplication {
  id: number;
  user_id: number;
  specialization: string;
  experience_summary: string;
  resume_link?: string;
  status: 'pending' | 'approved' | 'rejected';
  bod_notes?: string;
  user: {
    name: string;
    email: string;
  };
  created_at: string;
}

interface BODDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
    bio?: string;
  };
}

const enrollmentTrendData = [
  { name: 'Sept', students: 45 },
  { name: 'Oct', students: 52 },
  { name: 'Nov', students: 48 },
  { name: 'Dec', students: 61 },
  { name: 'Jan', students: 55 },
  { name: 'Feb', students: 67 },
];

const programDistribution = [
  { name: 'Satire', value: 35, fill: '#3b82f6' },
  { name: 'Improv', value: 25, fill: '#ef4444' },
  { name: 'Standup', value: 20, fill: '#f59e0b' },
  { name: 'Story', value: 20, fill: '#10b981' },
];

const MetricCard = ({ title, value, label, trend, trendValue, icon: Icon, color }: any) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden group rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold text-slate-500">{title}</CardTitle>
      <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight mb-1 text-slate-800">{value}</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <div className={`flex items-center text-[10px] font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowUpRight className="h-3 w-3 mr-0.5 rotate-90" />}
          {trendValue}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const BODDashboard = ({ user }: BODDashboardProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [faculty, setFaculty] = useState<Teacher[]>([]);
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // New Curriculum State
  const [newCurricTitle, setNewCurricTitle] = useState('');
  const [newCurricDesc, setNewCurricDesc] = useState('');
  const [newCurricOutcomes, setNewCurricOutcomes] = useState('');
  const [newCurricPrereqs, setNewCurricPrereqs] = useState('');

  // Manual Faculty Creation State
  const [isAddArchitectOpen, setIsAddArchitectOpen] = useState(false);
  const [newArchitectName, setNewArchitectName] = useState('');
  const [newArchitectEmail, setNewArchitectEmail] = useState('');
  const [newArchitectPassword, setNewArchitectPassword] = useState('');
  const [newArchitectRank, setNewArchitectRank] = useState('Architect');
  const [newArchitectBio, setNewArchitectBio] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [curricData, facultyData, applicationsData, metricsData, trendsData, distData, cohortsData] = await Promise.all([
        moduleService.listCurriculums(),
        api.get<Teacher[]>('/faculty'),
        api.get<TeacherApplication[]>('/recruitment/applications'),
        api.get<any>('/analytics/dashboard'),
        api.get<any[]>('/analytics/enrollment-trends'),
        api.get<any[]>('/analytics/program-distribution'),
        api.get<any[]>('/cohorts')
      ]);

      const withModules = await Promise.all(curricData.map(async (c) => {
        const modules = await moduleService.listModules(c.id);
        return { ...c, modules };
      }));

      setCurriculums(withModules);
      setFaculty(facultyData);
      setApplications(applicationsData);
      setAnalytics(metricsData);
      setTrends(trendsData);
      setDistribution(distData);
      setCohorts(cohortsData);
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplication = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/recruitment/applications/${id}`, { status });
      toast({ title: `Application ${status}` });
      loadInitialData();
    } catch (error) {
      toast({ title: "Action failed", variant: "destructive" });
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
      setActiveTab('courses');
    } catch (error) {
      toast({ title: "Creation Failed", variant: "destructive" });
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

  const handleAddModule = async (curriculumId: number) => {
    const title = prompt("Phase Title:");
    const description = prompt("Phase Description:");
    if (!title || !description) return;

    try {
      await api.post('/modules', {
        curriculum_id: curriculumId,
        title,
        description,
        teacher_id: faculty[0]?.id,
        order_index: (curriculums.find(c => c.id === curriculumId)?.modules?.length || 0) + 1,
        duration_months: 1
      });
      loadInitialData();
      toast({ title: "New Phase Architected" });
    } catch (error) {
      toast({ title: "Failed to add phase", variant: "destructive" });
    }
  };

  const handleAddArchitect = async () => {
    if (!newArchitectName || !newArchitectEmail || !newArchitectPassword) {
      toast({ title: "Missing Fields", description: "Name, Email and Password are required.", variant: "destructive" });
      return;
    }
    try {
      await api.post('/faculty', {
        name: newArchitectName,
        email: newArchitectEmail,
        password: newArchitectPassword,
        rank: newArchitectRank,
        bio: newArchitectBio
      });
      toast({ title: "Architect Onboarded", description: "Credentials created successfully." });
      setIsAddArchitectOpen(false);
      setNewArchitectName('');
      setNewArchitectEmail('');
      setNewArchitectPassword('');
      setNewArchitectBio('');
      loadInitialData();
    } catch (error) {
      toast({ title: "Onboarding Failed", description: "Email may already be valid.", variant: "destructive" });
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Board Overview' },
    { id: 'courses', icon: BookOpen, label: 'Course Library' },
    { id: 'recruitment', icon: ClipboardList, label: 'Recruitment' },
    { id: 'faculty', icon: Users, label: 'Faculty' },
    { id: 'cohorts', icon: Calendar, label: 'Global Cohorts' },
    { id: 'settings', icon: Settings, label: 'System Control' },
  ];

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Authenticating High Command...</p>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-50/50 -m-8">
      {/* BOD Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 space-y-8 sticky top-20 h-full">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Navigation</p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${activeTab === item.id
                ? 'bg-red-50 text-red-600 shadow-sm shadow-red-100/50'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <item.icon className={`h-5 w-5 transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
                }`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>}
            </button>
          ))}
        </div>

        <div className="mt-auto p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Academy Rank</p>
            <p className="font-black text-lg leading-tight">Board Director <br /> Overseer</p>
            <div className="pt-2">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-full bg-red-500"></div>
              </div>
            </div>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 rotate-12" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <FadeIn>
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Board Overview</h1>
                  <p className="text-slate-500 font-medium">Academy performance and system-wide metrics.</p>
                  {activeTab === 'overview' && analytics && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Command Center</h1>
                        <p className="text-slate-500 font-medium">Real-time academy performance metrics.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                          title="Enrollment Capacity"
                          value={analytics.metrics.enrollment_capacity.value}
                          label="Quarterly Target"
                          trend={analytics.metrics.enrollment_capacity.trend}
                          trendValue={analytics.metrics.enrollment_capacity.trend_value}
                          icon={Users}
                          color="blue"
                        />
                        <MetricCard
                          title="Course Completion"
                          value={analytics.metrics.course_completion.value}
                          label="Global Average"
                          trend={analytics.metrics.course_completion.trend}
                          trendValue={analytics.metrics.course_completion.trend_value}
                          icon={GraduationCap}
                          color="green"
                        />
                        <MetricCard
                          title="Academy Revenue"
                          value="$1.2M"
                          label="YTD Earnings"
                          trend="up"
                          trendValue="+18%"
                          icon={DollarSign}
                          color="emerald"
                        />
                        <MetricCard
                          title="Active Faculty"
                          value={analytics.metrics.active_faculty.value}
                          label="Certified Architects"
                          trend={analytics.metrics.active_faculty.trend}
                          trendValue={analytics.metrics.active_faculty.trend_value}
                          icon={Briefcase}
                          color="purple"
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] bg-white p-8">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <h3 className="text-xl font-black uppercase text-slate-900">Enrollment Velocity</h3>
                              <p className="text-sm text-slate-400 font-bold">New student intake over time</p>
                            </div>
                            <div className="flex gap-2">
                              {/* Placeholder filters can go here */}
                            </div>
                          </div>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={trends}>
                                <defs>
                                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                  dataKey="name"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                  dy={10}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip
                                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="students"
                                  stroke="#3b82f6"
                                  strokeWidth={4}
                                  fillOpacity={1}
                                  fill="url(#colorStudents)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>

                        <Card className="border-0 shadow-sm rounded-[2rem] bg-white p-8 flex flex-col">
                          <h3 className="text-xl font-black uppercase text-slate-900 mb-2">Program Reach</h3>
                          <p className="text-sm text-slate-400 font-bold mb-8">Distribution of majors</p>
                          <div className="flex-1 min-h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadialBarChart innerRadius="30%" outerRadius="100%" data={distribution} startAngle={180} endAngle={0}>
                                <RadialBar
                                  background
                                  dataKey="value"
                                  cornerRadius={10}
                                  label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip />
                                <RechartsLegend
                                  iconSize={8}
                                  layout="vertical"
                                  verticalAlign="middle"
                                  wrapperStyle={{ right: 0, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}
                                />
                              </RadialBarChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Platform Academy</h1>
                  <p className="text-slate-500 font-medium">Manage the source code of humor mastery.</p>
                </div>
                <Card className="p-4 rounded-3xl border-slate-100 shadow-sm flex items-center gap-6">
                  <div className="text-center px-4 border-r border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Courses</p>
                    <p className="text-xl font-black text-slate-800">{curriculums.length}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Phases</p>
                    <p className="text-xl font-black text-slate-800">{curriculums.reduce((acc, c) => acc + (c.modules?.length || 0), 0)}</p>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <Card className="xl:col-span-4 border-0 shadow-lg shadow-red-100/20 rounded-[2.5rem] bg-white h-fit sticky top-10">
                  <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-3">
                      <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                        <Plus className="w-5 h-5" />
                      </div>
                      Design New Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ">Program Title</label>
                      <Input value={newCurricTitle} onChange={(e) => setNewCurricTitle(e.target.value)} placeholder="e.g., Satire Mastery" className="rounded-xl border-slate-100 bg-slate-50/50 h-12 focus:ring-red-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vision & Strategy</label>
                      <Textarea value={newCurricDesc} onChange={(e) => setNewCurricDesc(e.target.value)} placeholder="The 'Why' behind this program..." className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[100px] focus:ring-red-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-blue-600">Learning Outcomes</label>
                      <Textarea value={newCurricOutcomes} onChange={(e) => setNewCurricOutcomes(e.target.value)} placeholder="What will they master?" className="rounded-xl border-blue-100 bg-blue-50/20 min-h-[80px] focus:ring-blue-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-orange-500">Prerequisites</label>
                      <Input value={newCurricPrereqs} onChange={(e) => setNewCurricPrereqs(e.target.value)} placeholder="e.g., Module 1 completion" className="rounded-xl border-orange-100 bg-orange-50/20 h-10 focus:ring-orange-500/20" />
                    </div>
                    <Button onClick={handleCreateCurriculum} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95">
                      Launch Program
                    </Button>
                  </CardContent>
                </Card>

                <div className="xl:col-span-8 space-y-8">
                  {curriculums.map(curric => (
                    <Card key={curric.id} className="border-0 shadow-sm hover:shadow-md transition-all rounded-[2.5rem] bg-white overflow-hidden group">
                      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-slate-800">{curric.title}</h3>
                            <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                              Active Program
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 font-medium max-w-lg leading-relaxed">{curric.description}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreHorizontal className="h-5 w-5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-slate-100">
                            <DropdownMenuItem className="font-bold text-xs py-3 rounded-xl">Edit Vision</DropdownMenuItem>
                            <DropdownMenuItem className="font-bold text-xs py-3 rounded-xl text-red-600">Retire Program</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syllabus Architecture</h4>
                          <Button variant="ghost" size="sm" onClick={() => setActiveTab('cohorts')} className="text-red-600 font-black text-[10px] uppercase hover:bg-red-50 rounded-lg">
                            Manage Cohorts
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {curric.modules?.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                              <p className="text-xs text-slate-300 font-bold italic tracking-wide">No Phases Drafted Yet</p>
                            </div>
                          ) : (
                            curric.modules?.map((m, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group/item hover:border-red-100 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="font-black text-slate-800 text-sm tracking-tight">{m.title}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estimated {m.duration_months} Months</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right flex flex-col items-end">
                                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Architect</p>
                                    <Select
                                      defaultValue={m.teacher_id?.toString()}
                                      onValueChange={(val) => handleUpdateModuleTeacher(m.id, val)}
                                    >
                                      <SelectTrigger className="w-[140px] h-8 rounded-lg border-slate-50 bg-slate-50 text-[10px] font-black text-slate-600">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="rounded-xl">
                                        {faculty.map(f => (
                                          <SelectItem key={f.id} value={f.id.toString()} className="text-[10px] font-bold">
                                            {f.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-200 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <Button variant="outline" className="w-full mt-6 h-12 rounded-2xl border-slate-200 text-slate-600 font-black text-xs uppercase hover:bg-slate-50 hover:border-slate-300 border-dashed" onClick={() => handleAddModule(curric.id)}>
                          <Plus className="w-4 h-4 mr-2" /> Insert New Phase
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Faculty High Command</h1>
                  <p className="text-slate-500 font-medium">Coordinate your global network of humor architects.</p>
                </div>
                <Button onClick={() => setIsAddArchitectOpen(true)} className="rounded-xl bg-red-600 text-white font-bold h-12 px-8">
                  <Users className="w-4 h-4 mr-2" /> Add Architect
                </Button>
                <Dialog open={isAddArchitectOpen} onOpenChange={setIsAddArchitectOpen}>
                  <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black text-slate-800">Onboard New Architect</DialogTitle>
                      <DialogDescription>Create credentials for a new faculty member.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={newArchitectName} onChange={e => setNewArchitectName(e.target.value)} placeholder="e.g. Dr. Jane Doe" className="bg-slate-50 border-0 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input value={newArchitectEmail} onChange={e => setNewArchitectEmail(e.target.value)} placeholder="email@academy.com" className="bg-slate-50 border-0 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Temporary Password</Label>
                        <Input type="password" value={newArchitectPassword} onChange={e => setNewArchitectPassword(e.target.value)} placeholder="Safe password" className="bg-slate-50 border-0 rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Rank/Title</Label>
                          <Input value={newArchitectRank} onChange={e => setNewArchitectRank(e.target.value)} placeholder="Senior Architect" className="bg-slate-50 border-0 rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Bio / Qualifications</Label>
                        <Textarea value={newArchitectBio} onChange={e => setNewArchitectBio(e.target.value)} placeholder="Brief professional summary..." className="bg-slate-50 border-0 rounded-xl min-h-[80px]" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddArchitect} className="w-full bg-slate-900 text-white rounded-xl font-bold h-12">Confirm Credentials</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {faculty.filter((f: any) => f.role === 'faculty').map(fac => (
                  <Card key={fac.id} className="border-0 shadow-sm rounded-3xl bg-white p-8 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-3">
                      <Button variant="ghost" size="icon" className="rounded-xl text-slate-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm">
                          <AvatarFallback className="bg-red-50 text-red-600 font-black text-2xl uppercase">{fac.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full border-4 border-white"></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800">{fac.name}</h3>
                        <p className="text-xs font-black text-red-600 uppercase tracking-widest mt-1">{fac.rank}</p>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2 italic font-medium">"{fac.bio || 'Architect bios pending approval...'}"</p>

                      <div className="w-full pt-4 grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-2xl text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Phases</p>
                          <p className="text-sm font-black text-slate-800">3</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Students</p>
                          <p className="text-sm font-black text-slate-800">128</p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-bold text-xs uppercase mt-2">
                        Review Syllabus
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recruitment' && (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Talent Acquisition</h1>
                  <p className="text-slate-500 font-medium">Review and onboard prospective humor architects.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Requests</p>
                  <p className="text-xl font-black text-red-600">{applications.filter(a => a.status === 'pending').length}</p>
                </div>
              </div>

              <div className="grid gap-6">
                {applications.length === 0 ? (
                  <Card className="p-20 text-center border-0 bg-white rounded-[2.5rem]">
                    <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold italic">No active applications in the review queue.</p>
                  </Card>
                ) : (
                  applications.map(app => (
                    <Card key={app.id} className="border-0 shadow-sm rounded-[2rem] bg-white overflow-hidden">
                      <div className="p-8 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-black text-slate-800">{app.user.name}</h3>
                              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{app.specialization}</p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                              app.status === 'approved' ? 'bg-green-50 text-green-600' :
                                'bg-red-50 text-red-600'
                              }`}>
                              {app.status}
                            </div>
                          </div>
                          <div className="bg-slate-50/50 p-6 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-primary/70">Experience Record</p>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{app.experience_summary}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                              <Calendar className="w-4 h-4" />
                              Applied {new Date(app.created_at).toLocaleDateString()}
                            </div>
                            {app.resume_link && (
                              <a href={app.resume_link} target="_blank" className="flex items-center gap-2 text-xs font-black text-red-600 uppercase hover:underline">
                                <Search className="w-4 h-4" /> View Credentials
                              </a>
                            )}
                          </div>
                        </div>
                        {app.status === 'pending' && (
                          <div className="flex md:flex-col gap-3 justify-center border-l md:pl-8 border-slate-100">
                            <Button
                              onClick={() => handleUpdateApplication(app.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 md:w-32 font-black text-[10px] uppercase shadow-lg shadow-green-100"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                            </Button>
                            <Button
                              onClick={() => handleUpdateApplication(app.id, 'rejected')}
                              variant="outline"
                              className="border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-xl h-12 md:w-32 font-black text-[10px] uppercase"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === 'cohorts' && (
            <div className="space-y-10">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Academy Timeline</h1>
                <p className="text-slate-500 font-medium">Board-level overview of all scheduled and active batches.</p>
              </div>
              <Card className="border-0 shadow-sm rounded-3xl bg-white">
                <div className="p-8 flex items-center justify-between border-b border-slate-50">
                  <div className="flex gap-4">
                    <Button variant="secondary" className="rounded-xl h-10 px-6 font-bold text-xs uppercase bg-slate-900 text-white hover:bg-slate-800">Active</Button>
                    <Button variant="ghost" className="rounded-xl h-10 px-6 font-bold text-xs uppercase text-slate-400 hover:text-slate-900">Planned</Button>
                    <Button variant="ghost" className="rounded-xl h-10 px-6 font-bold text-xs uppercase text-slate-400 hover:text-slate-900">Completed</Button>
                  </div>
                </div>
                <div className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-50 bg-slate-50/20">
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Cohort / Program</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Architect</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</th>
                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohorts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-bold italic">
                            No cohorts found. Launch a new program module to get started.
                          </td>
                        </tr>
                      ) : (
                        cohorts.map((cohort, i) => (
                          <tr key={cohort.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <p className="font-black text-slate-800 text-sm">BATCH-{100 + cohort.id}</p>
                                <p className="text-xs text-blue-600 font-bold">{cohort.module?.title || 'Unknown Module'}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-black text-[10px]">
                                  {cohort.module?.teacher?.name ? cohort.module.teacher.name.substring(0, 2).toUpperCase() : 'NA'}
                                </div>
                                <p className="text-xs font-bold text-slate-700">{cohort.module?.teacher?.name || 'Unassigned'}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <p className="text-xs font-black text-slate-800 uppercase">
                                  {new Date(cohort.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(cohort.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cohort.status}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-red-500 rounded-full"
                                    style={{ width: `${Math.min((cohort.enrollments_count / cohort.capacity) * 100, 100)}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs font-black text-slate-500">{cohort.enrollments_count}/{cohort.capacity}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${cohort.status === 'active' ? 'bg-green-50 text-green-600' :
                                cohort.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                                  'bg-blue-50 text-blue-600'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${cohort.status === 'active' ? 'bg-green-500' :
                                  cohort.status === 'completed' ? 'bg-slate-500' :
                                    'bg-blue-500'
                                  }`}></div>
                                <p className="text-[10px] font-black uppercase tracking-widest">{cohort.status}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button variant="ghost" size="icon" className="invisible group-hover:visible transition-all">
                                <ArrowUpRight className="h-4 w-4 text-slate-400" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-red-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-200">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Board Control</h1>
                <p className="text-slate-500 font-medium">Academy-wide governance and security settings.</p>
              </div>

              <div className="grid gap-6">
                <Card className="border-0 shadow-sm rounded-3xl bg-white p-8 group hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-red-50 text-red-600 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight">Audit Credentials</h3>
                        <p className="text-sm font-medium opacity-50">Review and authorize level high-level clearances.</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:text-white">
                      <ArrowUpRight className="h-6 w-6" />
                    </Button>
                  </div>
                </Card>

                <Card className="border-0 shadow-sm rounded-3xl bg-white p-8 group hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight">Financial Oversight</h3>
                        <p className="text-sm font-medium opacity-50">Manage academy grants and program funding.</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="group-hover:text-white">
                      <ArrowUpRight className="h-6 w-6" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </FadeIn>
      </main>
    </div>
  );
};