-- Add account_status column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';

-- Optionally, you can create a secure RPC for this similar to freeze, but updating directly from the client is currently being used for `is_frozen`, so this will work out of the box if RLS permits.
-- If the client update for account_status fails due to RLS, you can create an RPC to bypass it:
CREATE OR REPLACE FUNCTION admin_update_account_status(target_user_id UUID, new_status TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE profiles SET account_status = new_status WHERE id = target_user_id;
END;
$$;
