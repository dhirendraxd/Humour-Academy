import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mic, Users, Brain, Sparkles, Download } from "lucide-react";

export default function Courses() {
    const courses = [
        {
            title: "Emotional Intelligence & Wit",
            level: "Level 100",
            icon: BookOpen,
            description: "Understand the psychology of humor and how to use it to build empathy and rapport. Learn to read the room and navigate social tension.",
            modules: ["The Physiology of Laughter", "Empathy Mapping", "Timing & Tension", "Authentic Vulnerability"]
        },
        {
            title: "Public Speaking & Presence",
            level: "Level 200",
            icon: Mic,
            description: "Master stage command and delivery. Transform anxiety into energy and captivate any audience with authentic storytelling.",
            modules: ["Stage Mechanics", "Voice & Projection", "Improvised Speaking", "Story Structure"]
        },
        {
            title: "Adaptive Leadership",
            level: "Level 300",
            icon: Users,
            description: "Apply comedic principles to leadership. Learn to pivot instantly, manage team dynamics, and lead with levity.",
            modules: ["Status Transactions", "Collaborative Play", "Crisis Management", "The Leader as Host"]
        },
        {
            title: "Advanced Satire & Strategy",
            level: "Master",
            icon: Brain,
            description: "Use higher-order humor to analyze complex systems and drive strategic change. The ultimate tool for thought leadership.",
            modules: ["Rhetorical Devices", "Irony & Subtext", "Cultural Critique", "Strategic Influence"]
        }
    ];

    return (
        <PageLayout>
            <FadeIn>
                <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        The <span className="text-blue-600">Science</span> of Soft Skills
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        Our courses transform intangible qualities like charisma and wit into
                        trainable mechanics. We don't just teach you to be funny;
                        we teach you to be formidable.
                    </p>

                    <Button size="lg" className="rounded-full px-8 h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-button">
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Syllabus
                    </Button>
                </div>
            </FadeIn>

            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid md:grid-cols-2 gap-8">
                    {courses.map((course, i) => (
                        <FadeIn key={i} delay={i * 100} direction="up">
                            <Card className="h-full bg-background/60 backdrop-blur-md border border-border/50 hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                            <course.icon className="w-6 h-6" />
                                        </div>
                                        <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-mono uppercase tracking-wider">
                                            {course.level}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                                    <CardDescription className="text-base leading-relaxed">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-blue-600" /> Modules
                                    </h4>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {course.modules.map((mod, j) => (
                                            <li key={j} className="text-sm border border-border/50 rounded-lg p-3 bg-secondary/20 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                {mod}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </section>
        </PageLayout>
    );
}
