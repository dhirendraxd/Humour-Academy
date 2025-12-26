import { useState, useEffect } from "react";
import { CheckCircle, Clock, FileText, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Submission {
  id: string;
  assessment_id: string;
  student_id: string;
  submitted_at: string;
  total_score: number | null;
  graded: boolean;
  graded_at: string | null;
  feedback: string | null;
  student_profile: {
    full_name: string;
    email: string;
  };
  answers: {
    id: string;
    question_id: string;
    answer_text: string;
    score: number | null;
  }[];
  assessment: {
    title: string;
  };
}

interface GradingInterfaceProps {
  facultyId: string;
}

export const GradingInterface = ({ facultyId }: GradingInterfaceProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    if (!selectedAssessment) return;

    setIsLoading(true);
    try {
      // Mock fetching submissions
      console.log("Fetching submissions mock");
      setSubmissions([]);
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

  const updateAnswerGrade = (answerId: string, score: number) => {
    if (!selectedSubmission) return;

    setSelectedSubmission({
      ...selectedSubmission,
      answers: selectedSubmission.answers.map(answer =>
        answer.id === answerId ? { ...answer, score } : answer
      )
    });
  };

  const saveGrades = async () => {
    if (!selectedSubmission) return;

    try {
      // Mock saving grades
      console.log("Saving grades mock");

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
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedAssessment]);

  const ungradedSubmissions = submissions.filter(s => !s.graded);
  const gradedSubmissions = submissions.filter(s => s.graded);

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
              {ungradedSubmissions.map((sub) => (
                <Card key={sub.id} className="shadow-academic">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{sub.assessment.title}</CardTitle>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{sub.student_profile.full_name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="graded">
          {gradedSubmissions.length === 0 ? (
            <Card className="shadow-academic">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No graded submissions yet</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradedSubmissions.map((sub) => (
                <Card key={sub.id} className="shadow-academic">
                  <CardHeader>
                    <CardTitle className="text-lg">{sub.assessment.title}</CardTitle>
                    <Badge variant="default">Graded</Badge>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};