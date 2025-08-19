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
  role: 'student' | 'faculty' | 'bod' | 'superadmin';
  level: number;
  rank: string;
  approved_status: boolean;
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
      student.rank.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .eq('approved_status', true)
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
    const avgLevel = students.reduce((acc, s) => acc + s.level, 0) / totalStudents;
    const topLevel = Math.max(...students.map(s => s.level));
    
    return { totalStudents, avgLevel: Math.round(avgLevel * 10) / 10, topLevel };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-academic">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const stats = getStudentStats();
  const topStudents = getTopStudents();

  return (
    <div className="min-h-screen bg-gradient-academic">
      <Navigation 
        currentRole={currentUser?.role || 'student'}
        currentUser={currentUser ? {
          name: currentUser.full_name,
          rank: currentUser.rank,
          level: currentUser.level
        } : null}
        onRoleChange={() => {}}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Directory</h1>
          <p className="text-muted-foreground">
            Explore our community of aspiring humorists and their academic journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{stats.totalStudents}</CardTitle>
                  <CardDescription>Total Students</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{stats.avgLevel}</CardTitle>
                  <CardDescription>Average Level</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Award className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{stats.topLevel}</CardTitle>
                  <CardDescription>Highest Level</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Top Performers */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Star className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Top Performers</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topStudents.map((student, index) => (
              <Card key={student.id} className={`shadow-academic ${index === 0 ? 'border-secondary/40 bg-gradient-to-br from-secondary/5 to-transparent' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 bg-gradient-primary">
                        <AvatarFallback className="text-primary-foreground font-bold text-lg">
                          {student.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${index === 0 ? 'bg-secondary text-secondary-foreground' : 
                            index === 1 ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground'}`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.full_name}</CardTitle>
                      <CardDescription>{student.rank}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={index === 0 ? 'secondary' : 'default'}>
                      Level {student.level}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-secondary fill-current" />
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Students */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">All Students</h2>
              <Badge variant="outline">{filteredStudents.length}</Badge>
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="shadow-elegant hover:shadow-academic transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-gradient-subtle">
                      <AvatarFallback className="text-foreground font-medium">
                        {student.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{student.full_name}</CardTitle>
                      <CardDescription className="text-sm truncate">{student.rank}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Student
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium">Level {student.level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No students found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all students.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}