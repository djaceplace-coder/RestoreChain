require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: p, error: pErr } = await supabase.from('portfolios').select('*').limit(1);
  const { data: a, error: aErr } = await supabase.from('assets').select('*').limit(1);
  console.log("Portfolios Error:", pErr);
  console.log("Assets Error:", aErr);
  console.log("Portfolios Data:", p);
  console.log("Assets Data:", a);
}
test();
