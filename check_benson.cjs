require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: p } = await supabase.from('portfolios').select('*');
  const { data: a } = await supabase.from('assets').select('*');
  const { data: prof } = await supabase.from('profiles').select('*');
  console.log("Portfolios length:", p ? p.length : 'null');
  console.log("Assets length:", a ? a.length : 'null');
  console.log("Profiles:", prof ? prof.map(u => ({ email: u.email, total: u.total_balance })) : 'null');
  if (p && p.length > 0) console.log("First portfolio:", p[0]);
}
test();
