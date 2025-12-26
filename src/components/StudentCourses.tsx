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
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black flex items-center space-x-4 tracking-tighter text-slate-900">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                            <span>Courses</span>
                        </h1>
                        <p className="text-slate-500 mt-3 text-lg font-medium">Select a specialized curriculum to begin your journey into humor mastery</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="rounded-2xl hover:bg-white shadow-sm border border-slate-100 px-6 font-bold"
                    >
                        Back to Dashboard
                    </Button>
                </div>

                <div className="grid gap-10 lg:grid-cols-2">
                    {curriculums.map(curriculum => {
                        const firstTeacher = curriculum.modules?.[0]?.teacher;
                        const firstModule = curriculum.modules?.[0];
                        const upcomingCohort = firstModule?.cohorts?.find(c => new Date(c.application_deadline) >= new Date());

                        return (
                            <Card key={curriculum.id} className="overflow-hidden border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-blue-100/30 transition-all rounded-[2.5rem] bg-white group">
                                <CardHeader className="bg-slate-50/30 p-8 border-b border-slate-50">
                                    <div className="flex justify-between items-start mb-6">
                                        <Badge className="bg-blue-600 text-white border-0 px-4 py-1.5 text-xs font-black tracking-widest uppercase">
                                            {curriculum.modules?.length || 0} PHASE PROGRAM
                                        </Badge>
                                        {upcomingCohort && (
                                            <Badge className="bg-green-100 text-green-600 border-0 text-[10px] font-black uppercase">
                                                Next Batch: {new Date(upcomingCohort.start_date).toLocaleDateString()}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                                        {curriculum.title}
                                    </CardTitle>

                                    {firstTeacher && (
                                        <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                <UserIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Lead Architect</p>
                                                <p className="font-bold text-slate-800 text-sm">{firstTeacher.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{firstTeacher.rank}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardHeader>

                                <CardContent className="p-8 space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> Duration
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">~{curriculum.modules?.reduce((acc, m) => acc + (m.duration_months || 0), 0)} Months</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <GraduationCap className="w-3 h-3" /> Seats
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">
                                                {upcomingCohort ? `${upcomingCohort.enrollments_count || 0}/${upcomingCohort.capacity || 25} Filled` : 'TBA'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">What you'll master:</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed italic">
                                                {curriculum.outcomes || "Enriching curriculum details coming soon..."}
                                            </p>
                                        </div>

                                        <div className="p-5 bg-blue-50/30 rounded-3xl border border-blue-50/50">
                                            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 text-center">Prerequisites:</h4>
                                            <p className="text-xs text-slate-400 text-center font-medium italic">
                                                {curriculum.prerequisites || "Open to all humor enthusiasts."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            className="w-full h-16 text-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-100 border-0 rounded-2xl group-hover:scale-[1.02] transition-transform"
                                            onClick={() => handleEnroll(curriculum.id)}
                                        >
                                            Begin Enrollment
                                        </Button>
                                        <div className="flex items-center justify-between mt-4 px-2">
                                            <p className="text-[10px] text-slate-400 font-bold italic">
                                                * Final approval pending architect's review
                                            </p>
                                            {upcomingCohort && (
                                                <p className="text-[10px] text-red-500 font-black flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Deadline: {new Date(upcomingCohort.application_deadline).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {curriculums.length === 0 && !loading && (
                        <div className="col-span-full text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                            <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-slate-800">No active programs</h3>
                            <p className="text-slate-400 font-medium mt-2">Our humor architects are currently drafting new masterclasses.</p>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};
