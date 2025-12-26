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

interface Question {
  id: string;
  type: 'mcq' | 'written';
  question: string;
  points: number;
  options?: string[];
  correctAnswer?: string;
}

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
      correctAnswer: '',
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
      // Mock create assessment
      console.log("Creating assessment mock", formData, questions);

      await new Promise(resolve => setTimeout(resolve, 1000));

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
                  <Badge variant={question.type === 'mcq' ? 'default' : 'secondary'}>
                    {question.type === 'mcq' ? 'Multiple Choice' : 'Written Answer'}
                  </Badge>
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
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(index, { question: e.target.value })}
                    placeholder="Enter your question here..."
                    rows={2}
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
                        value={question.correctAnswer}
                        onValueChange={(value) => updateQuestion(index, { correctAnswer: value })}
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