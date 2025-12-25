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
        <section className="min-h-[80vh] flex flex-col justify-center pt-32 pb-40 px-6 text-center max-w-4xl mx-auto space-y-16 z-10 relative">
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              <span className="text-blue-600">Master Leadership</span> <br />
              through the Art of Humor
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto font-light leading-loose tracking-wide">
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




        {/* Timeline "The Journey" Section */}
        <section className="w-full py-32 px-6 relative">
          <div className="max-w-4xl mx-auto relative">
            {/* Central Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-blue-500/30 transform md:-translate-x-1/2"></div>

            {[
              {
                title: "The Spark",
                desc: "You identify the gap between your competence and your impact.",
                icon: "✨"
              },
              {
                title: "The Mechanics",
                desc: "Learn to deconstruct tension and rebuild it as influence.",
                icon: "🛠️"
              },
              {
                title: "The Stage",
                desc: "Practice high-stakes communication in low-stakes environments.",
                icon: "🎙️"
              },
              {
                title: "The Leader",
                desc: "Return to your boardroom with magnetism, wit, and authority.",
                icon: "🚀"
              }
            ].map((item, index) => (
              <FadeIn key={index} direction={index % 2 === 0 ? "right" : "left"} delay={index * 200}>
                <div className={`flex flex-col md:flex-row gap-8 items-center mb-24 relative ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  {/* Node on Line */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-background transform -translate-x-1/2 z-10"></div>

                  {/* Content Card */}
                  <div className="ml-12 md:ml-0 md:w-1/2 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-colors">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Empty spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2"></div>
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