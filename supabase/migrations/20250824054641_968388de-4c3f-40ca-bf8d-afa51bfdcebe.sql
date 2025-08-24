-- Remove access_requests table completely
DROP TABLE IF EXISTS public.access_requests;

-- Update app_role enum to remove superadmin
DROP TYPE IF EXISTS app_role;
CREATE TYPE app_role AS ENUM ('student', 'faculty', 'bod');

-- Remove approved_status from profiles and set role default
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS approved_status,
ALTER COLUMN role SET DEFAULT 'student'::app_role;

-- Update profiles RLS policies to remove approval requirements
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view approved profiles" ON public.profiles;

-- Create simplified policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'::app_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();