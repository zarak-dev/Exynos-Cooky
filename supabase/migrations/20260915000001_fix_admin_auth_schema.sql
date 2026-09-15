-- ============================================================
-- FIX: REPAIR MANUAL ADMIN USER RECORD IN auth.users
-- ============================================================
-- Prevents Supabase GoTrue Go scanner crash:
-- "converting NULL to string is unsupported" / "Database error querying schema"
-- when scanning auth.users for manual test records.
-- ============================================================

UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  phone = COALESCE(phone, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  is_sso_user = COALESCE(is_sso_user, false),
  is_anonymous = COALESCE(is_anonymous, false),
  is_super_admin = COALESCE(is_super_admin, false),
  email_change_confirm_status = COALESCE(email_change_confirm_status, 0)
WHERE email = 'admin@ec.com' OR id = '00000000-0000-0000-0000-000000000001';

-- Ensure public profile exists with role 'admin'
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@ec.com',
  'System Administrator',
  'admin',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = 'admin@ec.com',
  role = 'admin',
  full_name = 'System Administrator';
