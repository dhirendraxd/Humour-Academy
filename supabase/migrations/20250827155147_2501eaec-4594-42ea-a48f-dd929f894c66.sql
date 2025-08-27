-- Check if there's already a profile for the existing user and create one if missing
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- First, let's add an INSERT policy for profiles table since it's missing
    CREATE POLICY "Enable insert for authenticated users during signup" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

    -- Then insert missing profiles for existing users
    FOR user_record IN 
        SELECT id, email, raw_user_meta_data
        FROM auth.users 
        WHERE id NOT IN (SELECT user_id FROM public.profiles)
    LOOP
        INSERT INTO public.profiles (user_id, full_name, email, role)
        VALUES (
            user_record.id,
            COALESCE(user_record.raw_user_meta_data->>'full_name', 'User'),
            user_record.email,
            COALESCE((user_record.raw_user_meta_data->>'role')::app_role, 'student'::app_role)
        );
    END LOOP;
END $$;