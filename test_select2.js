import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const t3 = await supabase.from('profiles').select('updated_at').limit(1);
  console.log("Profiles updated_at error:", t3.error?.message || "exists");
}
test();
