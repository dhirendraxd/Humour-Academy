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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  id: string;
  question_type: 'mcq' | 'written';
  question_text: string;
  points: number;
  options?: string[];
  correct_answer?: string;
  order_index: number;
}

interface AssessmentCreationProps {
  facultyId: string;
  onAssessmentCreated?: () => void;
}

export const AssessmentCreation = ({ facultyId, onAssessmentCreated }: AssessmentCreationProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const addQuestion = (type: 'mcq' | 'written') => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      question_type: type,
      question_text: '',
      points: 1,
      options: type === 'mcq' ? ['', '', '', ''] : undefined,
      correct_answer: '',
      order_index: questions.length
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
    if (!title.trim()) {
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
      // Create assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          title,
          description,
          faculty_id: facultyId,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          total_points: questions.reduce((sum, q) => sum + q.points, 0),
          is_published: isPublished
        })
        .select()
        .single();

      if (assessmentError) throw assessmentError;

      // Create questions
      const questionsToInsert = questions.map((q, index) => ({
        assessment_id: assessment.id,
        question_type: q.question_type,
        question_text: q.question_text,
        points: q.points,
        options: q.options ? JSON.stringify(q.options) : null,
        correct_answer: q.correct_answer,
        order_index: index
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      // Send notifications to students if published
      if (isPublished) {
        const { data: students } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('role', 'student');

        if (students && students.length > 0) {
          const notifications = students.map(student => ({
            user_id: student.user_id,
            title: "New Assessment Available",
            message: `New assessment "${title}" has been published`,
            type: 'assessment',
            data: { assessment_id: assessment.id }
          }));

          await supabase
            .from('notifications')
            .insert(notifications);
        }
      }

      toast({
        title: "Success",
        description: `Assessment "${title}" has been created successfully`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setIsPublished(false);
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assessment title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assessment description (optional)"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="published" className="flex items-center gap-2">
              {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {isPublished ? 'Published (students can see)' : 'Draft (hidden from students)'}
            </Label>
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
                  <Badge variant={question.question_type === 'mcq' ? 'default' : 'secondary'}>
                    {question.question_type === 'mcq' ? 'Multiple Choice' : 'Written Answer'}
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
                    value={question.question_text}
                    onChange={(e) => updateQuestion(index, { question_text: e.target.value })}
                    placeholder="Enter your question here..."
                    rows={2}
                  />
                </div>

                {question.question_type === 'mcq' && (
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
          disabled={isCreating || !title.trim() || questions.length === 0}
          className="bg-gradient-primary border-0 hover:shadow-glow px-8"
        >
          <Save className="h-4 w-4 mr-2" />
          {isCreating ? 'Creating...' : 'Create Assessment'}
        </Button>
      </div>
    </div>
  );
};