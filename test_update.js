import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('portfolios').update({ balance: 0 }).eq('id', '15858cf8-5182-411a-85d7-be08c77f0fb5');
  console.log("Update portfolio:", error?.message);
}
test();
