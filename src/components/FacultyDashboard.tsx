import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart3, Star, Bell, FileText, GraduationCap, ClipboardCheck } from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { NotificationCenter } from "@/components/NotificationCenter";
import { AssessmentCreation } from "@/components/AssessmentCreation";
import { MaterialsManager } from "@/components/MaterialsManager";
import { GradingInterface } from "@/components/GradingInterface";
import { useState } from "react";

interface FacultyDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
  userId?: string;
}

export const FacultyDashboard = ({ user, userId }: FacultyDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assessments' | 'materials' | 'grading'>('overview');

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
          </div>
          {userId && <NotificationCenter userId={userId} />}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">Students</CardTitle>
            <Users className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">24</div>
            <p className="text-xs text-secondary-foreground/70">Active learners</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Created this term</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
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
              className="w-full bg-gradient-primary border-0 hover:shadow-glow"
              onClick={() => setActiveTab('students')}
            >
              Manage Students
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