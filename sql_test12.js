import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const query = `
CREATE OR REPLACE FUNCTION public.get_table_columns(p_table TEXT) RETURNS JSON AS $$
DECLARE
  res JSON;
BEGIN
  SELECT json_agg(column_name) INTO res
  FROM information_schema.columns
  WHERE table_name = p_table;
  RETURN res;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

async function run() {
  // Wait, I can't create a function from the client using anon key. 
  // How did I deploy RPCs before? Oh, the user ran them in the Supabase SQL editor!
}
run();
