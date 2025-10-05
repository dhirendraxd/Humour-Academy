-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('faculty', 'student', 'bod');

-- Create enum for assessment types
CREATE TYPE public.assessment_type AS ENUM ('quiz', 'assignment', 'exam', 'practice');

-- Create enum for question types
CREATE TYPE public.question_type AS ENUM ('mcq', 'written');

-- Create enum for notification types
CREATE TYPE public.notification_type AS ENUM ('assessment_created', 'submission_graded', 'new_material', 'general');

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  level TEXT,
  rank TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- USER ROLES TABLE (SECURITY CRITICAL)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =============================================
-- ASSESSMENTS TABLE
-- =============================================
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assessment_type public.assessment_type NOT NULL,
  faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_marks INTEGER NOT NULL DEFAULT 100,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage their assessments"
  ON public.assessments FOR ALL
  USING (auth.uid() = faculty_id);

CREATE POLICY "Students can view assessments"
  ON public.assessments FOR SELECT
  USING (public.has_role(auth.uid(), 'student'));

-- =============================================
-- QUESTIONS TABLE
-- =============================================
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_type public.question_type NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  marks INTEGER NOT NULL DEFAULT 1,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage questions for their assessments"
  ON public.questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.assessments
      WHERE assessments.id = questions.assessment_id
      AND assessments.faculty_id = auth.uid()
    )
  );

CREATE POLICY "Students can view questions"
  ON public.questions FOR SELECT
  USING (public.has_role(auth.uid(), 'student'));

-- =============================================
-- ASSESSMENT SUBMISSIONS TABLE
-- =============================================
CREATE TABLE public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_score INTEGER,
  graded BOOLEAN NOT NULL DEFAULT false,
  graded_at TIMESTAMPTZ,
  feedback TEXT,
  UNIQUE(assessment_id, student_id)
);

ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage their own submissions"
  ON public.assessment_submissions FOR ALL
  USING (auth.uid() = student_id);

CREATE POLICY "Faculty can view submissions for their assessments"
  ON public.assessment_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.assessments
      WHERE assessments.id = assessment_submissions.assessment_id
      AND assessments.faculty_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can update submissions for their assessments"
  ON public.assessment_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.assessments
      WHERE assessments.id = assessment_submissions.assessment_id
      AND assessments.faculty_id = auth.uid()
    )
  );

-- =============================================
-- QUESTION ANSWERS TABLE
-- =============================================
CREATE TABLE public.question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(submission_id, question_id)
);

ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can manage answers for their submissions"
  ON public.question_answers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_submissions
      WHERE assessment_submissions.id = question_answers.submission_id
      AND assessment_submissions.student_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can view and grade answers"
  ON public.question_answers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_submissions
      JOIN public.assessments ON assessments.id = assessment_submissions.assessment_id
      WHERE assessment_submissions.id = question_answers.submission_id
      AND assessments.faculty_id = auth.uid()
    )
  );

-- =============================================
-- MATERIALS TABLE
-- =============================================
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage their materials"
  ON public.materials FOR ALL
  USING (auth.uid() = faculty_id);

CREATE POLICY "Students can view materials"
  ON public.materials FOR SELECT
  USING (public.has_role(auth.uid(), 'student'));

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type public.notification_type NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.email
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notification trigger for new assessments
CREATE OR REPLACE FUNCTION public.notify_new_assessment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, notification_type)
  SELECT ur.user_id, 
         'New Assessment Created',
         'A new assessment "' || NEW.title || '" has been created',
         'assessment_created'
  FROM public.user_roles ur
  WHERE ur.role = 'student';
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_assessment_created
  AFTER INSERT ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_assessment();

-- Notification trigger for graded submissions
CREATE OR REPLACE FUNCTION public.notify_submission_graded()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.graded = true AND OLD.graded = false THEN
    INSERT INTO public.notifications (user_id, title, message, notification_type)
    VALUES (
      NEW.student_id,
      'Assessment Graded',
      'Your submission has been graded. Score: ' || COALESCE(NEW.total_score::TEXT, 'Pending'),
      'submission_graded'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_submission_graded
  AFTER UPDATE ON public.assessment_submissions
  FOR EACH ROW EXECUTE FUNCTION public.notify_submission_graded();

-- Notification trigger for new materials
CREATE OR REPLACE FUNCTION public.notify_new_material()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, notification_type)
  SELECT ur.user_id,
         'New Material Added',
         'New learning material "' || NEW.title || '" has been uploaded',
         'new_material'
  FROM public.user_roles ur
  WHERE ur.role = 'student';
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_material_created
  AFTER INSERT ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_material();

-- =============================================
-- ENABLE REALTIME
-- =============================================
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

ALTER TABLE public.assessment_submissions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assessment_submissions;