import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Trophy, ChevronRight, Play } from "lucide-react";
import { ParticleField } from "@/components/ParticleField";

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <ParticleField />

      {/* Navigation - Matches Antigravity: Logo left, Nav items immediate right, CTA far right */}
      <header className="w-full py-6 px-6 md:px-12 lg:px-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 mr-12">
          {/* Simple Logo */}
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary text-2xl">▲</span> {/* Abstract triangle icon similar to logo */}
            Ramay Academy
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground items-center">
          <a href="#" className="hover:text-foreground transition-colors">Product</a>
          <a href="#" className="hover:text-foreground transition-colors">Use Cases</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="hover:text-foreground transition-colors">Resources</a>
        </nav>

        <div className="ml-auto">
          <Button
            onClick={onLoginClick}
            className="rounded-full px-6 font-medium bg-foreground text-background hover:bg-foreground/90 transition-opacity shadow-none h-10"
          >
            Download <span className="ml-2 text-xs">↓</span>
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">

        {/* Subtle nice background decoration if needed, but keeping it clean per request */}
        {/* Right side confetti/dots like reference could be added here absolutely positioned */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none">
          {/* Abstract decorative elements */}
          <div className="absolute top-10 right-20 w-4 h-4 bg-primary rounded-full"></div>
          <div className="absolute top-40 right-10 w-2 h-2 bg-primary rounded-full"></div>
          <div className="absolute top-60 right-40 w-3 h-3 bg-primary/50 rounded-full"></div>
          <div className="absolute top-[100px] right-[200px] w-2 h-2 bg-blue-400 rounded-sm transform rotate-45"></div>
        </div>

        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6 text-center max-w-5xl mx-auto space-y-10 z-10">

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.95]">
            <span className="text-primary">Next-generation</span> <br />
            comedy school
          </h1>

          <div className="flex flex-row gap-4 justify-center pt-2">
            <Button
              size="lg"
              onClick={onLoginClick}
              className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-none transition-all"
            >
              Start Learning
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full px-8 h-12 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
            >
              Explore Curriculum
            </Button>
          </div>
        </section>

      </main>
    </div>
  );
};