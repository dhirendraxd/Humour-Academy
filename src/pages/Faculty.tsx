import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, GraduationCap, Trophy, Star, Calendar, Search } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { Profile } from "@/data/mockData";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { api } from "@/lib/api";
import { Teacher } from "@/lib/modules";

export default function Faculty() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'faculty' | 'students'>('faculty');
  const { profile: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      // Fetch data from unified public endpoint
      const allUsers = await api.get<any[]>('/faculty');

      // Convert API users to Profile format
      const profilesData: Profile[] = allUsers.map((u: any) => ({
        id: String(u.id),
        user_id: String(u.id),
        full_name: u.name,
        email: u.email || '',
        role: u.role || 'student',
        level: u.level || 1,
        rank: u.rank || 'Member',
        bio: u.bio || '',
        city: u.city || '',
        phone: u.phone || '',
        interests: typeof u.interests === 'string' ? JSON.parse(u.interests) : (u.interests || [])
      }));

      setProfiles(profilesData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load academy roster",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedProfiles = {
    bod: profiles.filter(p => p.role === 'bod'),
    faculty: profiles.filter(p => p.role === 'faculty'),
    students: profiles.filter(p => p.role === 'student').sort((a, b) => b.level - a.level),
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
    <PageLayout>
      <SEO
        title="Faculty & Leadership"
        description="Meet the distinguished educators and leaders who shape the future of comedy education at Ramay Institute. Experienced faculty and board members."
        keywords="faculty, teachers, instructors, board of directors, leadership team, comedy educators"
      />
      <FadeIn>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Faculty & <span className="text-blue-600">Leadership</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Meet the distinguished educators and leaders who shape the future of comedy education at Ramay Institute
            </p>

            {/* Toggle Tabs */}
            <div className="inline-flex items-center gap-2 p-1 bg-muted/50 rounded-full">
              <button
                onClick={() => setActiveView('faculty')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${activeView === 'faculty'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <GraduationCap className="inline-block w-4 h-4 mr-2" />
                Faculty & BOD
              </button>
              <button
                onClick={() => setActiveView('students')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${activeView === 'students'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                Students ({groupedProfiles.students.length})
              </button>
            </div>
          </div>

          {/* Faculty View */}
          {activeView === 'faculty' && (
            <>
              {/* Board of Directors */}
              {groupedProfiles.bod.length > 0 && (
                <section className="mb-32">
                  <div className="flex items-center gap-3 mb-16">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Board of Directors</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedProfiles.bod.map((profile) => (
                      <Card key={profile.id} className="group relative overflow-hidden bg-background/60 backdrop-blur-sm border border-border/50">
                        <CardHeader className="pb-6">
                          <div className="text-center space-y-4">
                            <Avatar className="h-32 w-32 mx-auto ring-2 ring-border/50 ring-offset-2 ring-offset-background">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`}
                                alt={profile.full_name}
                                className="h-full w-full object-cover"
                              />
                              <AvatarFallback className="bg-blue-600 text-white font-bold text-3xl">
                                {profile.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                              <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                              <CardDescription className="text-base">{profile.rank || 'Board Member'}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                          <Badge className="bg-blue-600 text-white">
                            Board of Directors
                          </Badge>
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-blue-600 fill-current" />
                            <span>Level {profile.level}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Faculty Members */}
              {groupedProfiles.faculty.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-16">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Faculty Members</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {groupedProfiles.faculty.map((profile) => (
                      <Card key={profile.id} className="group relative overflow-hidden bg-background/60 backdrop-blur-sm border border-border/50">
                        <CardHeader className="pb-4">
                          <div className="text-center space-y-3">
                            <Avatar className="h-24 w-24 mx-auto ring-2 ring-border/50 ring-offset-2 ring-offset-background">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`}
                                alt={profile.full_name}
                                className="h-full w-full object-cover"
                              />
                              <AvatarFallback className="bg-secondary text-foreground font-semibold text-xl">
                                {profile.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{profile.full_name}</CardTitle>
                              <CardDescription className="text-sm">{profile.rank || 'Faculty'}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-center space-y-3">
                          <Badge variant="secondary" className="text-xs">
                            Faculty
                          </Badge>
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 text-secondary-foreground fill-current" />
                            <span>Level {profile.level}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Students View */}
          {activeView === 'students' && (
            <section>
              <div className="flex items-center gap-3 mb-16">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Student Community</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {groupedProfiles.students.map((profile) => (
                  <Card key={profile.id} className="group relative overflow-hidden bg-background/60 backdrop-blur-sm border border-border/50">
                    <CardHeader className="pb-4">
                      <div className="text-center space-y-3">
                        <Avatar className="h-20 w-20 mx-auto ring-2 ring-border/50 ring-offset-2 ring-offset-background">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.full_name}`}
                            alt={profile.full_name}
                            className="h-full w-full object-cover"
                          />
                          <AvatarFallback className="bg-muted text-foreground font-semibold text-lg">
                            {profile.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <CardTitle className="text-base">{profile.full_name}</CardTitle>
                          <CardDescription className="text-xs">{profile.rank || 'Student'}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <Badge variant="outline" className="text-xs">
                        Student
                      </Badge>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-muted-foreground fill-current" />
                        <span>Level {profile.level}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </FadeIn>

      {/* Recruitment Section */}
      <section className="bg-slate-900 py-32 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent)]" />
        <FadeIn>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Shape the Future of <span className="text-blue-500">Comedy</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              We are always looking for exceptional humorists, satirists, and storytellers to join our faculty.
              Help us architect the next generation of charisma.
            </p>
            <RecruitmentForm />
          </div>
        </FadeIn>
      </section>
    </PageLayout>
  );
}

function RecruitmentForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) {
      toast({ title: "Authentication required", description: "Please login to apply.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await api.post('/recruitment/apply', {
        specialization: formData.get('specialization'),
        experience_summary: formData.get('experience'),
        resume_link: formData.get('resume')
      });
      toast({ title: "Application Submitted", description: "The Board of Directors will review your credentials." });
      setOpen(false);
    } catch (err) {
      toast({ title: "Submission failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="rounded-full px-12 h-14 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-1"
      >
        Apply for Faculty Position
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <FadeIn direction="up" className="w-full max-w-xl">
            <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white text-left overflow-hidden">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-2xl font-black text-slate-900">Faculty Candidacy</CardTitle>
                <CardDescription>Present your credentials for review by the High Command.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Specialization</label>
                    <Input name="specialization" required placeholder="e.g., Political Satire, Physical Comedy, Rhetoric" className="rounded-xl h-12 border-slate-100 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Summary</label>
                    <Textarea name="experience" required placeholder="Briefly detail your journey in humor..." className="rounded-xl min-h-[120px] border-slate-100 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio / Resume Link (Optional)</label>
                    <Input name="resume" placeholder="https://..." className="rounded-xl h-12 border-slate-100 bg-slate-50/50" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 h-12 rounded-xl border-slate-100 font-bold">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all">
                      {loading ? 'Transmitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      )}
    </>
  );
}