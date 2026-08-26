require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'adereraadenike@gmail.com',
    password: 'password123'
  });
  if (authErr) {
    console.log("Auth error:", authErr.message);
    return;
  }
  const { data, error } = await supabase.from('support_tickets').select('*');
  console.log("Tickets:", data?.length, "Error:", error);
  const { count } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
  console.log("Count open:", count);

  const { data: t2, error: err2 } = await supabase.from('support_tickets').select('id, user_id, subject, created_at, status, profiles(email)').neq('status', 'deleted');
  console.log("Err2:", err2);
}
test();
