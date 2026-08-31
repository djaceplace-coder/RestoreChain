import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const t1 = await supabase.from('portfolios').select('updated_at').limit(1);
  console.log("Portfolios updated_at error:", t1.error?.message || "exists");
  const t2 = await supabase.from('transactions').select('updated_at').limit(1);
  console.log("Transactions updated_at error:", t2.error?.message || "exists");
  const t3 = await supabase.from('profiles').select('updated_at').limit(1);
  console.log("Profiles updated_at error:", t3.error?.message || "exists");
}
test();
