import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ParticleField";
import { FadeIn } from "@/components/FadeIn";
import { PublicNavigation } from "@/components/PublicNavigation";
import { FooterParticles } from "@/components/FooterParticles";
import { HeroBackground } from "@/components/HeroBackground";

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-600/20 relative">
      <HeroBackground />
      <ParticleField />
      <PublicNavigation />

      <main className="flex-grow flex flex-col items-center relative overflow-hidden">

        {/* Hero Section */}
        <section className="pt-24 pb-32 px-6 text-center max-w-5xl mx-auto space-y-10 z-10 relative">
          <FadeIn delay={100}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.95]">
              <span className="text-blue-600">Master Leadership</span> <br />
              through the Art of Humor
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              We use comedy mechanics to build world-class communication, confidence, and leadership skills.
              Join the premier institution for soft skills development.
            </p>
          </FadeIn>

          <FadeIn delay={500}>
            <div className="flex flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={onLoginClick}
                className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-none transition-all hover:scale-105"
              >
                Apply for Fall 2025
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 h-12 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all border border-border hover:scale-105"
              >
                View Syllabus
              </Button>
            </div>
          </FadeIn>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 border-y border-border/40 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Leaders", value: "500+" },
              { label: "Corporate Partners", value: "12" },
              { label: "Executive Coaches", value: "25+" },
              { label: "Global Alumni", value: "2k+" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 100} direction="up">
                <div className="space-y-1">
                  <div className="text-4xl font-bold tracking-tight text-blue-600">{stat.value}</div>
                  <div className="text-sm text-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>



        {/* CTA */}
        <section className="w-full py-32 px-6">
          <FadeIn direction="up">
            <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden shadow-2xl hover:shadow-primary/50 transition-shadow duration-500">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

              <h2 className="text-4xl md:text-5xl font-bold relative z-10">Unlock Your Potential?</h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto relative z-10">
                Admissions for the upcoming executive cohort close in 14 days.
                Secure your place in the boardroom.
              </p>
              <div className="pt-4 relative z-10">
                <Button
                  onClick={onLoginClick}
                  className="h-14 px-10 rounded-full bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-lg hover:scale-105 transition-transform"
                >
                  Start Application
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>

      </main>

      <footer className="py-12 px-6 border-t border-blue-600/10 text-center text-sm text-muted-foreground relative overflow-hidden">
        {/* Footer Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-900/5 to-blue-900/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        <FooterParticles />

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12 text-left relative z-10">
          <div>
            <div className="font-bold text-foreground mb-4">Ramay Academy</div>
            <p className="leading-relaxed">Building leaders through the power of humor since 2010.</p>
          </div>
          <div>
            <div className="font-bold text-foreground mb-4">Programs</div>
            <ul className="space-y-2">
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Executive Presence</a></li>
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Team Dynamics</a></li>
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Storytelling</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-foreground mb-4">Community</div>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-primary transition-colors">Alumni</a></li>
              <li><a href="#events" className="hover:text-primary transition-colors">Events</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Open Mics</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-foreground mb-4">Legal</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center max-w-6xl mx-auto pt-8 border-t border-border/20 relative z-10">
          <p>&copy; 2024 Ramay Institute of Humour.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
          </div>
        </div>
      </footer>

    </div>
  );
};