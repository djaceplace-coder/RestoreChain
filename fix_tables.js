import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('admin_update_balance', {
    p_admin_id: '00000000-0000-0000-0000-000000000000',
    p_user_id: '00000000-0000-0000-0000-000000000000',
    p_action: 'clear',
    p_usd_amount: 0,
    p_asset: 'USD',
    p_crypto_qty: 0,
    p_reason: 'test clear'
  });
  console.log("RPC Test:", error ? error.message : data);
}
check();
