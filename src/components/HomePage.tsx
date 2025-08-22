import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Trophy, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { ParticleField } from "./ParticleField";

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-background relative">
      <ParticleField />
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Ramay Institute
              </span>
            </div>
            
            <Button 
              onClick={onLoginClick}
              className="bg-gradient-primary text-primary-foreground border-0 shadow-button hover:shadow-glow hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
            >
              Login / Join Us
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                  Welcome to the{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Ramay Institute
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                  The premier academy for humor education and comedic excellence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={onLoginClick}
                  className="bg-gradient-primary text-primary-foreground border-0 shadow-button hover:shadow-glow hover:scale-[1.02] transition-all duration-300 text-lg px-8 py-6"
                >
                  <Sparkles className="mr-3 h-6 w-6" />
                  Start Your Journey
                </Button>
              </div>
            </div>
            
            <div className="relative lg:ml-8">
              <div className="aspect-square rounded-3xl bg-gradient-ocean backdrop-blur-sm border border-border/20 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-10 animate-pulse"></div>
                <div className="text-center space-y-6 p-12 relative z-10">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[...Array(9)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 bg-gradient-primary rounded-lg opacity-60 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Academic Excellence
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Discover the future of humor education
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Master the Art of{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Academic Humor
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Join our distinguished community of humorists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-glass border border-border/20 bg-gradient-glass backdrop-blur-md hover:shadow-glass-hover transition-all duration-500 hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-button">
                  <BookOpen className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold">Students</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Begin your humor journey with structured learning
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-glass border border-border/20 bg-gradient-glass backdrop-blur-md hover:shadow-glass-hover transition-all duration-500 hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-button">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold">Faculty</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Experienced humorists who guide student progress
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-glass border border-border/20 bg-gradient-glass backdrop-blur-md hover:shadow-glass-hover transition-all duration-500 hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-button">
                  <Trophy className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold">Board of Directors</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Elite humorists who shape comedy education
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="shadow-glass bg-gradient-glass backdrop-blur-md border border-border/20">
            <CardContent className="p-16">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold text-foreground tracking-tight">
                  Ready to Join Our Academy?
                </h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                  Apply for access today and begin your journey toward humor mastery.
                </p>
                <Button 
                  size="lg" 
                  onClick={onLoginClick}
                  className="bg-gradient-primary text-primary-foreground border-0 shadow-button hover:shadow-glow hover:scale-[1.02] transition-all duration-300 text-lg px-12 py-6"
                >
                  <GraduationCap className="mr-3 h-6 w-6" />
                  Request Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6 sm:px-8 lg:px-12 bg-gradient-glass backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-lg font-light">
            © 2024 Ramay Institute. Where humor meets excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};