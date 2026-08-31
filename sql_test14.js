import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('portfolios').select('asset').limit(1);
  console.log("asset:", error || data);
  const { data: d2, error: e2 } = await supabase.from('portfolios').select('asset_symbol').limit(1);
  console.log("asset_symbol:", e2 || d2);
  const { data: d3, error: e3 } = await supabase.from('portfolios').select('symbol').limit(1);
  console.log("symbol:", e3 || d3);
  const { data: d4, error: e4 } = await supabase.from('portfolios').select('coin').limit(1);
  console.log("coin:", e4 || d4);
}
run();
