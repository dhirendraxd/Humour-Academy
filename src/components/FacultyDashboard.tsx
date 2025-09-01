import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart3 } from "lucide-react";

interface FacultyDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const FacultyDashboard = ({ user }: FacultyDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-glow">
        <h1 className="text-2xl font-bold mb-2">Faculty Dashboard</h1>
        <p className="text-primary-foreground/80">{user.name} • {user.rank} • Level {user.level}</p>
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
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Student satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Student Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-primary border-0 hover:shadow-glow">
                View All Students
              </Button>
              <Button className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
                Grade Assignments
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Course Materials</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-primary border-0 hover:shadow-glow">
                Manage Courses
              </Button>
              <Button className="w-full bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
                Create Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};