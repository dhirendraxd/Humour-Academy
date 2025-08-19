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
  role: 'student' | 'faculty' | 'bod' | 'superadmin';
  level: number;
  rank: string;
  approved_status: boolean;
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
        .eq('approved_status', true)
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'bod': return <Trophy className="h-5 w-5 text-secondary" />;
      case 'faculty': return <GraduationCap className="h-5 w-5 text-primary" />;
      case 'student': return <Users className="h-5 w-5 text-muted-foreground" />;
      default: return <Star className="h-5 w-5 text-primary" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'bod': return 'secondary';
      case 'faculty': return 'default';
      case 'student': return 'outline';
      default: return 'default';
    }
  };

  const groupedProfiles = {
    bod: profiles.filter(p => p.role === 'bod'),
    faculty: profiles.filter(p => p.role === 'faculty'),
    students: profiles.filter(p => p.role === 'student')
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Faculty & Community</h1>
          <p className="text-muted-foreground">
            Meet the distinguished members of Ramay Institute's academic community
          </p>
        </div>

        {/* Board of Directors */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Board of Directors</h2>
            <Badge variant="secondary">{groupedProfiles.bod.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedProfiles.bod.map((profile) => (
              <Card key={profile.id} className="shadow-academic border-secondary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-gradient-secondary">
                      <AvatarFallback className="text-secondary-foreground font-semibold">
                        {profile.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                      <CardDescription>{profile.rank}</CardDescription>
                    </div>
                    {getRoleIcon(profile.role)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={getRoleBadgeVariant(profile.role)} className="capitalize">
                      {profile.role}
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

        {/* Faculty Members */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Faculty Members</h2>
            <Badge variant="default">{groupedProfiles.faculty.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedProfiles.faculty.map((profile) => (
              <Card key={profile.id} className="shadow-academic">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-gradient-primary">
                      <AvatarFallback className="text-primary-foreground font-semibold">
                        {profile.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                      <CardDescription>{profile.rank}</CardDescription>
                    </div>
                    {getRoleIcon(profile.role)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={getRoleBadgeVariant(profile.role)} className="capitalize">
                      {profile.role}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary fill-current" />
                      <span className="text-sm font-medium">Level {profile.level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Students */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Students</h2>
            <Badge variant="outline">{groupedProfiles.students.length}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {groupedProfiles.students.map((profile) => (
              <Card key={profile.id} className="shadow-elegant">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-muted">
                      <AvatarFallback className="text-muted-foreground font-medium">
                        {profile.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{profile.full_name}</CardTitle>
                      <CardDescription className="text-sm truncate">{profile.rank}</CardDescription>
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
                      <span className="text-xs font-medium">Level {profile.level}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}