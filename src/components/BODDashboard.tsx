import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Users, TrendingUp, Settings } from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { useState } from "react";

interface BODDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const BODDashboard = ({ user }: BODDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'faculty' | 'students'>('overview');

  if (activeTab === 'faculty') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Crown className="h-6 w-6 text-primary" />
              <span>Faculty Management</span>
            </h1>
            <p className="text-muted-foreground">Manage faculty members and their permissions</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('overview')}
          >
            Back to Overview
          </Button>
        </div>
        <UserManagement
          currentUserRole="bod"
          allowedRoles={['faculty']}
          title="Faculty Members"
          description="Manage faculty accounts, roles, and permissions"
          canEdit={true}
        />
      </div>
    );
  }

  if (activeTab === 'students') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <Crown className="h-6 w-6 text-primary" />
              <span>Student Management</span>
            </h1>
            <p className="text-muted-foreground">Manage student accounts and academic progress</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('overview')}
          >
            Back to Overview
          </Button>
        </div>
        <UserManagement
          currentUserRole="bod"
          allowedRoles={['student']}
          title="Student Body"
          description="Manage student accounts, levels, and academic status"
          canEdit={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-glow">
        <h1 className="text-2xl font-bold mb-2 flex items-center space-x-2">
          <Crown className="h-6 w-6" />
          <span>Board Dashboard</span>
        </h1>
        <p className="text-primary-foreground/80">{user.name} • {user.rank} • Level {user.level}</p>
      </div>

      {/* Executive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">Faculty</CardTitle>
            <Users className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">12</div>
            <p className="text-xs text-secondary-foreground/70">Active instructors</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Enrolled learners</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">Institute rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Faculty Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-primary border-0 hover:shadow-glow"
                onClick={() => setActiveTab('faculty')}
              >
                Manage Faculty
              </Button>
              <Button 
                className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic"
                onClick={() => setActiveTab('students')}
              >
                Manage Students
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Institute Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-primary border-0 hover:shadow-glow">
                Institute Analytics
              </Button>
              <Button className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
                System Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};