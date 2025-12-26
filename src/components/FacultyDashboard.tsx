import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart3, Star, Bell, FileText, GraduationCap, ClipboardCheck } from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AssessmentCreation } from "@/components/AssessmentCreation";
import { MaterialsManager } from "@/components/MaterialsManager";
import { GradingInterface } from "@/components/GradingInterface";
import { useState, useEffect } from "react";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import { courseService, Enrollment } from "@/lib/courses";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

interface FacultyDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
  userId?: string;
}

export const FacultyDashboard = ({ user, userId }: FacultyDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assessments' | 'materials' | 'grading' | 'requests'>('overview');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [requests, setRequests] = useState<Enrollment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'requests') {
      loadRequests();
    }
  }, [activeTab]);

  const loadRequests = async () => {
    try {
      const data = await courseService.listRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to load requests", error);
    }
  };

  const handleRequest = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await courseService.updateStatus(id, status);
      toast({ title: `Request ${status}` });
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      toast({ title: "Operation failed", variant: "destructive" });
    }
  };

  if (activeTab === 'requests') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Course Requests</span>
            </h1>
            <p className="text-muted-foreground">Manage incoming student enrollment applications</p>
          </div>
          <Button variant="outline" onClick={() => setActiveTab('overview')}>Back</Button>
        </div>

        <div className="grid gap-4">
          {requests.map(req => (
            <Card key={req.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-bold text-lg">{req.student?.name}</h3>
                  <p className="text-muted-foreground">{req.course?.title}</p>
                  {req.student?.bio && <p className="text-sm mt-1 italic">"{req.student.bio}"</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleRequest(req.id, 'approved')}>
                    <Check className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleRequest(req.id, 'rejected')}>
                    <X className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground card border-dashed">
              No pending requests.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'students') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Star className="h-6 w-6 text-primary" />
              <span>Student Management</span>
            </h1>
            <p className="text-muted-foreground">Manage your students and track their progress</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setActiveTab('overview')}
          >
            Back to Overview
          </Button>
        </div>
        <UserManagement
          currentUserRole="faculty"
          allowedRoles={['student']}
          title="My Students"
          description="Manage student accounts, grades, and academic progress"
          canEdit={true}
        />
      </div>
    );
  }

  if (activeTab === 'assessments') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>Assessment Management</span>
            </h1>
            <p className="text-muted-foreground">Create and manage assessments for your students</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setActiveTab('overview')}
          >
            Back to Overview
          </Button>
        </div>
        <AssessmentCreation facultyId={userId || ''} />
      </div>
    );
  }

  if (activeTab === 'materials') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span>Course Materials</span>
            </h1>
            <p className="text-muted-foreground">Manage study materials and resources</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setActiveTab('overview')}
          >
            Back to Overview
          </Button>
        </div>
        <MaterialsManager facultyId={userId || ''} />
      </div>
    );
  }

  if (activeTab === 'grading') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              <span>Grade Submissions</span>
            </h1>
            <p className="text-muted-foreground">Review and grade student submissions</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setActiveTab('overview')}
          >
            Back to Overview
          </Button>
        </div>
        <GradingInterface facultyId={userId || ''} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Faculty Dashboard</h1>
            <p className="text-primary-foreground/80">{user.name} • {user.rank} • Level {user.level}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
              onClick={() => setShowProfileDialog(true)}
            >
              Edit Profile
            </Button>
          </div>
          {userId && <NotificationCenter userId={userId} />}
        </div>
      </div>
      <ProfileEditDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">Students</CardTitle>
            <Users className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">--</div>
            <p className="text-xs text-secondary-foreground/70">Active learners</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Created this term</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-academic hover:shadow-glow transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Student Management</span>
            </CardTitle>
            <CardDescription>View and manage your students</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-gradient-primary border-0 hover:shadow-glow mb-2"
              onClick={() => setActiveTab('students')}
            >
              Manage Students
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setActiveTab('requests')}
            >
              Review Applications
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-academic hover:shadow-glow transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Assessments</span>
            </CardTitle>
            <CardDescription>Create and manage assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-gradient-primary border-0 hover:shadow-glow"
              onClick={() => setActiveTab('assessments')}
            >
              Create Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-academic hover:shadow-glow transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Materials</span>
            </CardTitle>
            <CardDescription>Upload and organize materials</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-gradient-primary border-0 hover:shadow-glow"
              onClick={() => setActiveTab('materials')}
            >
              Manage Materials
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-academic hover:shadow-glow transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <span>Grading</span>
            </CardTitle>
            <CardDescription>Review and grade submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic"
              onClick={() => setActiveTab('grading')}
            >
              Grade Submissions
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-academic hover:shadow-glow transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Course Analytics</span>
            </CardTitle>
            <CardDescription>View performance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-academic hover:shadow-glow transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Announcements</span>
            </CardTitle>
            <CardDescription>Send notifications to students</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
              Send Announcement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};