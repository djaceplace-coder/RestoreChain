import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const t3 = await supabase.from('profiles').select('non_existent_col').limit(1);
  console.log("Error:", t3.error?.message);
}
test();
