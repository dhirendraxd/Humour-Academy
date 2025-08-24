-- Remove access_requests table completely
DROP TABLE IF EXISTS public.access_requests;

-- Drop all existing policies first
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view approved profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Remove approved_status column first
ALTER TABLE public.profiles DROP COLUMN IF EXISTS approved_status;

-- Update app_role enum to remove superadmin - use CASCADE to handle dependencies
DROP TYPE IF EXISTS app_role CASCADE;
CREATE TYPE app_role AS ENUM ('student', 'faculty', 'bod');

-- Re-add the role column with new enum type
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE app_role USING role::text::app_role,
ALTER COLUMN role SET DEFAULT 'student'::app_role;

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