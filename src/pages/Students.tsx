import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Search, Star, Award, TrendingUp } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { ParticleField } from "@/components/ParticleField";
import { FadeIn } from "@/components/FadeIn";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { MOCK_PROFILES, Profile } from "@/data/mockData";

// interface Profile ... (Removed locally defined interface, imported from mockData)

export default function Students() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Profile[]>([]);
  const { user, profile: currentUser } = useAuth(); // Use useAuth
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    // getCurrentUser(); // Removed
  }, []);

  //   useEffect(() => { ... (No change needed here, depends on students state)

  const fetchStudents = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter for students from mock data
      const studentProfiles = MOCK_PROFILES.filter(p => p.role === 'student')
        .sort((a, b) => b.level - a.level);

      setStudents(studentProfiles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // const getCurrentUser = ... (Removed)

  const getTopStudents = () => {
    return [...students]
      .sort((a, b) => b.level - a.level)
      .slice(0, 3);
  };

  const getStudentStats = () => {
    const totalStudents = students.length;
    const avgLevel = students.reduce((acc, s) => acc + s.level, 0) / totalStudents || 0;
    const topLevel = students.length > 0 ? Math.max(...students.map(s => s.level)) : 0;

    return { totalStudents, avgLevel: Math.round(avgLevel * 10) / 10, topLevel };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = getStudentStats();
  const topStudents = getTopStudents();

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentRole={currentUser?.role || 'student'}
        currentUser={currentUser ? {
          name: currentUser.full_name,
          rank: currentUser.rank,
          level: currentUser.level
        } : null}
        onRoleChange={() => { }}
      />
      <ParticleField />

      <FadeIn>
        <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">Student Community</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our vibrant community of aspiring humorists and their academic journey
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-sm bg-card border border-border text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">{stats.totalStudents}</div>
                  <div className="text-muted-foreground">Total Students</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-card border border-border text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">{stats.avgLevel}</div>
                  <div className="text-muted-foreground">Average Level</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-card border border-border text-center p-8">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-blue-600/5 rounded-2xl flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">{stats.topLevel}</div>
                  <div className="text-muted-foreground">Highest Level</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          {topStudents.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">Top Performers</h2>
                <p className="text-muted-foreground text-lg">
                  Celebrating our highest-achieving students
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topStudents.map((student, index) => (
                  <Card key={student.id} className={`shadow-sm bg-background/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${index === 0 ? 'border-blue-600/50 ring-1 ring-blue-600/20' : 'border-border/50'
                    }`}>
                    <CardHeader className="pb-6 text-center">
                      <div className="relative mx-auto mb-4">
                        <Avatar className="h-24 w-24 border-2 border-border bg-background">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`}
                            alt={student.full_name}
                            className="h-full w-full object-cover"
                          />
                          <AvatarFallback className="bg-secondary text-foreground font-bold text-xl">
                            {student.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-blue-600 text-primary-foreground' :
                          index === 1 ? 'bg-secondary text-secondary-foreground' :
                            'bg-muted text-muted-foreground border border-border'
                          }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{student.full_name}</CardTitle>
                        <CardDescription>{student.rank || 'Student'}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-4">
                        <Badge className={`shadow-none ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                          }`}>
                          Level {student.level}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 text-primary fill-current" />
                          <span className="font-semibold">#{index + 1}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* All Students */}
          <section>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
              <div className="text-center sm:text-left">
                <h2 className="text-4xl font-bold text-foreground mb-2">All Students</h2>
                <p className="text-muted-foreground">Browse and search through our student directory</p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="shadow-sm bg-background/60 backdrop-blur-md border-border/50 hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="text-center space-y-3">
                      <Avatar className="h-16 w-16 mx-auto border border-border bg-background">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`}
                          alt={student.full_name}
                          className="h-full w-full object-cover"
                        />
                        <AvatarFallback className="bg-secondary text-foreground font-semibold">
                          {student.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-base">{student.full_name}</CardTitle>
                        <CardDescription className="text-sm">{student.rank || 'Student'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Student
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Level {student.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && searchTerm && (
              <Card className="shadow-none border border-border bg-muted/30 text-center p-16">
                <CardContent className="space-y-6">
                  <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto border border-border">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">No students found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or browse all students.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </main>
      </FadeIn>
    </div>
  );
}