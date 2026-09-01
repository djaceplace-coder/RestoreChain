CREATE OR REPLACE FUNCTION public.get_cols(p_table TEXT) RETURNS JSONB AS $$
DECLARE
  res JSONB;
BEGIN
  SELECT jsonb_agg(column_name) INTO res FROM information_schema.columns WHERE table_name = p_table AND table_schema = 'public';
  RETURN res;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
