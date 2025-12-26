import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  BookOpen,
  Target,
  GraduationCap,
  Calendar,
  Star,
  Zap,
  Clock,
  ArrowRight,
  Activity,
  MapPin,
  Phone,
  LayoutDashboard,
  MessageSquare,
  FileText,
  ClipboardCheck,
  Search,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  X,
  Menu,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { useState, useEffect } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import { StudentCourses } from "@/components/StudentCourses";
import { ContentBrowser } from "@/components/ContentBrowser";
import { NotificationCenter } from "@/components/NotificationCenter";
import { moduleService, Enrollment } from "@/lib/modules";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

interface StudentDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
    bio?: string | null;
    city?: string | null;
    phone?: string | null;
  };
}

const sidebarItems = [
  { icon: LayoutDashboard, id: 'overview', label: 'Dashboard' },
  { icon: BookOpen, id: 'courses', label: 'Course Explorer' },
  { icon: Target, id: 'assignments', label: 'Assignments' },
  { icon: GraduationCap, id: 'classmates', label: 'Classmates' },
  { icon: Calendar, id: 'events', label: 'Events' },
  { icon: Trophy, id: 'achievements', label: 'Achievements' },
];

const learningActivityData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 1.2 },
  { name: 'Thu', hours: 4.5 },
  { name: 'Fri', hours: 5.0 },
  { name: 'Sat', hours: 2.0 },
  { name: 'Sun', hours: 1.5 },
];

const progressGoalData = [
  { name: 'Progress', value: 68, fill: '#3b82f6' },
];

interface MetricCardProps {
  title: string;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | null;
  trendValue?: string;
  icon: any; // Lucide icon type is complex, leaving any for now or using LucideIcon
  color: string;
}

const MetricCard = ({ title, value, label, trend, trendValue, icon: Icon, color }: MetricCardProps) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden group rounded-2xl">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold text-slate-500">{title}</CardTitle>
      <div className={`p-2 rounded-xl bg-${color}/10 text-${color}`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight mb-1 text-slate-800">{value}</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        {trend && (
          <div className={`flex items-center text-[10px] font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'classmates' | 'courses' | 'assignments' | 'events' | 'achievements'>('overview');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingContent, setViewingContent] = useState<{ cohortId: number, title: string } | null>(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true);
      const data = await moduleService.listRequests(); // This returns current user's enrollments if student
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeEnrollments = enrollments.filter(e => e.status === 'approved');
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    if (viewingContent) {
      return (
        <ContentBrowser
          cohortId={viewingContent.cohortId}
          moduleTitle={viewingContent.title}
          onBack={() => setViewingContent(null)}
        />
      );
    }

    switch (activeTab) {
      case 'classmates':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UserManagement
              currentUserRole="student"
              allowedRoles={['student']}
              title="Fellow Students"
              description="View and connect with other students in the institute"
              canEdit={false}
            />
          </div>
        );
      case 'courses':
        return <StudentCourses onBack={() => setActiveTab('overview')} />;
      case 'assignments':
        return (
          <div className="space-y-6 animate-in fade-in duration-500 text-center py-20 bg-white/50 border-2 border-dashed border-muted rounded-[2.5rem] text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold">Assignments Coming Soon</h3>
            <p>Your upcoming tasks and evaluations will appear here.</p>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6 animate-in fade-in duration-500 text-center py-20 bg-white/50 border-2 border-dashed border-muted rounded-[2.5rem] text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold">Schedule & Events</h3>
            <p>Sync your calendar with institute events and workshops.</p>
          </div>
        );
      case 'achievements':
        return (
          <div className="space-y-6 animate-in fade-in duration-500 text-center py-20 bg-white/50 border-2 border-dashed border-muted rounded-[2.5rem] text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold">Your Achievements</h3>
            <p>Badges, certificates, and milestones won will be displayed here.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-700">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-800">Welcome back, {user.name.split(' ')[0]}!</h2>
                  <p className="text-slate-500 text-sm">You've completed 68% of your weekly learning goal.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs bg-white text-slate-600 hover:bg-slate-50">
                    This Week
                    <Calendar className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Active Courses" value={activeEnrollments.length} label="Courses in progress" trend={activeEnrollments.length > 0 ? "up" : null} trendValue="+1" icon={BookOpen} color="blue-600" />
                <MetricCard title="Community Points" value="1,250" label="Top 10% performance" trend="up" trendValue="15%" icon={Star} color="purple-600" />
                <MetricCard title="Enrollment" value={pendingEnrollments.length} label="Pending approval" icon={Target} color="orange-600" />
                <MetricCard title="Time Spent" value="24h" label="Learning this week" trend="up" trendValue="12.5%" icon={Clock} color="green-600" />
              </div>
            </section>

            <section>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-12 border-0 shadow-sm bg-white overflow-hidden rounded-[2rem]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-800">My Course Roadmap</CardTitle>
                        <CardDescription>Progress through your enrolled courses</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50 px-3">
                        {activeEnrollments.length} Active {activeEnrollments.length === 1 ? 'Course' : 'Courses'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeEnrollments.length > 0 ? (
                      <div className="space-y-10">
                        {activeEnrollments.map((enrollment) => (
                          <div key={enrollment.id} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/20 shadow-sm">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                              <div className="flex items-center gap-5">
                                <div className="p-4 bg-blue-600 rounded-[1.5rem] text-white shadow-xl shadow-blue-100">
                                  <GraduationCap className="h-7 w-7" />
                                </div>
                                <div>
                                  <h4 className="font-black text-slate-800 text-xl tracking-tight">{enrollment.cohort?.module?.curriculum?.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-2 py-0 text-[9px] font-bold">CURRENT PHASE</Badge>
                                    <span className="text-sm text-slate-500 font-medium">{enrollment.cohort?.module?.title}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 w-full md:w-auto">
                                <Button
                                  className="flex-1 md:flex-none rounded-2xl bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                                  variant="outline"
                                  onClick={() => setActiveTab('courses')}
                                >
                                  Program Details
                                </Button>
                                <Button
                                  className="flex-1 md:flex-none rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 px-6"
                                  onClick={() => {
                                    if (enrollment.cohort_id) {
                                      setViewingContent({
                                        cohortId: enrollment.cohort_id,
                                        title: enrollment.cohort?.module?.title || "Module Content"
                                      });
                                    }
                                  }}
                                >
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Study Materials
                                </Button>
                              </div>
                            </div>

                            <div className="relative">
                              {/* Timeline line */}
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 hidden lg:block" />

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                                {/* Currently, we only have the current enrollment. 
                                      In a real app, we'd fetch the whole curriculum roadmap here.
                                      For now, we'll show the current module as active and placeholders for neighbors. */}
                                <div className="p-5 rounded-3xl bg-white border-2 border-blue-600 shadow-xl shadow-blue-50 ring-4 ring-blue-50/50">
                                  <div className="flex justify-between items-start mb-3">
                                    <Badge className="bg-blue-600 text-white border-0 text-[8px] px-2">ACTIVE</Badge>
                                    <span className="text-[10px] font-black text-slate-300">PHASE {enrollment.cohort?.module?.order_index}</span>
                                  </div>
                                  <p className="font-bold text-slate-800 text-sm line-clamp-1">{enrollment.cohort?.module?.title}</p>
                                  <Progress value={45} className="h-1.5 mt-3 bg-slate-100" />
                                </div>

                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 border-dashed flex flex-col items-center justify-center text-center group hover:bg-white transition-colors">
                                  <Zap className="h-5 w-5 text-slate-200 mb-2 group-hover:text-blue-400 transition-colors" />
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Up</p>
                                  <p className="text-[10px] text-slate-300 mt-1 italic">Advance to unlock</p>
                                </div>

                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 border-dashed flex items-center justify-center lg:col-span-2">
                                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest opacity-50">Future Phases Under Architects' Review</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-8 w-8 text-slate-300" />
                        </div>
                        <h4 className="font-bold text-slate-800">No active programs</h4>
                        <p className="text-slate-500 text-sm mb-6">Choose a curriculum to start your learning journey.</p>
                        <Button className="bg-gradient-primary border-0 rounded-xl px-8" onClick={() => setActiveTab('courses')}>
                          Explore Programs
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 border-0 shadow-sm bg-white overflow-hidden flex flex-col rounded-[2rem]">
                <CardHeader className="pb-0 border-b-0 space-y-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">Course Goals</CardTitle>
                      <CardDescription className="text-xs">Overall completion progress</CardDescription>
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
                      data={progressGoalData}
                      startAngle={210}
                      endAngle={-30}
                    >
                      <RadialBar
                        background={{ fill: '#F1F5F9' }}
                        dataKey="value"
                        cornerRadius={10}
                        fill="#3b82f6"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Activity className="text-blue-400 w-5 h-5 mb-1" />
                    <span className="text-4xl font-extrabold tracking-tight text-slate-800">68%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">Goal: 100% Mastered</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-7 border-0 shadow-sm bg-white overflow-hidden rounded-[2rem]">
                <CardHeader className="pb-2 space-y-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">Learning Activity</CardTitle>
                      <CardDescription className="text-xs">Hours spent learning daily</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-bold text-slate-600">Daily average: 3.2h</span>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-2">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={learningActivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                                  You spent <span className="font-bold underline text-blue-400">{payload[0].value} hours</span><br />
                                  honing your craft on {payload[0].payload.name}.
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="hours"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                      >
                        {learningActivityData.map((entry, index) => (
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

            <section>
              <h3 className="text-lg font-bold mb-4 text-slate-800">Explore & Learn</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Course Catalog', icon: BookOpen, tab: 'courses', color: 'blue-600' },
                  { label: 'Find Classmates', icon: GraduationCap, tab: 'classmates', color: 'purple-600' },
                  { label: 'View Events', icon: Calendar, tab: 'events', color: 'orange-600' },
                  { label: 'Platform Stats', icon: Zap, tab: 'overview', color: 'green-600' },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="outline"
                    onClick={() => setActiveTab(item.tab as 'overview' | 'classmates' | 'courses' | 'assignments' | 'events' | 'achievements')}
                    className="h-28 rounded-[2rem] border-0 shadow-sm bg-white hover:shadow-md transition-all flex flex-col gap-3 group"
                  >
                    <div className={`p-3 rounded-2xl bg-${item.color}/10 text-${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                  </Button>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-5.5rem)] bg-[#F8FAFC] overflow-hidden">
      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden px-10 py-8 bg-[#F8FAFC]">
        {/* Header */}
        <header className="flex items-center justify-between mb-10 shrink-0 gap-8">
          {/* Dashboard Navigation Tabs (Simplified) */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as 'overview' | 'classmates' | 'courses' | 'assignments' | 'events' | 'achievements')}
                className={`flex items-center gap-2 py-2 transition-all duration-300 whitespace-nowrap group relative ${activeTab === item.id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
              >
                <item.icon className={`h-4.5 w-4.5 shrink-0 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="text-sm font-bold tracking-tight">
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Expandable Search */}
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

            <div className="flex items-center gap-3">
              <NotificationCenter userId={user.name} />

              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm"
              >
                <Settings className="h-5 w-5" />
              </Button>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block mx-1" />

              {/* User Profile Quick Access (ReadOnly) */}
              <div
                className="flex items-center gap-3 p-1 rounded-2xl bg-white/50 border border-slate-100/50 shadow-sm"
              >
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
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-4 -mr-4 no-scrollbar pb-10">
          <FadeIn direction="none" delay={100}>
            {renderContent()}
          </FadeIn>
        </div>
      </div>
    </div>
  );
};