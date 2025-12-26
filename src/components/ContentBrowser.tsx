import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { FileText, ClipboardCheck, ExternalLink, Download, ArrowLeft, BookOpen, Clock } from "lucide-react";
import { FadeIn } from "./FadeIn";

interface Material {
    id: number;
    title: string;
    content: string;
    type: 'video' | 'pdf' | 'link';
    created_at: string;
}

interface Assessment {
    id: number;
    title: string;
    description: string;
    due_date: string | null;
    status: 'pending' | 'submitted' | 'graded';
    score?: number;
}

interface ContentBrowserProps {
    cohortId: number;
    moduleTitle: string;
    onBack: () => void;
}

export const ContentBrowser = ({ cohortId, moduleTitle, onBack }: ContentBrowserProps) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, [cohortId]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const [materialsRes, assessmentsRes] = await Promise.all([
                api.get<Material[]>(`/materials?cohort_id=${cohortId}`),
                api.get<Assessment[]>(`/assessments?cohort_id=${cohortId}`)
            ]);
            setMaterials(materialsRes);
            setAssessments(assessmentsRes);
        } catch (error) {
            console.error("Failed to fetch content", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FadeIn>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white shadow-sm">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{moduleTitle}</h2>
                            <p className="text-sm text-slate-500 font-medium">Class Materials & Assessments</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                Study Materials
                            </h3>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 italic">{materials.length} Items</Badge>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />
                                ))}
                            </div>
                        ) : materials.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {materials.map(material => (
                                    <Card key={material.id} className="border-slate-100 bg-white/50 hover:bg-white hover:shadow-xl hover:shadow-blue-50 transition-all rounded-3xl overflow-hidden group">
                                        <CardContent className="p-5 flex flex-col justify-between h-full">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <Badge className="bg-slate-100 text-slate-500 border-0 uppercase text-[8px]">{material.type}</Badge>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-1 line-clamp-1">{material.title}</h4>
                                                <p className="text-[10px] text-slate-400 font-medium">Added {new Date(material.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <Button variant="ghost" className="mt-4 w-full rounded-xl text-blue-600 hover:bg-blue-50 justify-between group-hover:border-blue-100 border border-transparent">
                                                View Resource
                                                <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                <FileText className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium italic">No materials uploaded for this cohort yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <ClipboardCheck className="h-5 w-5 text-purple-600" />
                                Assessments
                            </h3>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
                                ))}
                            </div>
                        ) : assessments.length > 0 ? (
                            <div className="space-y-4">
                                {assessments.map(assessment => (
                                    <Card key={assessment.id} className="border-slate-100 bg-white hover:shadow-lg transition-all rounded-3xl overflow-hidden">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-800">{assessment.title}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                                        <Clock className="h-3 w-3" />
                                                        Due: {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : 'No deadline'}
                                                    </div>
                                                </div>
                                                <Badge className={`uppercase text-[8px] font-black ${assessment.status === 'graded' ? 'bg-green-100 text-green-600' :
                                                        assessment.status === 'submitted' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    {assessment.status}
                                                </Badge>
                                            </div>
                                            <Button className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-100">
                                                Take Assessment
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                <ClipboardCheck className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm font-medium italic">All clear! No assessments yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FadeIn>
    );
};
