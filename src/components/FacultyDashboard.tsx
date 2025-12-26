import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BarChart3,
  Star,
  Bell,
  FileText,
  GraduationCap,
  ClipboardCheck,
  Search,
  LayoutDashboard,
  Calendar,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Check,
  X,
  Calendar as CalendarIcon,
  LogOut,
} from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AssessmentCreation } from "@/components/AssessmentCreation";
import { MaterialsManager } from "@/components/MaterialsManager";
import { GradingInterface } from "@/components/GradingInterface";
import { EventsManager } from "@/components/EventsManager";
import { useState, useEffect } from "react";
import { moduleService, Module, Cohort, Enrollment } from "@/lib/modules";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Cell
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

interface FacultyDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
  userId?: string;
}

const sidebarItems = [
  { icon: LayoutDashboard, id: 'overview', label: 'Analytics' },
  { icon: FileText, id: 'materials', label: 'Materials' },
  { icon: Calendar, id: 'events', label: 'Events' },
  { icon: GraduationCap, id: 'students', label: 'Students' },
  { icon: ClipboardCheck, id: 'grading', label: 'Grading' },
  { icon: Star, id: 'assessments', label: 'Assessments' },
];

const studentGrowthData = [
  { name: '2k', students: 4000 },
  { name: '4k', students: 3000 },
  { name: '6k', students: 6500 },
  { name: '8k', students: 4500 },
  { name: '10k', students: 9003 },
  { name: '12k', students: 5000 },
];

const performanceData = [
  { name: 'Engagement', value: 77, fill: '#ef4444' },
];

const MetricCard = ({ title, value, label, trend, trendValue, icon: Icon, color }: any) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden group rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold text-slate-500">{title}</CardTitle>
      <div className={`p-2 rounded-xl bg-slate-50 text-${color}`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight mb-1 text-slate-800">{value}</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <div className={`flex items-center text-[10px] font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trendValue}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const FacultyDashboard = ({ user, userId }: FacultyDashboardProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assessments' | 'materials' | 'grading' | 'requests' | 'events'>('overview');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [studentViewTab, setStudentViewTab] = useState<'directory' | 'applications'>('directory');
  const [requests, setRequests] = useState<Enrollment[]>([]);
  const { toast } = useToast();

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [userId]);

  const loadInitialData = async () => {
    try {
      const myModules = await moduleService.listModules();
      setModules(myModules);
      if (myModules.length > 0) {
        setSelectedModule(myModules[0]);
        loadCohorts(myModules[0].id);
      }
    } catch (error) {
      console.error("Failed to load initial faculty data", error);
    }
  };

  const loadCohorts = async (moduleId: number) => {
    try {
      const data = await moduleService.listCohorts(moduleId);
      setCohorts(data);
      if (data.length > 0) {
        const active = data.find(c => c.status === 'active') || data[0];
        setSelectedCohort(active);
      }
    } catch (error) {
      console.error("Failed to load cohorts", error);
    }
  };

  const loadRequests = async () => {
    try {
      const data = await moduleService.listRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to load requests", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'students' && studentViewTab === 'applications') {
      loadRequests();
    }
  }, [activeTab, studentViewTab]);

  const handleRequest = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await moduleService.updateStatus(id, status);
      toast({ title: `Request ${status}` });
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      toast({ title: "Operation failed", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-1">
              <button
                onClick={() => setStudentViewTab('directory')}
                className={`pb-3 px-1 text-sm font-bold transition-all relative ${studentViewTab === 'directory' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Student Directory
                {studentViewTab === 'directory' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
              <button
                onClick={() => setStudentViewTab('applications')}
                className={`pb-3 px-1 text-sm font-bold transition-all relative ${studentViewTab === 'applications' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Course Applications
                {requests.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full">
                    {requests.length}
                  </span>
                )}
                {studentViewTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            </div>

            {studentViewTab === 'directory' ? (
              <UserManagement currentUserRole="faculty" allowedRoles={['student']} title="Student Directory" description="Manage and track learner progress" canEdit={true} />
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {requests.map(req => (
                    <Card key={req.id} className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow rounded-2xl">
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{req.student?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-slate-800">{req.student?.name}</h3>
                            <p className="text-sm text-slate-500">Applied for <span className="font-semibold text-blue-600">{req.cohort?.module?.title} ({req.cohort?.title})</span></p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline" className="rounded-xl text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleRequest(req.id, 'approved')}>
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRequest(req.id, 'rejected')}>
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {requests.length === 0 && (
                    <div className="text-center py-20 bg-white/50 border-2 border-dashed border-muted rounded-[2rem] text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="font-medium">No pending applications at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'assessments':
        return <AssessmentCreation facultyId={userId || ''} cohortId={selectedCohort?.id?.toString()} />;
      case 'materials':
        return <MaterialsManager facultyId={userId || ''} cohortId={selectedCohort?.id?.toString()} />;
      case 'grading':
        return <GradingInterface facultyId={userId || ''} cohortId={selectedCohort?.id?.toString()} />;
      case 'events':
        return <EventsManager teacherId={userId || ''} cohortId={selectedCohort?.id?.toString()} />;
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-700">
            <section>
              <h3 className="text-lg font-bold mb-4 text-slate-800">Quick Actions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Host Event', icon: CalendarIcon, tab: 'events', color: 'blue-600' },
                  {
                    label: 'Review Requests',
                    icon: Users,
                    onClick: () => {
                      setActiveTab('students');
                      setStudentViewTab('applications');
                    },
                    color: 'purple-600'
                  },
                  { label: 'Grade Tasks', icon: ClipboardCheck, tab: 'grading', color: 'orange-600' },
                  { label: 'New Syllabus', icon: Plus, tab: 'materials', color: 'green-600' },
                ].map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    onClick={() => action.onClick ? action.onClick() : setActiveTab(action.tab as any)}
                    className="h-28 rounded-[2rem] border-0 shadow-sm bg-white hover:shadow-md transition-all flex flex-col gap-3 group"
                  >
                    <div className={`p-3 rounded-2xl bg-slate-50 text-${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{action.label}</span>
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-800">Analytics Overview</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs bg-white text-slate-600 hover:bg-slate-50">
                    Last 30 days
                    <Calendar className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Engagement" value="18.2%" label="Avg. engagement" trend="up" trendValue="12.7%" icon={BarChart3} color="green-600" />
                <MetricCard title="Active Students" value="1,240" label="Total enrolled" trend="up" trendValue="8.2%" icon={Users} color="blue-600" />
                <MetricCard title="Pending Tasks" value="42" label="Needs review" trend="down" trendValue="5%" icon={ClipboardCheck} color="orange-600" />
                <MetricCard title="Grading Speed" value="1.2d" label="Avg. turnaround" icon={Star} color="purple-600" />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 border-0 shadow-sm bg-white overflow-hidden flex flex-col rounded-[2rem]">
                <CardHeader className="pb-0 border-b-0 space-y-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">Performance Insights</CardTitle>
                      <CardDescription className="text-xs">Most Recent Activity</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center pt-6 min-h-[300px] relative">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="80%"
                      outerRadius="100%"
                      barSize={12}
                      data={performanceData}
                      startAngle={210}
                      endAngle={-30}
                    >
                      <RadialBar
                        background={{ fill: '#F1F5F9' }}
                        dataKey="value"
                        cornerRadius={10}
                        fill="#ef4444"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Star className="text-red-400 w-5 h-5 mb-1" />
                    <span className="text-4xl font-extrabold tracking-tight text-slate-800">29.2k</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">Goal: 36,000 (77%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-7 border-0 shadow-sm bg-white overflow-hidden rounded-[2rem]">
                <CardHeader className="pb-2 space-y-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">Student Growth</CardTitle>
                      <CardDescription className="text-xs">Enrollment trends over time</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-bold text-slate-600">12.8k learners</span>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-2">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={studentGrowthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: '#A3A3A3' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 600, fill: '#A3A3A3' }}
                        dx={-5}
                      />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#1a1c1e] text-white p-3 rounded-2xl shadow-xl border-0 animate-in fade-in zoom-in-95">
                                <p className="text-[10px] leading-relaxed">
                                  With <span className="font-bold underline text-blue-400">22.8% growth rate</span><br />
                                  we are steadily growing<br />
                                  our community.
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="students"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                      >
                        {studentGrowthData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 4 ? '#2563eb' : '#F1F5F9'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-5.5rem)] bg-[#F8FAFC] overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden px-10 py-8 bg-[#F8FAFC]">
        <header className="flex items-center justify-between mb-10 shrink-0 gap-8">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 py-2 transition-all duration-300 whitespace-nowrap group relative ${activeTab === item.id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                <item.icon className={`h-4.5 w-4.5 shrink-0 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="text-sm font-bold tracking-tight">
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <Select
                value={selectedCohort?.id?.toString()}
                onValueChange={(val) => setSelectedCohort(cohorts.find(c => c.id.toString() === val) || null)}
              >
                <SelectTrigger className="w-[180px] bg-white rounded-2xl border-slate-100 shadow-sm text-xs font-bold h-11">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <SelectValue placeholder="Select Cohort" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  {cohorts.map(cohort => (
                    <SelectItem key={cohort.id} value={cohort.id.toString()} className="text-xs font-medium py-3">
                      {cohort.title} ({cohort.status})
                    </SelectItem>
                  ))}
                  {cohorts.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">No batches created</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden lg:block mx-1" />

            <div className={`flex items-center bg-white rounded-2xl transition-all duration-300 shadow-sm border border-slate-100 ${isSearchExpanded ? 'w-64 px-4' : 'w-11 px-0 justify-center'}`}>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-50 h-9 w-9 shrink-0 transition-colors ${isSearchExpanded ? 'mr-2' : ''}`}
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                title="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
              <input
                type="text"
                placeholder="Search..."
                className={`bg-transparent border-0 focus:ring-0 text-xs font-medium placeholder:text-slate-400 transition-all duration-300 outline-none ${isSearchExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
                autoFocus={isSearchExpanded}
              />
            </div>

            <NotificationCenter userId={userId || ''} />

            <Button variant="ghost" size="icon" className="rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm">
              <Settings className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3 p-1 rounded-2xl bg-white/50 border border-slate-100/50 shadow-sm">
              <Avatar className="h-9 w-9 border border-white shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-[11px] font-bold text-slate-700 truncate max-w-[80px]">{user.name}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">{user.rank}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl text-red-400 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4 no-scrollbar pb-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};