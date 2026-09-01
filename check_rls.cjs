require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: { user } } = await supabase.auth.signUp({email: 'test_rls@example.com', password: 'password123'});
  const { data: p, error } = await supabase.from('portfolios').insert({user_id: '11111111-1111-1111-1111-111111111111', name: 'Bitcoin', symbol: 'BTC', balance: 0.1}).select('*');
  console.log("Insert foreign portfolio error:", error);
}
test();
