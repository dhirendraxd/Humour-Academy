import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Calendar,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { moduleService, Module, Cohort } from "@/lib/modules";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface CohortManagerProps {
    moduleId: number;
}

export const CohortManager = ({ moduleId }: CohortManagerProps) => {
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const { toast } = useToast();

    const [newCohort, setNewCohort] = useState({
        title: "",
        start_date: "",
        application_deadline: "",
        end_date: "",
        status: "planned" as const
    });

    useEffect(() => {
        fetchCohorts();
    }, [moduleId]);

    const fetchCohorts = async () => {
        setLoading(true);
        try {
            const data = await moduleService.listCohorts(moduleId);
            setCohorts(data);
        } catch (error) {
            toast({ title: "Error fetching cohorts", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            if (!newCohort.title || !newCohort.start_date || !newCohort.application_deadline) {
                toast({ title: "Please fill in all required fields", variant: "destructive" });
                return;
            }
            await moduleService.createCohort({ ...newCohort, module_id: moduleId });
            toast({ title: "Batch created successfully" });
            setShowAddForm(false);
            fetchCohorts();
            setNewCohort({
                title: "",
                start_date: "",
                application_deadline: "",
                end_date: "",
                status: "planned"
            });
        } catch (error) {
            toast({ title: "Failed to create batch", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Batch Management</h3>
                    <p className="text-sm text-slate-500">Schedule and manage enrollment windows for this module.</p>
                </div>
                <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {showAddForm ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> New Batch</>}
                </Button>
            </div>

            {showAddForm && (
                <Card className="border-2 border-blue-100 bg-blue-50/30 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Batch Name (e.g., Spring 2026 Batch A)</Label>
                                <Input
                                    id="title"
                                    placeholder="Batch Name"
                                    value={newCohort.title}
                                    onChange={e => setNewCohort(prev => ({ ...prev, title: e.target.value }))}
                                    className="rounded-xl border-slate-200 bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Application Deadline</Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={newCohort.application_deadline}
                                    onChange={e => setNewCohort(prev => ({ ...prev, application_deadline: e.target.value }))}
                                    className="rounded-xl border-slate-200 bg-white"
                                />
                                <p className="text-[10px] text-slate-500 italic">Registration will close at the end of this day.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start">Start Date</Label>
                                <Input
                                    id="start"
                                    type="date"
                                    value={newCohort.start_date}
                                    onChange={e => setNewCohort(prev => ({ ...prev, start_date: e.target.value }))}
                                    className="rounded-xl border-slate-200 bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end">End Date (Estimated)</Label>
                                <Input
                                    id="end"
                                    type="date"
                                    value={newCohort.end_date}
                                    onChange={e => setNewCohort(prev => ({ ...prev, end_date: e.target.value }))}
                                    className="rounded-xl border-slate-200 bg-white"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleCreate} className="px-8 rounded-xl bg-blue-600 hover:bg-blue-700">
                                Create Schedule
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {cohorts.map(cohort => {
                    const isOver = new Date(cohort.application_deadline) < new Date();
                    return (
                        <Card key={cohort.id} className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow rounded-2xl">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center">
                                    <div className={`w-2 h-auto self-stretch ${isOver ? 'bg-slate-300' : 'bg-green-500'}`} />
                                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${isOver ? 'bg-slate-100 text-slate-400' : 'bg-green-50 text-green-600'}`}>
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{cohort.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge variant="outline" className={`text-[10px] font-bold ${cohort.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'text-slate-500'}`}>
                                                        {cohort.status.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Registered: {cohort.enrollments_count || 0} students
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 text-sm">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Application Deadline</p>
                                                <p className={`font-semibold ${isOver ? 'text-slate-400 stroke-through' : 'text-blue-600'}`}>
                                                    {new Date(cohort.application_deadline).toLocaleDateString()}
                                                    {isOver && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100">Closed</span>}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Start Date</p>
                                                <p className="font-semibold text-slate-700">
                                                    {new Date(cohort.start_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" className="rounded-xl text-slate-400 hover:text-blue-600">
                                                Edit
                                            </Button>
                                            <Button variant="ghost" size="sm" className="rounded-xl text-slate-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {cohorts.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white/50 border-2 border-dashed border-muted rounded-[2rem] text-muted-foreground">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No batches scheduled for this module yet.</p>
                        <Button variant="link" onClick={() => setShowAddForm(true)} className="mt-2 text-blue-600 font-bold">
                            Schedule your first batch
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
