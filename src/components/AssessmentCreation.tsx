import { useState } from "react";
import { Plus, Minus, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { assessmentService, Assessment, Question } from "@/lib/assessments";

interface AssessmentCreationProps {
  facultyId: string;
  onAssessmentCreated?: () => void;
}

export const AssessmentCreation = ({ facultyId, onAssessmentCreated }: AssessmentCreationProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: 'quiz' as 'quiz' | 'assignment' | 'exam' | 'practice',
    totalMarks: 100,
    dueDate: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const addQuestion = (type: 'mcq' | 'written') => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      type,
      question: '',
      points: 1,
      options: type === 'mcq' ? ['', '', '', ''] : undefined,
      correct_answer: '',
      explanation: '',
      difficulty: 'beginner',
      category_tag: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions(questions.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateMCQOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };

  const createAssessment = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an assessment title",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        total_marks: formData.totalMarks,
        due_date: formData.dueDate || null,
        questions: questions.map(q => ({
          type: q.type,
          question: q.question,
          points: q.points,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          category_tag: q.category_tag
        }))
      };

      await assessmentService.create(payload as any);

      toast({
        title: "Success",
        description: `Assessment "${formData.title}" has been created successfully`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: 'quiz',
        totalMarks: 100,
        dueDate: "",
      });
      setQuestions([]);
      onAssessmentCreated?.();

    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Create New Assessment</span>
            <Badge variant="secondary" className="ml-auto">
              {totalPoints} points total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assessment Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter assessment title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Assessment Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter assessment description (optional)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card className="shadow-academic">
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="border-l-4 border-l-primary/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={question.type === 'mcq' ? 'default' : 'secondary'}>
                      {question.type === 'mcq' ? 'Multiple Choice' : 'Written Answer'}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold ${question.difficulty === 'advanced' ? 'text-red-600 border-red-200 bg-red-50' :
                      question.difficulty === 'intermediate' ? 'text-orange-600 border-orange-200 bg-orange-50' :
                        'text-green-600 border-green-200 bg-green-50'
                      }`}>
                      {question.difficulty}
                    </Badge>
                    {question.category_tag && (
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500 border-slate-200">
                        {question.category_tag}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Points:</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={question.points}
                      onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 1 })}
                      className="w-16 h-8"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Difficulty</Label>
                    <Select
                      value={question.difficulty}
                      onValueChange={(value: any) => updateQuestion(index, { difficulty: value })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category Tag</Label>
                    <Input
                      placeholder="e.g. Irony, Delivery, Pacing"
                      value={question.category_tag}
                      onChange={(e) => updateQuestion(index, { category_tag: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Points</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={question.points}
                        onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 1 })}
                        className="h-9"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                        className="h-9 w-9 text-destructive hover:text-destructive/80 hover:bg-destructive/10 shrink-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Text</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(index, { question: e.target.value })}
                    placeholder="Enter your question here..."
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {question.type === 'mcq' && (
                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {String.fromCharCode(65 + optionIndex)}
                        </Badge>
                        <Input
                          value={option}
                          onChange={(e) => updateMCQOption(index, optionIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select
                        value={question.correct_answer}
                        onValueChange={(value) => updateQuestion(index, { correct_answer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options?.map((option, optionIndex) => (
                            <SelectItem key={optionIndex} value={option} disabled={!option.trim()}>
                              {String.fromCharCode(65 + optionIndex)}: {option || 'Empty option'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-slate-100 mt-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pedagogical Explanation</Label>
                  <Textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                    placeholder="Provide reasoning to help students learn after answering..."
                    rows={2}
                    className="bg-slate-50 border-slate-200 text-xs italic"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => addQuestion('mcq')}
              className="flex-1 hover:bg-primary/10 hover:border-primary/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Multiple Choice
            </Button>
            <Button
              variant="outline"
              onClick={() => addQuestion('written')}
              className="flex-1 hover:bg-secondary/10 hover:border-secondary/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Written Answer
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={createAssessment}
          disabled={isCreating || !formData.title.trim() || questions.length === 0}
          className="bg-gradient-primary border-0 hover:shadow-glow px-8"
        >
          <Save className="h-4 w-4 mr-2" />
          {isCreating ? 'Creating...' : 'Create Assessment'}
        </Button>
      </div>
    </div>
  );
};