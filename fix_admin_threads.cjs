const fs = require('fs');

let adminSupport = fs.readFileSync('src/pages/admin/AdminSupport.tsx', 'utf8');

// Replace fetchThreads to fetch latest message time
const oldFetchThreads = `  const fetchThreads = async () => {
    const { data: tickets } = await supabase.from('support_tickets').select('id, user_id, subject, created_at, status, profiles(email)').neq('status', 'deleted').order('created_at', { ascending: false });
    if (tickets) {
      setThreads(tickets.map(t => ({
        ticket_id: t.id,
        user_id: t.user_id,
        email: (t.profiles as any)?.email || 'Unknown',
        subject: t.subject,
        status: t.status,
        latest_time: t.created_at
      })));
    }
    setLoading(false);
  };`;

const newFetchThreads = `  const fetchThreads = async () => {
    const { data: tickets } = await supabase.from('support_tickets').select('id, user_id, subject, created_at, status, profiles(email)').neq('status', 'deleted');
    if (tickets) {
      // Get the latest message for each ticket to sort them properly
      const { data: messages } = await supabase.from('support_messages').select('ticket_id, created_at').order('created_at', { ascending: false });
      
      const latestMsgMap = {};
      if (messages) {
         messages.forEach(m => {
            if (!latestMsgMap[m.ticket_id]) latestMsgMap[m.ticket_id] = m.created_at;
         });
      }

      let formattedThreads = tickets.map(t => ({
        ticket_id: t.id,
        user_id: t.user_id,
        email: (t.profiles as any)?.email || 'Unknown',
        subject: t.subject,
        status: t.status,
        latest_time: latestMsgMap[t.id] || t.created_at
      }));
      
      // Sort by latest message time
      formattedThreads.sort((a, b) => new Date(b.latest_time).getTime() - new Date(a.latest_time).getTime());
      
      setThreads(formattedThreads);
    }
    setLoading(false);
  };`;

adminSupport = adminSupport.replace(oldFetchThreads, newFetchThreads);

// Add global message subscription
const oldSubscribe = `    const channel = supabase.channel('admin_support_threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchThreads)
      .subscribe();`;

const newSubscribe = `    const channel = supabase.channel('admin_support_threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchThreads)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, fetchThreads)
      .subscribe();`;

adminSupport = adminSupport.replace(oldSubscribe, newSubscribe);

fs.writeFileSync('src/pages/admin/AdminSupport.tsx', adminSupport);
console.log('Fixed thread sorting and live updates.');
