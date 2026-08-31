import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.rpc('admin_update_balance', {
    p_admin_id: '00000000-0000-0000-0000-000000000000',
    p_user_id: '00000000-0000-0000-0000-000000000000',
    p_action: 'credit',
    p_usd_amount: 10,
    p_asset: 'USD',
    p_crypto_qty: 0,
    p_reason: 'test'
  });
  console.log("RPC Test:", error ? error.message : data);
}
test();
