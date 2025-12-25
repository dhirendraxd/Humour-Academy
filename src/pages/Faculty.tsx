import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, Trophy, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { MOCK_PROFILES, Profile } from "@/data/mockData";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

export default function Faculty() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setProfiles(MOCK_PROFILES);
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

  const groupedProfiles = {
    bod: profiles.filter(p => p.role === 'bod'),
    faculty: profiles.filter(p => p.role === 'faculty'),
    students: profiles.filter(p => p.role === 'student'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-muted-foreground animate-pulse">Loading Academy...</p>
      </div>
    );
  }

  return (
    <PageLayout
      customNav={
        <Navigation
          currentRole={currentUser?.role || 'student'}
          currentUser={currentUser ? {
            name: currentUser.full_name,
            rank: currentUser.rank,
            level: currentUser.level
          } : null}
          onRoleChange={() => { }}
        />
      }
    >
      <SEO
        title="Faculty & Leadership"
        description="Meet the distinguished educators and leaders who shape the future of comedy education at Ramay Institute. Experienced faculty and board members."
        keywords="faculty, teachers, instructors, board of directors, leadership team, comedy educators"
      />
      <FadeIn>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
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
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold text-foreground">Board of Directors</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedProfiles.bod.map((profile) => (
                  <Card key={profile.id} className="shadow-sm bg-background/60 backdrop-blur-md border border-border/50 hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <CardHeader className="pb-6">
                      <div className="text-center space-y-4">
                        <Avatar className="h-24 w-24 mx-auto border-2 border-border bg-background">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`}
                            alt={profile.full_name}
                            className="h-full w-full object-cover"
                          />
                          <AvatarFallback className="bg-blue-600 text-white font-bold text-2xl">
                            {profile.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                          <CardDescription className="text-base">{profile.rank || 'Board Member'}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-center gap-6">
                        <Badge className="bg-blue-600 text-white shadow-none">
                          Board of Directors
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-blue-600 fill-current" />
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
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-foreground" />
                </div>
                <h2 className="text-4xl font-bold text-foreground">Faculty Members</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedProfiles.faculty.map((profile) => (
                  <Card key={profile.id} className="shadow-sm bg-background/60 backdrop-blur-md border border-border/50 hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="text-center space-y-3">
                        <Avatar className="h-20 w-20 mx-auto border border-border bg-background">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`}
                            alt={profile.full_name}
                            className="h-full w-full object-cover"
                          />
                          <AvatarFallback className="bg-secondary text-foreground font-semibold text-lg">
                            {profile.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                          <CardDescription className="text-sm">{profile.rank || 'Faculty'}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="shadow-none text-xs">
                          Faculty
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-secondary-foreground fill-current" />
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
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-4xl font-bold text-foreground">Student Community</h2>
              </div>

              <Card className="shadow-sm bg-card border border-border text-center p-12">
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-6xl font-bold text-blue-600">{groupedProfiles.students.length}</div>
                    <h3 className="text-2xl font-semibold text-foreground">Active Students</h3>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      Join our vibrant community of aspiring humorists learning the art and science of comedy
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => navigate('/students')}
                    className="bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    View All Students
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </FadeIn>
    </PageLayout>
  );
}