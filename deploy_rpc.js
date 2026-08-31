import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
// We can't deploy RPCs via normal client if no admin rights, but wait, the anon key can't run CREATE FUNCTION.
