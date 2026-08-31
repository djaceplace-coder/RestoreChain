import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.rpc('exec_sql', { query: `
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `});
  console.log(error ? error.message : data);
}
test();
