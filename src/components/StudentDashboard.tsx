import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, BookOpen, Target, GraduationCap, Calendar, Star, Zap, Clock, ArrowRight, Activity, MapPin, Phone } from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Badge } from "@/components/ui/badge";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";

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

export const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'classmates'>('overview');
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const upcomingEvents = [
    { title: "Storytelling Workshop", date: "Tomorrow, 5:00 PM", type: "Workshop" },
    { title: "Open Mic Night", date: "Fri, 7:00 PM", type: "Event" },
  ];

  const recentCourses = [
    { title: "Humour in Leadership", progress: 65, total: 12, completed: 8 },
    { title: "Voice Modulation", progress: 30, total: 10, completed: 3 },
  ];

  if (activeTab === 'classmates') {
    return (
      <FadeIn>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3 tracking-tight">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <span>Classmates</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">Connect with fellow students in your institute</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveTab('overview')}
              className="hover:bg-primary/5"
            >
              Back to Dashboard
            </Button>
          </div>
          <UserManagement
            currentUserRole="student"
            allowedRoles={['student']}
            title="Fellow Students"
            description="View and connect with other students in the institute"
            canEdit={false}
          />
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="space-y-8 pb-12">
        {/* Modern Welcome Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-primary p-8 md:p-12 text-primary-foreground shadow-2xl">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <Badge variant="secondary" className="mb-4 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md">
                  Profile
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                  Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-primary-foreground/90 text-lg max-w-xl leading-relaxed">
                  {user.bio ? `"${user.bio}"` : '"Humour is mankind\'s greatest blessing." — Mark Twain'}
                  <br />
                  <span className="text-sm opacity-75 mt-2 block">You're on a 5-day streak! Keep it up.</span>
                </p>
                {user.city && (
                  <div className="flex items-center gap-2 mt-4 text-primary-foreground/80 text-sm">
                    <MapPin className="h-4 w-4" />
                    {user.city}
                  </div>
                )}
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
                    onClick={() => setShowProfileDialog(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-sm font-medium opacity-80">Current Rank</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  {user.rank}
                </div>
                <div className="text-xs opacity-60">Level {user.level} Scholar</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses in Progress</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">+1 from last month</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Community Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground mt-1">Top 10% of students</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assignments</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">2 pending review</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-card to-secondary/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Continue Learning</span>
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentCourses.map((course, i) => (
                  <div key={i} className="group p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 hover:border-primary/20 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.completed} / {course.total} modules</p>
                      </div>
                      <Button size="sm" className="hidden group-hover:flex transition-all">Resume</Button>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 group"
              >
                <BookOpen className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">Course Catalog</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 group"
                onClick={() => setActiveTab('classmates')}
              >
                <GraduationCap className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">Classmate Directory</span>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="bg-primary/10 p-2 rounded-md text-center min-w-[3.5rem]">
                      <span className="block text-xs font-bold uppercase text-primary">{event.date.split(',')[0]}</span>
                      <span className="block text-sm font-bold">{event.date.split(',')[1].trim().split(' ')[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge variant="secondary" className="mt-1 text-[10px]">{event.type}</Badge>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-sm hover:text-primary">
                  View Calendar <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Daily Tip */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 shrink-0 text-yellow-300" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Daily Tip</h4>
                    <p className="text-xs opacity-90 leading-relaxed">
                      "Pause for 2 seconds before delivering a punchline. Silence increases anticipation."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <ProfileEditDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
      </div>
    </FadeIn>
  );
};