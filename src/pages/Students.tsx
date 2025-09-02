import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Search, Star, Award, TrendingUp } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'student' | 'faculty' | 'bod';
  level: number;
  rank: string;
}

export default function Students() {
  const [students, setStudents] = useState<Profile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    getCurrentUser();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.rank && student.rank.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('level', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
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

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setCurrentUser(data);
      }
    } catch (error: any) {
      console.error('Error fetching current user:', error);
    }
  };

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
      <div className="min-h-screen bg-gradient-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const stats = getStudentStats();
  const topStudents = getTopStudents();

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation 
        currentRole={currentUser?.role || 'student'}
        currentUser={currentUser ? {
          name: currentUser.full_name,
          rank: currentUser.rank,
          level: currentUser.level
        } : null}
        onRoleChange={() => {}}
      />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">Student Community</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our vibrant community of aspiring humorists and their academic journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 text-center p-8">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">{stats.totalStudents}</div>
                <div className="text-muted-foreground">Total Students</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 text-center p-8">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                <TrendingUp className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">{stats.avgLevel}</div>
                <div className="text-muted-foreground">Average Level</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 text-center p-8">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-gradient-ocean rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                <Award className="h-8 w-8 text-white" />
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
                <Card key={student.id} className={`shadow-glass bg-gradient-glass backdrop-blur-xl border transition-all duration-500 hover:scale-[1.02] group ${
                  index === 0 ? 'border-primary/40 shadow-glow' : 'border-border/30 hover:shadow-glass-hover'
                }`}>
                  <CardHeader className="pb-6 text-center">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="h-20 w-20 shadow-glow border-4 border-border/20">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-xl">
                          {student.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-button ${
                        index === 0 ? 'bg-gradient-primary text-primary-foreground' : 
                        index === 1 ? 'bg-gradient-secondary text-secondary-foreground' : 
                        'bg-gradient-glass text-foreground border border-border/30'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{student.full_name}</CardTitle>
                      <CardDescription>{student.rank || 'Student'}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-4">
                      <Badge className={`shadow-button ${
                        index === 0 ? 'bg-gradient-primary text-primary-foreground' : 'bg-gradient-glass text-foreground border border-border/30'
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
                className="pl-10 bg-gradient-glass backdrop-blur-sm border-border/30 shadow-glass"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 hover:shadow-glass-hover transition-all duration-300 hover:scale-[1.02] group">
                <CardHeader className="pb-4">
                  <div className="text-center space-y-3">
                    <Avatar className="h-14 w-14 mx-auto shadow-button border-2 border-border/20">
                      <AvatarFallback className="bg-gradient-glass text-foreground font-semibold border border-border/30">
                        {student.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">{student.full_name}</CardTitle>
                      <CardDescription className="text-sm">{student.rank || 'Student'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gradient-glass text-foreground border border-border/30 text-xs">
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
            <Card className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 text-center p-16">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-gradient-glass rounded-2xl flex items-center justify-center mx-auto border border-border/30">
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
    </div>
  );
}