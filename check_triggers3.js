import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: port } = await supabase.from('portfolios').select('id').limit(1);
  if (port && port.length > 0) {
    const { data, error } = await supabase.from('portfolios').update({ balance: 0 }).eq('id', port[0].id);
    console.log("Update actual portfolio error:", error?.message);
  } else {
    console.log("No portfolios found");
  }
}
test();
