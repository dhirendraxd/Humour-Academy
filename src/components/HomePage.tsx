import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Trophy, ChevronRight, Play, BookOpen, Star, Sparkles, Mic } from "lucide-react";
import { ParticleField } from "@/components/ParticleField";
import { FadeIn } from "@/components/FadeIn";

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      <ParticleField />

      {/* Navigation */}
      <header className="w-full py-6 px-6 md:px-12 lg:px-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/40">
        <div className="flex items-center gap-2 mr-12 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          {/* Simple Logo */}
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-primary text-2xl">▲</span> {/* Abstract triangle icon */}
            Ramay Academy
          </div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground items-center">
          <a href="#curriculum" className="hover:text-primary transition-colors">Curriculum</a>
          <a href="#faculty" className="hover:text-primary transition-colors">Faculty</a>
          <a href="#events" className="hover:text-primary transition-colors">Events</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
        </nav>

        <div className="ml-auto">
          <Button
            onClick={onLoginClick}
            className="rounded-full px-6 font-medium bg-foreground text-background hover:bg-foreground/90 transition-opacity shadow-none h-10"
          >
            Student Portal
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center relative overflow-hidden">

        {/* Hero Section */}
        <section className="pt-24 pb-32 px-6 text-center max-w-5xl mx-auto space-y-10 z-10">
          <FadeIn delay={100}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.95]">
              <span className="text-primary">Next-generation</span> <br />
              comedy school
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              We don't just teach you how to be funny. We engineer the science of laughter.
              Join the world's premier institution for comedic arts.
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
              { label: "Active Students", value: "500+" },
              { label: "Certified Courses", value: "12" },
              { label: "Guest Lecturers", value: "25+" },
              { label: "Alumni Network", value: "2k+" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 100} direction="up">
                <div className="space-y-1">
                  <div className="text-4xl font-bold tracking-tight text-primary">{stat.value}</div>
                  <div className="text-sm text-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Curriculum Preview */}
        <section id="curriculum" className="w-full py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="mb-16 text-center space-y-4">
                <span className="text-primary font-bold tracking-wider uppercase text-sm">Academic Rigor</span>
                <h2 className="text-4xl md:text-5xl font-bold">The Science of Humor</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our curriculum breaks down comedy into its fundamental particles.
                  Master the physics of timing and the chemistry of wit.
                </p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "Theory of Irony",
                  desc: "A deep dive into the dissonance between expectation and reality."
                },
                {
                  icon: Mic,
                  title: "Applied Stand-up",
                  desc: "Practical lab work focusing on delivery, crowd work, and heckler management."
                },
                {
                  icon: Users,
                  title: "Improvisational Dynamics",
                  desc: "Real-time comedic synthesis and collaborative scene building."
                }
              ].map((course, i) => (
                <FadeIn key={i} delay={i * 200}>
                  <div className="bg-card border border-border p-8 rounded-3xl hover:border-primary/50 transition-all duration-300 group cursor-default hover:-translate-y-2 hover:shadow-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                      <course.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{course.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy / About */}
        <section id="about" className="w-full py-32 px-6 bg-secondary/30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <FadeIn direction="left">
                <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Philosophy</span>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  "Funny is serious business."
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Ramay Academy, we reject the notion that you're just "born with it."
                  Humor is a discipline, a muscle, and a science. We provide the laboratory
                  where you experiment with the boundaries of what makes people laugh.
                </p>
                <div className="flex flex-col gap-4 pt-4">
                  {[
                    "Research-backed methodologies",
                    "Industry-standard performance spaces",
                    "Global network of comedy clubs"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 font-medium">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-primary" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Abstract Visual Representation */}
            <div className="flex-1 w-full h-[500px] relative">
              <FadeIn direction="right" delay={200} className="w-full h-full">
                <div className="absolute inset-0 bg-white border border-border rounded-3xl overflow-hidden shadow-sm flex items-center justify-center hover:shadow-lg transition-shadow duration-500">
                  <div className="relative z-10 text-center space-y-6 p-8">
                    <div className="text-9xl font-black text-primary/10 select-none animate-pulse">HA</div>
                    <div className="text-9xl font-black text-primary/20 select-none absolute -top-8 left-1/2 -translate-x-1/2" style={{ animationDelay: '100ms' }}>HA</div>
                    <div className="text-9xl font-black text-primary/30 select-none absolute -top-16 left-1/2 -translate-x-1/2" style={{ animationDelay: '200ms' }}>HA</div>
                    <p className="font-mono text-sm text-muted-foreground mt-8 bg-secondary/50 px-4 py-2 rounded-full inline-block">
                      fig 1.1: The recursive nature of laughter
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-32 px-6">
          <FadeIn direction="up">
            <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden shadow-2xl hover:shadow-primary/50 transition-shadow duration-500">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

              <h2 className="text-4xl md:text-5xl font-bold relative z-10">Ready to take the mic?</h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto relative z-10">
                Admissions for the upcoming semester close in 14 days.
                Secure your spot in the spotlight.
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

      <footer className="py-12 px-6 border-t border-border/40 text-center text-sm text-muted-foreground bg-secondary/5">
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12 text-left">
          <div>
            <div className="font-bold text-foreground mb-4">Ramay Academy</div>
            <p className="leading-relaxed">Educating the next generation of humorists since 2010.</p>
          </div>
          <div>
            <div className="font-bold text-foreground mb-4">Programs</div>
            <ul className="space-y-2">
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Stand-up</a></li>
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Improv</a></li>
              <li><a href="#curriculum" className="hover:text-primary transition-colors">Sketch Writing</a></li>
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
        <div className="flex justify-between items-center max-w-6xl mx-auto pt-8 border-t border-border/20">
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