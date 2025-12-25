import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { History, Target, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function About() {
    const navigate = useNavigate();

    return (
        <PageLayout>
            <SEO
                title="About Us"
                description="Learn about Ramay Humour Academy - the world's first institution dedicated to the Serious Business of Comedy. Founded in 2010, we democratize access to social superpowers."
                keywords="about ramay, comedy education, leadership training, humor academy, executive coaching"
            />
            <FadeIn>
                <div className="max-w-7xl mx-auto px-6 py-24 text-center z-10 relative">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        About <span className="text-blue-600">Ramay</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        We are redefining higher education by placing humor at the core of human development.
                        Founded in 2010, Ramay Academy is the world's first institution dedicated to the
                        Serious Business of Comedy.
                    </p>
                </div>
            </FadeIn>

            <section className="max-w-5xl mx-auto px-6 pb-32 z-10 relative space-y-24">

                {/* Stats Section */}
                <FadeIn direction="up">
                    <div className="w-full py-8 border-y border-border/40 bg-secondary/5 mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {[
                                { label: "Active Leaders", value: "500+" },
                                { label: "Corporate Partners", value: "12" },
                                { label: "Executive Coaches", value: "25+" },
                                { label: "Global Alumni", value: "2k+" },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-4xl font-bold tracking-tight text-blue-600">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Mission */}
                <FadeIn direction="left">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Target className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                To democratize access to the social superpowers traditionally held by comedians.
                                We believe that the ability to reframe reality, diffuse tension, and speak truth
                                to power are essential skills for the modern leader.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                <Separator />

                {/* History */}
                <FadeIn direction="right">
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <History className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="space-y-4 text-right md:text-left">
                            <div className="md:text-right w-full">
                                <h2 className="text-3xl font-bold">Our History</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Started in a small basement comedy club in London, Ramay began as a workshop for
                                    anxious executives. It quickly grew into a global movement. Today, our
                                    alumni lead Fortune 500 companies, nonprofits, and creative agencies.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <Separator />

                {/* Philosophy */}
                <FadeIn direction="left">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Heart className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">The Philosophy</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                "If you can make them laugh, you can make them listen." – This is our guiding star.
                                We reject the stiff, formal modes of traditional leadership in favor of authenticity,
                                vulnerability, and joy.
                            </p>
                        </div>
                    </div>
                </FadeIn>

                {/* CTA */}
                <FadeIn direction="up">
                    <div className="bg-background/60 backdrop-blur-md rounded-3xl p-12 text-center space-y-8 border border-border/50 shadow-sm">
                        <h2 className="text-4xl font-bold">Ready to take the stage?</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Whether you're looking to lead a boardroom or just conquer your fear of public speaking,
                            there is a place for you at Ramay.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/auth')}
                            className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-button"
                        >
                            Join the Academy
                        </Button>
                    </div>
                </FadeIn>

            </section>
        </PageLayout>
    );
}
