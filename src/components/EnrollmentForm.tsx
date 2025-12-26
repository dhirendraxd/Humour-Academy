import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, GraduationCap, Heart, Send } from 'lucide-react';

interface EnrollmentFormProps {
    onSubmit: (details: any) => void;
    onCancel: () => void;
    isLoading: boolean;
    curriculumTitle: string;
}

export const EnrollmentForm = ({ onSubmit, onCancel, isLoading, curriculumTitle }: EnrollmentFormProps) => {
    const [interests, setInterests] = useState('');
    const [experience, setExperience] = useState('');
    const [motivation, setMotivation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            interests,
            experience,
            motivation
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 uppercase tracking-tight">Apply for Enrollment</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{curriculumTitle}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Heart className="w-3 h-3 text-red-500" /> What sparks your humor interest?
                    </Label>
                    <Input
                        placeholder="e.g., Satire, Puns, Deadpan..."
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        required
                        className="rounded-xl border-slate-100 bg-slate-50/50"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-blue-500" /> Your Background in Comedy (if any)
                    </Label>
                    <Textarea
                        placeholder="Tell us about your previous experience or natural talent."
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[80px]"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Send className="w-3 h-3 text-green-500" /> Why join this curriculum?
                    </Label>
                    <Textarea
                        placeholder="What do you hope to achieve by the end of this journey?"
                        value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}
                        required
                        className="rounded-xl border-slate-100 bg-slate-50/50 min-h-[80px]"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100"
                >
                    {isLoading ? 'Submitting Application...' : 'Submit Application to Architect'}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="w-full text-slate-400 font-bold hover:text-slate-600"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};
