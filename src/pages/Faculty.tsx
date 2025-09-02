import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, Trophy, Star } from "lucide-react";
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

export default function Faculty() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
    getCurrentUser();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('level', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load faculty data",
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

  const groupedProfiles = {
    bod: profiles.filter(p => p.role === 'bod'),
    faculty: profiles.filter(p => p.role === 'faculty'),
    students: profiles.filter(p => p.role === 'student')
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
          <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">Faculty & Leadership</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Meet the distinguished educators and leaders who shape the future of comedy education at Ramay Institute
          </p>
        </div>

        {/* Board of Directors */}
        {groupedProfiles.bod.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">Board of Directors</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedProfiles.bod.map((profile) => (
                <Card key={profile.id} className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 hover:shadow-glass-hover transition-all duration-500 hover:scale-[1.02] group">
                  <CardHeader className="pb-6">
                    <div className="text-center space-y-4">
                      <Avatar className="h-20 w-20 mx-auto shadow-glow border-4 border-border/20">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-2xl">
                          {profile.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">{profile.full_name}</CardTitle>
                        <CardDescription className="text-base">{profile.rank || 'Board Member'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-6">
                      <Badge className="bg-gradient-primary text-primary-foreground shadow-button">
                        Board of Directors
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary fill-current" />
                        <span className="font-semibold">Level {profile.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Faculty Members */}
        {groupedProfiles.faculty.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-glow">
                <GraduationCap className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">Faculty Members</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupedProfiles.faculty.map((profile) => (
                <Card key={profile.id} className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 hover:shadow-glass-hover transition-all duration-300 hover:scale-[1.02] group">
                  <CardHeader className="pb-4">
                    <div className="text-center space-y-3">
                      <Avatar className="h-16 w-16 mx-auto shadow-button border-2 border-border/20">
                        <AvatarFallback className="bg-gradient-secondary text-secondary-foreground font-semibold text-lg">
                          {profile.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-lg group-hover:text-secondary transition-colors">{profile.full_name}</CardTitle>
                        <CardDescription className="text-sm">{profile.rank || 'Faculty'}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-gradient-secondary text-secondary-foreground shadow-button text-xs">
                        Faculty
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-secondary fill-current" />
                        <span className="text-sm font-medium">Level {profile.level}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Students Preview */}
        {groupedProfiles.students.length > 0 && (
          <section>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-glass backdrop-blur-sm rounded-2xl flex items-center justify-center border border-border/30">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">Student Community</h2>
            </div>
            
            <Card className="shadow-glass bg-gradient-glass backdrop-blur-xl border border-border/30 text-center p-12">
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="text-6xl font-bold text-primary">{groupedProfiles.students.length}</div>
                  <h3 className="text-2xl font-semibold text-foreground">Active Students</h3>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Join our vibrant community of aspiring humorists learning the art and science of comedy
                  </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/students'}
                  className="bg-gradient-primary text-primary-foreground shadow-button hover:shadow-glow hover:scale-[1.05] transition-all duration-300"
                >
                  <Users className="mr-2 h-5 w-5" />
                  View All Students
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}