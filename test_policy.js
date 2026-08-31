import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: auth } = await supabase.auth.signUp({ email: `test_${Date.now()}@test.com`, password: 'password123' });
  const { error } = await supabase.from('portfolios').select('*');
  console.log("Portfolios select error:", error?.message || "success");
}
test();
