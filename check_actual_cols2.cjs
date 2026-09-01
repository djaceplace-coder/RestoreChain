require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: { user } } = await supabase.auth.signUp({email: 'test_cols3@example.com', password: 'password123'});
  const { data: p, error } = await supabase.from('portfolios').insert({user_id: user.id}).select('*');
  console.log("Portfolios with insert error:", error);
}
test();
