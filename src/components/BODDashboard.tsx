import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Users, TrendingUp, Award, Star, ArrowUp, Eye } from "lucide-react";

interface BODDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const BODDashboard = ({ user }: BODDashboardProps) => {
  const mockData = {
    totalFaculty: 12,
    totalStudents: 156,
    institutePerfomance: 91,
    facultyMembers: [
      { name: "Dr. Sarah Wilson", level: 8, rank: "Comedy Professor", studentsSupervised: 24, performance: 94 },
      { name: "Prof. Mike Johnson", level: 7, rank: "Humor Lecturer", studentsSupervised: 18, performance: 87 },
      { name: "Dr. Emily Chen", level: 9, rank: "Wit Master", studentsSupervised: 31, performance: 96 },
      { name: "Prof. David Brown", level: 6, rank: "Sarcasm Instructor", studentsSupervised: 22, performance: 83 },
    ],
    recentPromotions: [
      { name: "Alice Johnson", from: "Level 3", to: "Level 4", date: "2024-01-20", promotedBy: "Dr. Wilson" },
      { name: "Bob Smith", from: "Level 5", to: "Level 6", date: "2024-01-18", promotedBy: "Prof. Johnson" },
    ]
  };

  const handlePromoteFaculty = (facultyName: string) => {
    console.log(`Promoting faculty ${facultyName}`);
    // This would connect to Supabase when backend is set up
  };

  const handleViewAnalytics = (facultyName: string) => {
    console.log(`Viewing analytics for ${facultyName}`);
    // This would connect to Supabase when backend is set up
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white shadow-glow">
        <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
          <Crown className="h-8 w-8" />
          <span>Board of Directors Dashboard</span>
        </h1>
        <p className="text-white/80">Welcome, {user.name} • {user.rank} • Level {user.level}</p>
      </div>

      {/* Executive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">Total Faculty</CardTitle>
            <Star className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{mockData.totalFaculty}</div>
            <p className="text-xs text-secondary-foreground/70">Active instructors</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled learners</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institute Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.institutePerfomance}%</div>
            <p className="text-xs text-muted-foreground">Overall excellence rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Faculty Management */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span>Faculty Oversight</span>
          </CardTitle>
          <CardDescription>Manage faculty ranks and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.facultyMembers.map((faculty, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-academic hover:shadow-academic transition-shadow">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {faculty.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium">{faculty.name}</h4>
                    <p className="text-sm text-muted-foreground">Level {faculty.level} • {faculty.rank}</p>
                    <p className="text-xs text-muted-foreground">{faculty.studentsSupervised} students supervised</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Performance: {faculty.performance}%</Badge>
                    {faculty.performance > 90 && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Star className="h-3 w-3 mr-1" />
                        Excellent
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewAnalytics(faculty.name)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => handlePromoteFaculty(faculty.name)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:shadow-glow text-white"
                  >
                    <ArrowUp className="h-4 w-4 mr-1" />
                    Promote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <span>Recent Promotions</span>
            </CardTitle>
            <CardDescription>Latest student rank advancements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.recentPromotions.map((promotion, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-gradient-academic">
                  <div>
                    <h4 className="font-medium">{promotion.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {promotion.from} → {promotion.to}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{promotion.date}</p>
                    <p className="text-xs text-muted-foreground">by {promotion.promotedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-primary" />
              <span>Executive Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full h-12 bg-gradient-secondary text-secondary-foreground border-0 hover:shadow-academic">
                Institute Performance Report
              </Button>
              <Button className="w-full h-12 bg-gradient-primary border-0 hover:shadow-glow">
                Faculty Development Program
              </Button>
              <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:shadow-glow text-white">
                Strategic Planning Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};