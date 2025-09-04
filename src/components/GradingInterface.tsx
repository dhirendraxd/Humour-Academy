import { useState, useEffect } from "react";
import { CheckCircle, Clock, FileText, User, Award, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Submission {
  id: string;
  assessment_id: string;
  student_id: string;
  submitted_at: string;
  total_score: number;
  is_graded: boolean;
  graded_by: string | null;
  graded_at: string | null;
  student_profile: {
    full_name: string;
    email: string;
  };
  assessment: {
    title: string;
    total_points: number;
  };
  answers: Array<{
    id: string;
    question_id: string;
    answer_text: string;
    score: number;
    feedback: string;
    question: {
      question_text: string;
      question_type: string;
      points: number;
      correct_answer: string;
      options: any;
    };
  }>;
}

interface GradingInterfaceProps {
  facultyId: string;
}

export const GradingInterface = ({ facultyId }: GradingInterfaceProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      // First get assessments by faculty
      const { data: assessments, error: assessmentsError } = await supabase
        .from('assessments')
        .select('id')
        .eq('faculty_id', facultyId);

      if (assessmentsError) throw assessmentsError;
      
      const assessmentIds = assessments?.map(a => a.id) || [];
      
      if (assessmentIds.length === 0) {
        setSubmissions([]);
        return;
      }

      // Then get submissions for those assessments
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select(`
          *,
          assessment:assessments(title, total_points),
          answers:question_answers(
            *,
            question:questions(*)
          )
        `)
        .in('assessment_id', assessmentIds)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Get student profiles separately
      const studentIds = [...new Set(data?.map(s => s.student_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', studentIds);

      if (profilesError) throw profilesError;

      // Combine data
      const submissionsWithProfiles = data?.map(submission => ({
        ...submission,
        student_profile: profiles?.find(p => p.user_id === submission.student_id) || {
          full_name: 'Unknown Student',
          email: ''
        }
      })) || [];

      setSubmissions(submissionsWithProfiles);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnswerGrade = (answerId: string, score: number, feedback: string) => {
    if (!selectedSubmission) return;

    setSelectedSubmission({
      ...selectedSubmission,
      answers: selectedSubmission.answers.map(answer =>
        answer.id === answerId ? { ...answer, score, feedback } : answer
      )
    });
  };

  const saveGrades = async () => {
    if (!selectedSubmission) return;

    setIsSaving(true);
    try {
      // Update each answer
      for (const answer of selectedSubmission.answers) {
        const { error } = await supabase
          .from('question_answers')
          .update({
            score: answer.score,
            feedback: answer.feedback
          })
          .eq('id', answer.id);

        if (error) throw error;
      }

      // Calculate total score
      const totalScore = selectedSubmission.answers.reduce((sum, answer) => sum + answer.score, 0);

      // Update submission
      const { error: submissionError } = await supabase
        .from('assessment_submissions')
        .update({
          total_score: totalScore,
          is_graded: true,
          graded_by: facultyId,
          graded_at: new Date().toISOString()
        })
        .eq('id', selectedSubmission.id);

      if (submissionError) throw submissionError;

      // Send notification to student
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedSubmission.student_id,
          title: "Assessment Graded",
          message: `Your assessment "${selectedSubmission.assessment.title}" has been graded. Score: ${totalScore}/${selectedSubmission.assessment.total_points}`,
          type: 'grade',
          data: {
            assessment_id: selectedSubmission.assessment_id,
            score: totalScore,
            total_points: selectedSubmission.assessment.total_points
          }
        });

      toast({
        title: "Success",
        description: "Grades saved successfully",
      });

      fetchSubmissions();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error saving grades:', error);
      toast({
        title: "Error",
        description: "Failed to save grades",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [facultyId]);

  const ungradedSubmissions = submissions.filter(s => !s.is_graded);
  const gradedSubmissions = submissions.filter(s => s.is_graded);

  if (selectedSubmission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Grading: {selectedSubmission.assessment.title}</h2>
            <p className="text-muted-foreground">
              Student: {selectedSubmission.student_profile.full_name} • 
              Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
              Back to List
            </Button>
            <Button onClick={saveGrades} disabled={isSaving} className="bg-gradient-primary border-0">
              {isSaving ? 'Saving...' : 'Save Grades'}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-6">
            {selectedSubmission.answers.map((answer, index) => (
              <Card key={answer.id} className="shadow-academic">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        Question {index + 1} • {answer.question.points} points
                      </Badge>
                      <p className="font-medium">{answer.question.question_text}</p>
                       {answer.question.question_type === 'mcq' && answer.question.options && (
                         <div className="mt-2 space-y-1">
                           {JSON.parse(String(answer.question.options) || '[]').map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className={`text-sm p-2 rounded ${
                              option === answer.question.correct_answer 
                                ? 'bg-green-50 border border-green-200' 
                                : option === answer.answer_text
                                ? 'bg-red-50 border border-red-200'
                                : 'bg-muted'
                            }`}>
                              {String.fromCharCode(65 + optionIndex)}: {option}
                              {option === answer.question.correct_answer && (
                                <Badge variant="secondary" className="ml-2">Correct</Badge>
                              )}
                              {option === answer.answer_text && option !== answer.question.correct_answer && (
                                <Badge variant="destructive" className="ml-2">Student's Answer</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Student's Answer:</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="text-sm">{answer.answer_text || 'No answer provided'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`score-${answer.id}`}>Score (out of {answer.question.points})</Label>
                      <Input
                        id={`score-${answer.id}`}
                        type="number"
                        min="0"
                        max={answer.question.points}
                        step="0.5"
                        value={answer.score}
                        onChange={(e) => updateAnswerGrade(answer.id, parseFloat(e.target.value) || 0, answer.feedback)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`feedback-${answer.id}`}>Feedback</Label>
                      <Textarea
                        id={`feedback-${answer.id}`}
                        value={answer.feedback}
                        onChange={(e) => updateAnswerGrade(answer.id, answer.score, e.target.value)}
                        placeholder="Provide feedback for the student..."
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <Card className="bg-gradient-secondary border-0 shadow-academic">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary-foreground" />
                <span className="font-medium text-secondary-foreground">Total Score:</span>
              </div>
              <div className="text-lg font-bold text-secondary-foreground">
                {selectedSubmission.answers.reduce((sum, answer) => sum + answer.score, 0)} / {selectedSubmission.assessment.total_points}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Grade Submissions</h2>
        <p className="text-muted-foreground">Review and grade student assessment submissions</p>
      </div>

      <Tabs defaultValue="ungraded" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ungraded" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({ungradedSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="graded" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Graded ({gradedSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ungraded" className="space-y-4">
          {ungradedSubmissions.length === 0 ? (
            <Card className="shadow-academic">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No pending submissions</h3>
                <p className="text-muted-foreground">All submissions have been graded</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ungradedSubmissions.map((submission) => (
                <Card key={submission.id} className="shadow-academic hover:shadow-glow transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{submission.assessment.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{submission.student_profile.full_name}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{submission.answers.length} questions</span>
                      </div>
                      <span className="text-sm font-medium">/{submission.assessment.total_points} pts</span>
                    </div>
                    <Button
                      onClick={() => setSelectedSubmission(submission)}
                      className="w-full bg-gradient-primary border-0 hover:shadow-glow"
                    >
                      Grade Submission
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedSubmissions.length === 0 ? (
            <Card className="shadow-academic">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No graded submissions yet</h3>
                <p className="text-muted-foreground">Start grading pending submissions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradedSubmissions.map((submission) => (
                <Card key={submission.id} className="shadow-academic">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{submission.assessment.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{submission.student_profile.full_name}</span>
                        </div>
                      </div>
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Graded
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Graded: {submission.graded_at && new Date(submission.graded_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Score:</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {submission.total_score}/{submission.assessment.total_points}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};