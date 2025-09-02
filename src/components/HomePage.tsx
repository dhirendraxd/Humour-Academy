import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Trophy, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { ParticleField } from "./ParticleField";

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      <ParticleField />
      
      {/* Navigation */}
      <header className="relative z-50">
        <nav className="border-b border-border/20 bg-gradient-glass/40 backdrop-blur-xl sticky top-0">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Ramay Institute
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium tracking-wide">
                    COMEDY EXCELLENCE
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={onLoginClick}
                size="lg"
                className="bg-gradient-primary text-primary-foreground border-0 shadow-button hover:shadow-glow hover:scale-[1.05] transition-all duration-300 backdrop-blur-sm group"
              >
                <span className="group-hover:animate-pulse">Join the Academy</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="relative py-32 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-12">
              {/* Main Headline */}
              <div className="space-y-8">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-glass backdrop-blur-sm border border-border/30 shadow-glass">
                  <Sparkles className="h-5 w-5 text-primary mr-2 animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Welcome to Excellence</span>
                </div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                  <span className="block text-foreground">The Future of</span>
                  <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                    Comedy Education
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light max-w-4xl mx-auto">
                  Join the most prestigious academy where humor meets academic rigor. 
                  Master the art of comedy through structured learning and expert guidance.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={onLoginClick}
                  className="bg-gradient-primary text-primary-foreground border-0 shadow-button hover:shadow-glow hover:scale-[1.05] transition-all duration-300 text-lg px-12 py-6 group"
                >
                  <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
                  Begin Your Journey
                  <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16">
                {[
                  { icon: BookOpen, label: "Students", value: "500+" },
                  { icon: Users, label: "Faculty", value: "25+" },
                  { icon: Trophy, label: "Awards", value: "15+" }
                ].map((stat, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-glass backdrop-blur-sm rounded-2xl border border-border/30 flex items-center justify-center mx-auto shadow-glass">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Features Section */}
      <section className="relative py-32 px-6 sm:px-8 lg:px-12 bg-gradient-glass/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              Master the Art of{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Academic Humor
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Join our distinguished community of humorists, educators, and leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Students",
                description: "Begin your humor journey with structured learning and mentorship",
                gradient: "from-primary/20 to-secondary/10"
              },
              {
                icon: Users,
                title: "Faculty",
                description: "Experienced humorists who guide and shape the next generation",
                gradient: "from-secondary/20 to-tertiary/10"
              },
              {
                icon: Trophy,
                title: "Board of Directors",
                description: "Elite humorists who lead comedy education into the future",
                gradient: "from-tertiary/20 to-quaternary/10"
              }
            ].map((feature, index) => (
              <Card key={index} className="shadow-glass border border-border/20 bg-gradient-glass backdrop-blur-xl hover:shadow-glass-hover transition-all duration-500 hover:scale-[1.02] group">
                <CardHeader className="pb-6 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-button group-hover:shadow-glow transition-all duration-300`}>
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <Card className="shadow-glass-hover bg-gradient-glass backdrop-blur-xl border border-border/30 overflow-hidden">
            <CardContent className="p-16 relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
              <div className="relative space-y-10">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                  <GraduationCap className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">Ready to Begin?</span>
                </div>
                
                <h3 className="text-5xl font-bold text-foreground tracking-tight mb-6">
                  Join Our Academy Today
                </h3>
                
                <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                  Take the first step toward mastering the art of humor. Apply for access and begin your transformative journey with the Ramay Institute.
                </p>
                
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    onClick={onLoginClick}
                    className="bg-gradient-primary text-primary-foreground border-0 shadow-button hover:shadow-glow hover:scale-[1.05] transition-all duration-300 text-lg px-16 py-8 group"
                  >
                    <Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                    Request Academy Access
                    <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-16 px-6 sm:px-8 lg:px-12 bg-gradient-glass/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Ramay Institute
            </span>
          </div>
          <p className="text-muted-foreground text-lg font-light">
            © 2024 Ramay Institute. Where humor meets academic excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};