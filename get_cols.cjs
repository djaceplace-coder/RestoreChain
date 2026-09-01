require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.rpc('get_columns_for_table', { table_name: 'portfolios' });
  if (error) console.log("Can't use rpc, checking with select");
  const { data: d2 } = await supabase.from('portfolios').select('*').limit(0);
  console.log(d2);
}
test();
