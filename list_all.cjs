require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: profs } = await supabase.from('profiles').select('id, email, total_balance');
  const { data: ports } = await supabase.from('portfolios').select('user_id, symbol, balance, value');
  console.log("Profiles:");
  console.log(profs);
  console.log("Portfolios:");
  console.log(ports);
}
test();
