import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Trophy, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import heroImage from "@/assets/ramay-institute-hero.jpg";

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-academic">
      {/* Navigation */}
      <nav className="border-b border-border/10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Ramay Institute
              </span>
            </div>
            
            <Button 
              onClick={onLoginClick}
              className="bg-gradient-primary border-0 hover:shadow-glow"
            >
              Login / Join Us
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Welcome to the{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Ramay Institute
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The premier academy for humor education and comedic excellence. 
                  Transform your wit, master the art of comedy, and join a community 
                  of distinguished humorists.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={onLoginClick}
                  className="bg-gradient-primary border-0 hover:shadow-glow"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Your Humor Journey
                </Button>
                <Button size="lg" variant="outline" className="border-primary/20">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-academic">
                <img 
                  src={heroImage} 
                  alt="Ramay Institute - Where Humor Meets Academia" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-primary/20 rounded-3xl -z-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Master the Art of{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Academic Humor
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our distinguished community of humorists, from aspiring students 
              to acclaimed Board of Directors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-academic border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  Begin your humor journey with structured learning and mentorship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Track your humor level and growth</li>
                  <li>• Earn certifications from faculty</li>
                  <li>• Access exclusive comedy workshops</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-academic border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Faculty</CardTitle>
                <CardDescription>
                  Experienced humorists who guide and evaluate student progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mentor aspiring comedians</li>
                  <li>• Issue humor certifications</li>
                  <li>• Promote deserving students</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-academic border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Board of Directors</CardTitle>
                <CardDescription>
                  Elite humorists who shape the future of comedy education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Oversee institute operations</li>
                  <li>• Promote faculty members</li>
                  <li>• Set humor standards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="shadow-academic bg-gradient-subtle border-primary/20">
            <CardContent className="p-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">
                  Ready to Join Our Comedy Academy?
                </h3>
                <p className="text-xl text-muted-foreground">
                  Apply for access today and begin your journey toward humor mastery. 
                  Our Super Admin carefully reviews each application to maintain 
                  our prestigious standards.
                </p>
                <Button 
                  size="lg" 
                  onClick={onLoginClick}
                  className="bg-gradient-primary border-0 hover:shadow-glow text-lg px-8"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Request Institute Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Ramay Institute. Where humor meets excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};