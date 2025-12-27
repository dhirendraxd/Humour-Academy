import { PageLayout } from "@/components/PageLayout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mic, Users, Brain, Sparkles, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { moduleService, Curriculum } from "@/lib/modules";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, any> = {
    "Emotional Intelligence & Wit": BookOpen,
    "Public Speaking & Presence": Mic,
    "Adaptive Leadership": Users,
    "Advanced Satire & Strategy": Brain,
};

export default function Courses() {
    const [courses, setCourses] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await moduleService.listCurriculums();
                // Fetch modules for each curriculum to match the UI expectation
                const enrichedData = await Promise.all(data.map(async (c) => {
                    const modules = await moduleService.listModules(c.id);
                    return { ...c, modules };
                }));
                setCourses(enrichedData);
            } catch (error) {
                toast({
                    title: "Failed to load courses",
                    description: "Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, [toast]);

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
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Architecting Library...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {courses.length === 0 ? (
                            <div className="col-span-2 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-medium italic">No programs currently scheduled for launch.</p>
                            </div>
                        ) : (
                            courses.map((course, i) => {
                                const Icon = iconMap[course.title] || BookOpen;
                                return (
                                    <FadeIn key={course.id} delay={i * 100} direction="up">
                                        <Card className="h-full bg-background/60 backdrop-blur-md border border-border/50 hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                                            <CardHeader>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-mono uppercase tracking-wider">
                                                        {course.prerequisites === 'None' ? 'Introductory' : 'Advanced'}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                                                <CardDescription className="text-base leading-relaxed">
                                                    {course.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                                                    <Sparkles className="w-3 h-3 text-blue-600" /> Phases
                                                </h4>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {course.modules?.map((mod, j) => (
                                                        <li key={j} className="text-sm border border-border/50 rounded-lg p-3 bg-secondary/20 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                            {mod.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </FadeIn>
                                );
                            })
                        )}
                    </div>
                )}
            </section>
        </PageLayout>
    );
}
