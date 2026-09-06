-- Create the pgcrypto extension if it doesn't already exist
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the secure function for admins to update other users' passwords
CREATE OR REPLACE FUNCTION admin_update_user_password(target_user_id UUID, new_password TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Ensure caller is a verified admin or super_admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to change user passwords';
  END IF;

  -- 2. Update the target user's encrypted_password in the auth schema
  UPDATE auth.users 
  SET encrypted_password = crypt(new_password, gen_salt('bf')) 
  WHERE id = target_user_id;
END;
$$;
