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
import { NotificationCenter } from "@/components/NotificationCenter";
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
  { icon: BookOpen, id: 'courses', label: 'My Courses' },
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

const MetricCard = ({ title, value, label, trend, trendValue, icon: Icon, color }: any) => (
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
  const [activeTab, setActiveTab] = useState<'overview' | 'classmates' | 'courses' | 'assignments' | 'events' | 'achievements'>('overview');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
                <MetricCard title="Active Courses" value="3" label="Courses in progress" trend="up" trendValue="+1" icon={BookOpen} color="blue-600" />
                <MetricCard title="Community Points" value="1,250" label="Top 10% performance" trend="up" trendValue="15%" icon={Star} color="purple-600" />
                <MetricCard title="Assignments" value="12" label="2 pending review" icon={Target} color="orange-600" />
                <MetricCard title="Time Spent" value="24h" label="Learning this week" trend="up" trendValue="12.5%" icon={Clock} color="green-600" />
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
                  { label: 'Profile Settings', icon: Settings, action: () => setShowProfileDialog(true), color: 'green-600' },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="outline"
                    onClick={item.action ? item.action : () => setActiveTab(item.tab as any)}
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
          {/* Dashboard Navigation Tabs (Horizontal) */}
          <div className="flex items-center gap-1 bg-white/50 p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:text-blue-600 hover:bg-white'}`}
              >
                <item.icon className={`h-4.5 w-4.5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span className="text-sm font-bold tracking-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {/* Relocated Search */}
            <div className="relative w-64 group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search resources..."
                className="pl-11 h-11 bg-white border-0 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-600/10 rounded-2xl placeholder:text-slate-400 text-xs font-medium w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <NotificationCenter userId={user.name} />

              <Button
                variant="ghost"
                size="icon"
                className="rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm"
                onClick={() => setShowProfileDialog(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block mx-1" />

              {/* User Profile Quick Access */}
              <div
                className="flex items-center gap-3 p-1 rounded-2xl hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-100 group"
                onClick={() => setShowProfileDialog(true)}
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
        <div className="flex-1 overflow-y-auto pr-4 -mr-4 scrollbar-hide pb-10">
          <FadeIn direction="none" delay={100}>
            {renderContent()}
          </FadeIn>
        </div>
      </div>
      <ProfileEditDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
    </div>
  );
};