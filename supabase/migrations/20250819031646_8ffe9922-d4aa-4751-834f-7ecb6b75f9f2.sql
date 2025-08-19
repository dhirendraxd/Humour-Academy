-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('student', 'faculty', 'bod', 'superadmin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  level INTEGER DEFAULT 1,
  rank TEXT,
  approved_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view approved profiles" 
ON public.profiles 
FOR SELECT 
USING (approved_status = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'superadmin' 
    AND p.approved_status = TRUE
  )
);

-- Create access requests table
CREATE TABLE public.access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  requested_role app_role NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES public.profiles(user_id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for access requests
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for access requests
CREATE POLICY "Anyone can create access requests" 
ON public.access_requests 
FOR INSERT 
WITH CHECK (TRUE);

CREATE POLICY "Superadmins can view all access requests" 
ON public.access_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'superadmin' 
    AND p.approved_status = TRUE
  )
);

CREATE POLICY "Superadmins can update access requests" 
ON public.access_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'superadmin' 
    AND p.approved_status = TRUE
  )
);

-- Insert super admin user (you'll need to sign up with this email first)
-- This will be the only superadmin with special access
-- Email: admin@ramayinstitute.com Password: SuperAdmin2024!

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();