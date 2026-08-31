import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function check() {
  const { data, error } = await supabase.rpc('exec_sql', { query: `
    SELECT event_object_table, trigger_name 
    FROM information_schema.triggers
    WHERE event_object_table IN ('profiles', 'portfolios');
  ` });
  console.log(error ? error.message : data);
}
check();
