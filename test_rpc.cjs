require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: { user } } = await supabase.auth.signUp({email: 'test_rpc_x@example.com', password: 'password123'});
  const { data, error } = await supabase.rpc('admin_provision_btc', {
    p_user_id: user.id,
    p_action: 'add',
    p_btc_amount: 1,
    p_usd_value: 50000,
    p_tx_date: new Date().toISOString(),
    p_narration: 'Test'
  });
  console.log("RPC Error:", error);
}
test();
