import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, BookOpen, Target, GraduationCap } from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { useState } from "react";

interface StudentDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'classmates'>('overview');

  if (activeTab === 'classmates') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span>Classmates</span>
            </h1>
            <p className="text-muted-foreground">Connect with fellow students in your institute</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('overview')}
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-glow">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-primary-foreground/80">{user.rank} • Level {user.level}</p>
      </div>

      {/* Current Progress */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span>Your Progress</span>
          </CardTitle>
          <CardDescription>Track your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress to Next Level</span>
              <span>65%</span>
            </div>
            <Progress value={65} className="h-3" />
            <p className="text-sm text-muted-foreground">Complete assignments to advance</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Learning Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-primary border-0 hover:shadow-glow">
              Access Course Materials
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Classmates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic"
              onClick={() => setActiveTab('classmates')}
            >
              View Classmates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};