-- Create an RPC to safely approve or reject KYC documents and update profile status
CREATE OR REPLACE FUNCTION admin_update_kyc_status(target_user_id UUID, doc_id UUID, source_table TEXT, new_status TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure caller is an admin or super_admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Not authorized to manage KYC documents';
  END IF;

  -- Update the specific document
  IF source_table = 'user_documents' THEN
    UPDATE user_documents SET status = new_status WHERE id = doc_id;
  ELSIF source_table = 'kyc_documents' THEN
    UPDATE kyc_documents SET status = new_status WHERE id = doc_id;
  ELSE
    RAISE EXCEPTION 'Invalid source table';
  END IF;

  -- Update the overall user profile KYC status if it was approved
  IF new_status = 'approved' THEN
    UPDATE profiles SET kyc_status = 'approved' WHERE id = target_user_id;
  ELSIF new_status = 'rejected' THEN
    UPDATE profiles SET kyc_status = 'rejected' WHERE id = target_user_id;
  END IF;
END;
$$;
