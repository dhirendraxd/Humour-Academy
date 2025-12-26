import { moduleService, Module, Cohort, Curriculum } from "@/lib/modules";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User as UserIcon, GraduationCap, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const StudentCourses = ({ onBack }: { onBack: () => void }) => {
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadCurriculums();
    }, []);

    const loadCurriculums = async () => {
        try {
            const data = await moduleService.listCurriculums();
            // Fetch modules for each curriculum
            const curriculumsWithModules = await Promise.all(data.map(async (c) => {
                const modules = await moduleService.listModules(c.id);
                return { ...c, modules };
            }));
            setCurriculums(curriculumsWithModules);
        } catch (error) {
            console.error('Failed to load curriculums', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (curriculumId: number) => {
        try {
            await moduleService.applyToCurriculum(curriculumId);
            toast({
                title: "Enrollment Requested",
                description: "Your application for the program has been sent. The Module 1 teacher will review it shortly.",
            });
        } catch (error) {
            const err = error as Error;
            toast({
                title: "Enrollment Failed",
                description: err.message || "Could not enroll in program.",
                variant: "destructive"
            });
        }
    };

    return (
        <FadeIn>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center space-x-3 tracking-tight">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <GraduationCap className="h-8 w-8 text-primary" />
                            </div>
                            <span>Academic Programs</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">Select a curriculum to begin your journey into humor mastery</p>
                    </div>
                    <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {curriculums.map(curriculum => (
                        <Card key={curriculum.id} className="overflow-hidden border-slate-200 shadow-academic hover:shadow-glow transition-all">
                            <CardHeader className="bg-slate-50/50 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">{curriculum.title}</CardTitle>
                                        <CardDescription className="mt-2 text-md leading-relaxed">
                                            {curriculum.description}
                                        </CardDescription>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                        {curriculum.modules?.length || 0} Modules
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Learning Path
                                    </h3>

                                    <div className="space-y-4 relative">
                                        {/* Vertical Path Line */}
                                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100 hidden sm:block"></div>

                                        {curriculum.modules?.map((module, mIdx) => {
                                            const upcomingCohort = module.cohorts?.find(c => new Date(c.application_deadline) >= new Date());
                                            return (
                                                <div key={module.id} className="flex gap-4 relative">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 z-10 hidden sm:flex">
                                                        {mIdx + 1}
                                                    </div>
                                                    <div className="flex-1 p-3 rounded-lg border border-slate-50 bg-slate-50/50">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-semibold text-slate-800">{module.title}</p>
                                                                <p className="description-text text-xs text-slate-500 mt-1 line-clamp-1">
                                                                    {module.description}
                                                                </p>
                                                                {upcomingCohort && (
                                                                    <div className="flex flex-col gap-1 mt-2">
                                                                        <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                                                                            <Calendar className="h-3 w-3" />
                                                                            Registration Closes: {new Date(upcomingCohort.application_deadline).toLocaleDateString()}
                                                                        </p>
                                                                        <p className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                                                                            <Clock className="w-3 h-3 text-slate-300" />
                                                                            Batch Duration: {
                                                                                Math.max(1, Math.min(3, Math.ceil((new Date(upcomingCohort.end_date).getTime() - new Date(upcomingCohort.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30.44))))
                                                                            } Months
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-[10px] font-medium text-slate-400 italic">
                                                                    {module.duration_months} Months
                                                                </span>
                                                                {upcomingCohort ? (
                                                                    <Badge variant="outline" className="text-[9px] bg-green-50 text-green-700 border-green-100">
                                                                        Enrolling Now
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="text-[9px] bg-slate-100 text-slate-500 border-slate-200">
                                                                        Fully Booked
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        className="w-full h-12 text-lg font-bold bg-gradient-primary hover:shadow-glow border-0"
                                        onClick={() => handleEnroll(curriculum.id)}
                                    >
                                        Enroll in Program
                                    </Button>
                                    <p className="text-center text-[10px] text-slate-400 italic">
                                        * Enrollment is subject to approval by the Module 1 Faculty Head.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {curriculums.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600">No programs available</h3>
                            <p className="text-slate-400">Our humor architects are currently drafting new curriculums.</p>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};
