-- Create a default super admin account
-- First, we'll insert into auth.users (this would normally be done through the Supabase auth system)
-- Since we can't directly insert into auth.users, we'll create a profile that can be linked later

-- Insert a default super admin profile
INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  role,
  approved_status,
  level,
  rank
) VALUES (
  gen_random_uuid(),
  'Super Administrator',
  'admin@ramayinstitute.com',
  'superadmin',
  true,
  100,
  'Supreme Leader'
) 
ON CONFLICT (user_id) DO NOTHING;

-- Also create an access request record for tracking
INSERT INTO public.access_requests (
  full_name,
  email,
  requested_role,
  reason,
  status,
  reviewed_at,
  reviewed_by
) VALUES (
  'Super Administrator',
  'admin@ramayinstitute.com',
  'superadmin',
  'Default system administrator account',
  'approved',
  now(),
  (SELECT id FROM public.profiles WHERE role = 'superadmin' LIMIT 1)
)
ON CONFLICT DO NOTHING;