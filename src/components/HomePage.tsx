import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";

interface HomePageProps {
  onLoginClick: () => void;
}

export const HomePage = ({ onLoginClick }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">

      {/* Minimal Navigation */}
      <header className="w-full py-6 px-6 md:px-12 lg:px-24 flex justify-between items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Simple Logo Concept */}
          <div className="text-xl font-bold tracking-tight text-primary">Ramay Institute</div>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Academy</a>
          <a href="#" className="hover:text-primary transition-colors">Faculty</a>
          <a href="#" className="hover:text-primary transition-colors">Admissions</a>
        </nav>

        <Button
          onClick={onLoginClick}
          className="rounded-full px-6 bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-none"
        >
          Portal Login
        </Button>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 text-center max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary/40"></span>
              Accepting Applications for Fall 2025
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[1.1]">
              Experience the future <br className="hidden md:block" />
              of comedy education.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Ramay Institute combines academic rigor with the art of humor.
              Join a community tailored for the world's most aspiring humorists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={onLoginClick}
              className="rounded-full px-10 h-14 text-base bg-primary text-primary-foreground hover:opacity-90 shadow-none transition-all"
            >
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 h-14 text-base border-input hover:bg-secondary transition-all"
            >
              View Curriculum
            </Button>
          </div>
        </section>

        {/* Minimal Stats Grid */}
        <section className="py-16 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Students", value: "500+" },
              { label: "Expert Faculty", value: "25+" },
              { label: "Years of Legacy", value: "10+" },
              { label: "Global Alumni", value: "2k+" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl font-bold tracking-tight text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-32 px-6 md:px-12 lg:px-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            {[
              {
                icon: GraduationCap,
                title: "Structured Learning",
                desc: "A comprehensive curriculum designed to deconstruct the mechanics of humor."
              },
              {
                icon: Users,
                title: "Mentorship",
                desc: "Direct access to industry veterans and academic scholars in the field of comedy."
              },
              {
                icon: Trophy,
                title: "Recognition",
                desc: "Earn prestigious ranks and levels as you master new techniques and theories."
              }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
                <div className="pt-2 flex items-center text-sm font-semibold text-primary cursor-pointer hover:underline">
                  Learn more <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section className="py-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Join a community of <br />
                lifelong learners.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Ramay, we believe humor is a serious discipline. Our community is
                dedicated to exploring the boundaries of comedy through academic excellence.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Access to exclusive workshops",
                  "Weekly peer reviews and critiques",
                  "Annual humor research symposium"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full">
              <Card className="bg-primary text-primary-foreground p-8 md:p-12 rounded-3xl border-0 shadow-2xl">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-3xl font-bold">Ready to apply?</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <p className="text-primary-foreground/80 text-lg">
                    Take the first step towards your diploma in comedic arts.
                    Applications are reviewed on a rolling basis.
                  </p>
                  <Button
                    onClick={onLoginClick}
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold h-12 rounded-xl text-lg shadow-none"
                  >
                    Create Student Account
                  </Button>
                  <p className="text-xs text-center text-primary-foreground/60">
                    * No prior comedy experience required. Just a willingness to learn.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-12 px-6 border-t border-border/40 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-6 mb-8 font-medium">
          <a href="#" className="hover:text-primary">Twitter</a>
          <a href="#" className="hover:text-primary">Instagram</a>
          <a href="#" className="hover:text-primary">LinkedIn</a>
        </div>
        <p>&copy; 2024 Ramay Institute of Humour. All rights reserved.</p>
      </footer>

    </div>
  );
};