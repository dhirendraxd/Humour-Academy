import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/FadeIn";
import { PageLayout } from "@/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

interface HomePageProps {
  onLoginClick: () => void;
  isAuthenticated?: boolean;
  onDashboardClick?: () => void;
}

export const HomePage = ({ onLoginClick, isAuthenticated, onDashboardClick }: HomePageProps) => {
  const navigate = useNavigate();

  return (
    <PageLayout footerIntensity="low">
      <SEO />
      <div className="flex flex-col items-center overflow-hidden">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center pt-32 pb-40 px-6 text-center max-w-4xl mx-auto space-y-16 relative">
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
              {isAuthenticated ? (
                <Button
                  size="lg"
                  onClick={onDashboardClick}
                  className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-none"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={onLoginClick}
                  className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-none"
                >
                  Apply for Fall 2025
                </Button>
              )}
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/curriculum')}
                className="rounded-full px-8 h-12 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              >
                View Curriculum
              </Button>
            </div>
          </FadeIn>
        </section>

        {/* Journey Timeline Section */}
        <section className="w-full py-32 px-6 relative">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-blue-500/30 transform md:-translate-x-1/2"></div>

            {[
              {
                title: "The Spark",
                desc: "You identify the gap between your competence and your impact.",
              },
              {
                title: "The Mechanics",
                desc: "Learn to deconstruct tension and rebuild it as influence.",
              },
              {
                title: "The Stage",
                desc: "Practice high-stakes communication in low-stakes environments.",
              },
              {
                title: "The Leader",
                desc: "Return to your boardroom with magnetism, wit, and authority.",
              }
            ].map((item, index) => (
              <FadeIn key={index} direction={index % 2 === 0 ? "right" : "left"} delay={index * 200}>
                <div className={`flex flex-col md:flex-row gap-8 items-center mb-24 relative ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-background transform -translate-x-1/2 z-10"></div>
                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {item.desc}
                    </p>
                  </div>
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32 px-6">
          <FadeIn direction="up">
            <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-gradient-primary text-primary-foreground relative overflow-hidden shadow-lg">
              <h2 className="text-4xl md:text-5xl font-bold relative z-10">Ready to Begin?</h2>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto relative z-10">
                Admissions for the upcoming executive cohort close in 14 days.
              </p>
              <div className="pt-4 relative z-10">
                <Button
                  onClick={isAuthenticated ? onDashboardClick : onLoginClick}
                  className="h-14 px-10 rounded-full bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-lg"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Application"}
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </PageLayout>
  );
};