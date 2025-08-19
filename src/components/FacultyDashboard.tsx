import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, TrendingUp, Award, Star, ArrowUp } from "lucide-react";

interface FacultyDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const FacultyDashboard = ({ user }: FacultyDashboardProps) => {
  const mockData = {
    studentsSupervised: 24,
    certificationsIssued: 18,
    averageStudentGrowth: 23,
    students: [
      { name: "Alice Johnson", level: 3, rank: "Joke Apprentice", humorScore: 72, trend: "up" },
      { name: "Bob Smith", level: 5, rank: "Pun Practitioner", humorScore: 89, trend: "up" },
      { name: "Carol Davis", level: 2, rank: "Comedy Cadet", humorScore: 56, trend: "stable" },
      { name: "David Wilson", level: 4, rank: "Wit Warrior", humorScore: 78, trend: "up" },
      { name: "Eva Brown", level: 6, rank: "Sarcasm Scholar", humorScore: 94, trend: "up" },
    ]
  };

  const handlePromoteStudent = (studentName: string) => {
    console.log(`Promoting ${studentName}`);
    // This would connect to Supabase when backend is set up
  };

  const handleIssueCertification = (studentName: string) => {
    console.log(`Issuing certification to ${studentName}`);
    // This would connect to Supabase when backend is set up
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-glow">
        <h1 className="text-3xl font-bold mb-2">Faculty Dashboard 👨‍🏫</h1>
        <p className="text-primary-foreground/80">Welcome, {user.name} • {user.rank} • Level {user.level}</p>
      </div>

      {/* Faculty Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">Students Supervised</CardTitle>
            <Users className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{mockData.studentsSupervised}</div>
            <p className="text-xs text-secondary-foreground/70">Active learners</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.certificationsIssued}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Student Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockData.averageStudentGrowth}%</div>
            <p className="text-xs text-muted-foreground">Humor score improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Management */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Your Students</span>
          </CardTitle>
          <CardDescription>Manage student progress and issue certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.students.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-academic hover:shadow-academic transition-shadow">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">Level {student.level} • {student.rank}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Score: {student.humorScore}</Badge>
                    {student.trend === 'up' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Rising
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePromoteStudent(student.name)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowUp className="h-4 w-4 mr-1" />
                    Promote
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => handleIssueCertification(student.name)}
                    className="bg-gradient-primary border-0 hover:shadow-glow"
                  >
                    <Award className="h-4 w-4 mr-1" />
                    Certify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-12 bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
              Create New Assessment
            </Button>
            <Button className="h-12 bg-gradient-primary border-0 hover:shadow-glow">
              View Student Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};