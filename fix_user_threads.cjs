const fs = require('fs');

let support = fs.readFileSync('src/pages/dashboard/Support.tsx', 'utf8');

const oldLoad = `  const loadTickets = async (userId: string) => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });
    
    if (data) {
      setTickets(data);
      if (data.length > 0 && !ticket) {
        setTicket(data[0]);
      } else if (data.length === 0) {
        setTicket(null);
      }
    }
    setLoading(false);
  };`;

const newLoad = `  const loadTickets = async (userId: string) => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'deleted');
    
    if (data) {
      // Get the latest message for each ticket to sort them properly
      const { data: messages } = await supabase.from('support_messages').select('ticket_id, created_at').order('created_at', { ascending: false });
      
      const latestMsgMap = {};
      if (messages) {
         messages.forEach(m => {
            if (!latestMsgMap[m.ticket_id]) latestMsgMap[m.ticket_id] = m.created_at;
         });
      }

      let formattedTickets = data.map(t => ({
        ...t,
        latest_time: latestMsgMap[t.id] || t.created_at
      }));
      
      // Sort by latest message time
      formattedTickets.sort((a, b) => new Date(b.latest_time).getTime() - new Date(a.latest_time).getTime());

      setTickets(formattedTickets);
      if (formattedTickets.length > 0 && !ticket) {
        setTicket(formattedTickets[0]);
      } else if (formattedTickets.length === 0) {
        setTicket(null);
      }
    }
    setLoading(false);
  };`;

support = support.replace(oldLoad, newLoad);

const oldSub = `    const channel = supabase.channel('support_tickets_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
         loadTickets(user.id);
      })
      .subscribe();`;

const newSub = `    const channel = supabase.channel('support_tickets_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
         loadTickets(user.id);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, () => {
         loadTickets(user.id);
      })
      .subscribe();`;

support = support.replace(oldSub, newSub);

fs.writeFileSync('src/pages/dashboard/Support.tsx', support);
console.log('Fixed User Support threads');
