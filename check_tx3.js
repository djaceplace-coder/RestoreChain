import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('transactions').insert({
    user_id: '15858cf8-5182-411a-85d7-be08c77f0fb5',
    type: 'Deposit',
    amount: 10,
    value_usd: 10,
    asset: 'USD',
    status: 'Completed',
    tx_date: new Date().toISOString()
  });
  console.log("Insert tx error:", error?.message);
}
test();
