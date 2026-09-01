require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: { user } } = await supabase.auth.signUp({email: 'test_port_cols@example.com', password: 'password123'});
  const { data: p } = await supabase.from('portfolios').insert({user_id: user.id, name: 'Bitcoin', symbol: 'BTC', balance: 0.1}).select('*');
  console.log("Cols:", Object.keys(p[0]));
}
test();
