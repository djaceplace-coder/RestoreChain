require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: { user } } = await supabase.auth.signUp({email: 'test_table_check@example.com', password: 'password123'});
  const { data: p } = await supabase.from('portfolios').select('*').limit(1);
  const { data: a } = await supabase.from('assets').select('*').limit(1);
  console.log("Portfolios:", p);
  console.log("Assets:", a);
}
test();
