CREATE OR REPLACE FUNCTION admin_approve_defi(pos_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.defi_positions SET status = 'active' WHERE id = pos_id;
END;
$$;
