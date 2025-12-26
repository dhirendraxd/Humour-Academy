import { moduleService, Module, Cohort } from "@/lib/modules";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User as UserIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const StudentCourses = ({ onBack }: { onBack: () => void }) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadModules();
    }, []);

    const loadModules = async () => {
        try {
            const data = await moduleService.listModules();
            // Fetch cohorts for each module to show availability
            const modulesWithCohorts = await Promise.all(data.map(async (m) => {
                const cohorts = await moduleService.listCohorts(m.id);
                return { ...m, cohorts };
            }));
            setModules(modulesWithCohorts);
        } catch (error) {
            console.error('Failed to load modules', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (cohortId: number) => {
        try {
            await moduleService.apply(cohortId);
            toast({
                title: "Application Sent",
                description: "Your request has been sent to the teacher.",
            });
        } catch (error: any) {
            toast({
                title: "Application Failed",
                description: error.message || "Could not apply for cohort.",
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
                                <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <span>Curriculum Modules</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">Browse modules and apply for open cohorts</p>
                    </div>
                    <Button variant="outline" onClick={onBack}>Back to Dashboard</Button>
                </div>

                <div className="grid gap-8">
                    {modules.map(module => (
                        <Card key={module.id} className="overflow-hidden border-slate-200 shadow-academic">
                            <div className="md:flex">
                                <div className="md:w-1/3 bg-slate-50 p-6 border-r border-slate-100">
                                    <Badge variant="outline" className="mb-3">Module {module.order_index}</Badge>
                                    <h2 className="text-xl font-bold mb-2">{module.title}</h2>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                        <UserIcon className="h-4 w-4" />
                                        <span>{module.teacher?.name}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {module.description}
                                    </p>
                                </div>
                                <div className="md:w-2/3 p-6 bg-white">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Available Cohorts (Batches)
                                    </h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {module.cohorts?.filter(c => c.status !== 'completed').map(cohort => (
                                            <div key={cohort.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold text-slate-700">{cohort.title}</span>
                                                    <Badge variant={cohort.status === 'active' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                                                        {cohort.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-4">
                                                    {cohort.start_date ? new Date(cohort.start_date).toLocaleDateString() : 'TBA'} -
                                                    {cohort.end_date ? new Date(cohort.end_date).toLocaleDateString() : 'TBA'}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => handleApply(cohort.id)}
                                                >
                                                    Apply to Join
                                                </Button>
                                            </div>
                                        ))}
                                        {(!module.cohorts || module.cohorts.length === 0) && (
                                            <div className="col-span-full py-8 text-center text-slate-400 text-sm italic">
                                                No upcoming cohorts for this module.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {modules.length === 0 && !loading && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600">No modules available</h3>
                            <p className="text-slate-400">The curriculum is currently being prepared.</p>
                        </div>
                    )}
                </div>
            </div>
        </FadeIn>
    );
};
