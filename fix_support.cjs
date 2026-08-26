const fs = require('fs');

let support = fs.readFileSync('src/pages/dashboard/Support.tsx', 'utf8');

// I'll replace the entire body of the second useEffect hook using string indexOf/slice to be precise
const startToken = `useEffect(() => {
    if (!user) return;`;
const endToken = `return () => { supabase.removeChannel(channel); };
  }, [user]);`;

if (support.includes(startToken) && support.includes(endToken)) {
  const start = support.indexOf(startToken);
  const end = support.indexOf(endToken) + endToken.length;
  
  const newEffect = `useEffect(() => {
    if (!user) return;
    
    const initSupport = async () => {
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

    // The subscription should re-fetch if ticket is there
    const channel = supabase.channel('support_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, async (payload) => {
         // A safe way is to fetch messages again
         if (payload.new && payload.new.ticket_id) {
           const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', payload.new.ticket_id).order('created_at', { ascending: true });
           if (data) setMessages(data);
         }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);`;
  
  support = support.substring(0, start) + newEffect + support.substring(end);
}

fs.writeFileSync('src/pages/dashboard/Support.tsx', support);
console.log("Fixed Support.tsx specifically!");
