import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('portfolios').insert({
    user_id: '15858cf8-5182-411a-85d7-be08c77f0fb5',
    symbol: 'TEST',
    name: 'TEST',
    balance: 0,
    value: 0
  }).select();
  console.log("Insert:", error?.message);
  
  if (data) {
    const res = await supabase.from('portfolios').update({ balance: 1 }).eq('id', data[0].id);
    console.log("Update:", res.error?.message);
  }
}
test();
