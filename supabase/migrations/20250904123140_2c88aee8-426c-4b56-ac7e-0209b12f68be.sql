-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  faculty_id UUID NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN DEFAULT false
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'written')),
  question_text TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  options JSONB, -- For MCQ options
  correct_answer TEXT, -- For MCQ correct answer
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment submissions table
CREATE TABLE public.assessment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_score REAL DEFAULT 0,
  is_graded BOOLEAN DEFAULT false,
  graded_by UUID,
  graded_at TIMESTAMP WITH TIME ZONE
);

-- Create question answers table
CREATE TABLE public.question_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  score REAL DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('assessment', 'submission', 'grade', 'general')),
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  faculty_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assessments
CREATE POLICY "Faculty can manage their assessments" ON public.assessments
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role = 'faculty'
  ) AND (faculty_id = auth.uid() OR auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role = 'bod'
  ))
);

CREATE POLICY "Students can view published assessments" ON public.assessments
FOR SELECT USING (is_published = true);

-- Create RLS policies for questions
CREATE POLICY "Faculty can manage questions for their assessments" ON public.questions
FOR ALL USING (
  assessment_id IN (
    SELECT id FROM public.assessments WHERE faculty_id = auth.uid()
    OR auth.uid() IN (SELECT user_id FROM public.profiles WHERE role = 'bod')
  )
);

CREATE POLICY "Students can view questions for published assessments" ON public.questions
FOR SELECT USING (
  assessment_id IN (
    SELECT id FROM public.assessments WHERE is_published = true
  )
);

-- Create RLS policies for submissions
CREATE POLICY "Students can manage their own submissions" ON public.assessment_submissions
FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Faculty can view submissions for their assessments" ON public.assessment_submissions
FOR SELECT USING (
  assessment_id IN (
    SELECT id FROM public.assessments WHERE faculty_id = auth.uid()
    OR auth.uid() IN (SELECT user_id FROM public.profiles WHERE role = 'bod')
  )
);

CREATE POLICY "Faculty can update submissions for grading" ON public.assessment_submissions
FOR UPDATE USING (
  assessment_id IN (
    SELECT id FROM public.assessments WHERE faculty_id = auth.uid()
    OR auth.uid() IN (SELECT user_id FROM public.profiles WHERE role = 'bod')
  )
);

-- Create RLS policies for question answers
CREATE POLICY "Students can manage their own answers" ON public.question_answers
FOR ALL USING (
  submission_id IN (
    SELECT id FROM public.assessment_submissions WHERE student_id = auth.uid()
  )
);

CREATE POLICY "Faculty can view and grade answers" ON public.question_answers
FOR ALL USING (
  submission_id IN (
    SELECT s.id FROM public.assessment_submissions s
    JOIN public.assessments a ON s.assessment_id = a.id
    WHERE a.faculty_id = auth.uid() 
    OR auth.uid() IN (SELECT user_id FROM public.profiles WHERE role = 'bod')
  )
);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Create RLS policies for materials
CREATE POLICY "Faculty can manage their materials" ON public.materials
FOR ALL USING (
  faculty_id = auth.uid() OR auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role = 'bod'
  )
);

CREATE POLICY "Students can view materials" ON public.materials
FOR SELECT USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notifications;

-- Enable realtime for submissions
ALTER TABLE public.assessment_submissions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.assessment_submissions;