import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const email = `test_${Date.now()}@test.com`;
  const { data: auth, error: signUpErr } = await supabase.auth.signUp({
    email,
    password: 'password123'
  });
  if (signUpErr) {
    console.log("Signup err", signUpErr);
    return;
  }
  
  const userId = auth.user.id;
  console.log("User ID:", userId);
  
  const { error: portErr } = await supabase.from('portfolios').insert({
    user_id: userId,
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: 1,
    value: 50000
  });
  console.log("Insert portfolio err:", portErr?.message);
  
  const { error: updPortErr } = await supabase.from('portfolios').update({ balance: 2 }).eq('user_id', userId);
  console.log("Update portfolio err:", updPortErr?.message);
  
  const { error: updProfErr } = await supabase.from('profiles').update({ total_balance: 10 }).eq('id', userId);
  console.log("Update profile err:", updProfErr?.message);
}
test();
