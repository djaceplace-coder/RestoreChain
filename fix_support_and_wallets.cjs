const fs = require('fs');

// 1. Fix Support.tsx
let support = fs.readFileSync('src/pages/dashboard/Support.tsx', 'utf8');

// Replace state and fetch logic
support = support.replace(`const [user, setUser] = useState<any>(null);`, `const [user, setUser] = useState<any>(null);\n  const [ticket, setTicket] = useState<any>(null);`);

// the fetch messages logic
const fetchLogic = `    const fetchMsgs = async () => {
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoading(false);
    };
    fetchMsgs();

    const channel = supabase.channel('support_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages', filter: \`user_id=eq.\${user.id}\` }, fetchMsgs)
      .subscribe();

    return () => { supabase.removeChannel(channel); };`;

const newFetchLogic = `    const initSupport = async () => {
      // Find or create ticket
      let { data: tickets } = await supabase.from('support_tickets').select('*').eq('user_id', user.id).eq('status', 'open').order('created_at', { ascending: false }).limit(1);
      let activeTicket = tickets && tickets.length > 0 ? tickets[0] : null;
      
      if (!activeTicket) {
        const { data: newTicket } = await supabase.from('support_tickets').insert({ user_id: user.id, subject: 'General Support' }).select().single();
        activeTicket = newTicket;
      }
      
      if (activeTicket) {
        setTicket(activeTicket);
        const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', activeTicket.id).order('created_at', { ascending: true });
        if (data) setMessages(data);
      }
      setLoading(false);
    };
    initSupport();

    // The subscription should re-fetch if ticket is there, but since we setup channel after, we can just fetch messages directly
    const channel = supabase.channel('support_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, async (payload) => {
         if (payload.new && ticket && payload.new.ticket_id === ticket?.id) {
           // We re-fetch messages or just let a general refetch handle it
           // A safe way is to fetch messages again
           const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', ticket?.id || payload.new.ticket_id).order('created_at', { ascending: true });
           if (data) setMessages(data);
         }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };`;

support = support.replace(fetchLogic, newFetchLogic);

// Fix channel subscribe specifically if the regex match wasn't perfect
// Actually, let me just rewrite the entire useEffect logic to be safer

// Let's do string replacement for the send message logic
const sendLogic = `    await supabase.from('support_messages').insert({
      user_id: user.id,
      sender: 'user',
      message: text
    });`;

const newSendLogic = `    if (!ticket) return;
    await supabase.from('support_messages').insert({
      ticket_id: ticket.id,
      sender_id: user.id,
      message: text
    });`;

support = support.replace(sendLogic, newSendLogic);

// Fix the render logic for sender
support = support.replaceAll(`msg.sender === 'user'`, `msg.sender_id === user.id`);

fs.writeFileSync('src/pages/dashboard/Support.tsx', support);

// 2. Fix AdminSupport.tsx
let adminSupport = fs.readFileSync('src/pages/admin/AdminSupport.tsx', 'utf8');

adminSupport = adminSupport.replace(`const { data: msgs } = await supabase.from('support_messages').select('user_id, profiles(email), created_at').order('created_at', { ascending: false });`, `const { data: tickets } = await supabase.from('support_tickets').select('id, user_id, subject, created_at, profiles(email)').order('created_at', { ascending: false });`);

const adminThreadsLogic = `    if (msgs) {
      // Group by user_id
      const map = new Map();
      msgs.forEach(m => {
        if (!map.has(m.user_id)) {
          map.set(m.user_id, {
            user_id: m.user_id,
            email: (m.profiles as any)?.email || 'Unknown',
            latest_time: m.created_at
          });
        }
      });
      setThreads(Array.from(map.values()));
    }`;

const newAdminThreadsLogic = `    if (tickets) {
      setThreads(tickets.map(t => ({
        ticket_id: t.id,
        user_id: t.user_id,
        email: (t.profiles as any)?.email || 'Unknown',
        subject: t.subject,
        latest_time: t.created_at
      })));
    }`;

adminSupport = adminSupport.replace(adminThreadsLogic, newAdminThreadsLogic);
adminSupport = adminSupport.replace(`{ event: '*', schema: 'public', table: 'support_messages' }, fetchThreads)`, `{ event: '*', schema: 'public', table: 'support_tickets' }, fetchThreads)`);

const adminFetchMsgsLogic = `    const fetchMsgs = async () => {
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', activeUser.user_id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMsgs();

    const channel = supabase.channel('admin_active_thread')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages', filter: \`user_id=eq.\${activeUser.user_id}\` }, fetchMsgs)
      .subscribe();

    return () => { supabase.removeChannel(channel); };`;

const newAdminFetchMsgsLogic = `    const fetchMsgs = async () => {
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', activeUser.ticket_id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMsgs();

    const channel = supabase.channel('admin_active_thread')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages', filter: \`ticket_id=eq.\${activeUser.ticket_id}\` }, fetchMsgs)
      .subscribe();

    return () => { supabase.removeChannel(channel); };`;

adminSupport = adminSupport.replace(adminFetchMsgsLogic, newAdminFetchMsgsLogic);

const adminSendLogic = `    await supabase.from('support_messages').insert({
      user_id: activeUser.user_id,
      sender: 'agent',
      message: text
    });`;

const newAdminSendLogic = `    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('support_messages').insert({
      ticket_id: activeUser.ticket_id,
      sender_id: user?.id,
      message: text
    });`;

adminSupport = adminSupport.replace(adminSendLogic, newAdminSendLogic);

// Fix admin render sender
adminSupport = adminSupport.replaceAll(`msg.sender === 'agent'`, `msg.sender_id !== activeUser.user_id`);
adminSupport = adminSupport.replaceAll(`{msg.sender}`, `{msg.sender_id === activeUser.user_id ? 'User' : 'Agent'}`);
adminSupport = adminSupport.replaceAll(`key={t.user_id}`, `key={t.ticket_id}`);
adminSupport = adminSupport.replaceAll(`activeUser?.user_id === t.user_id`, `activeUser?.ticket_id === t.ticket_id`);

fs.writeFileSync('src/pages/admin/AdminSupport.tsx', adminSupport);

// 3. Fix AdminUserDetail.tsx (Wallets map)
let adminDetail = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

adminDetail = adminDetail.replaceAll('w.label', 'w.name');
adminDetail = adminDetail.replaceAll('w.address.substring', '(w.address_or_key||"").substring');
adminDetail = adminDetail.replaceAll('w.address.length', '(w.address_or_key||"").length');
adminDetail = adminDetail.replaceAll('w.network', 'w.type');

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', adminDetail);

console.log("Fixed Support and Wallets mapping!");
