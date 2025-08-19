import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award, Smile } from "lucide-react";

interface StudentDashboardProps {
  user: {
    name: string;
    rank: string;
    level: number;
  };
}

export const StudentDashboard = ({ user }: StudentDashboardProps) => {
  const mockStats = {
    humorScore: 78,
    jokesSubmitted: 45,
    certifications: [
      { name: "Pun Master", date: "2024-01-15", issuer: "Prof. Smith" },
      { name: "Sarcasm Specialist", date: "2024-02-20", issuer: "Dr. Johnson" },
    ],
    nextLevel: {
      name: "Comedy Connoisseur",
      progress: 65,
      requirement: "Submit 10 more quality jokes"
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground shadow-glow">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 😄</h1>
        <p className="text-primary-foreground/80">Current Rank: {user.rank} • Level {user.level}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary-foreground">Humor Score</CardTitle>
            <Smile className="h-4 w-4 text-secondary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">{mockStats.humorScore}/100</div>
            <p className="text-xs text-secondary-foreground/70">+12 from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jokes Submitted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.jokesSubmitted}</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.certifications.length}</div>
            <p className="text-xs text-muted-foreground">Latest: Sarcasm Specialist</p>
          </CardContent>
        </Card>

        <Card className="shadow-academic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {user.level}</div>
            <p className="text-xs text-muted-foreground">{user.rank}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Level */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span>Progress to {mockStats.nextLevel.name}</span>
          </CardTitle>
          <CardDescription>{mockStats.nextLevel.requirement}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{mockStats.nextLevel.progress}%</span>
            </div>
            <Progress value={mockStats.nextLevel.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <span>Your Certifications</span>
          </CardTitle>
          <CardDescription>Achievements in humor mastery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-gradient-academic">
                <div>
                  <h4 className="font-medium">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">Issued by {cert.issuer}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{cert.date}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};