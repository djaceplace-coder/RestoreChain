const fs = require('fs');

// Fix AdminLayout.tsx
let layout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

const oldFetchLayout = `    const fetchSupportCount = async () => {
      const { data } = await supabase.from('support_messages').select('user_id');
      if (data) {
        const unique = new Set(data.map(d => d.user_id));
        setSupportQueueCount(unique.size);
      }
    };
    fetchSupportCount();
    
    const channel = supabase.channel('layout_support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, fetchSupportCount)
      .subscribe();`;

const newFetchLayout = `    const fetchSupportCount = async () => {
      const { count } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
      setSupportQueueCount(count || 0);
    };
    fetchSupportCount();
    
    const channel = supabase.channel('layout_support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchSupportCount)
      .subscribe();`;

layout = layout.replace(oldFetchLayout, newFetchLayout);
fs.writeFileSync('src/layouts/AdminLayout.tsx', layout);

// Fix AdminOverview.tsx
let overview = fs.readFileSync('src/pages/admin/AdminOverview.tsx', 'utf8');

overview = overview.replace(`const { data: support } = await supabase.from('support_messages').select('user_id');`, `const { count: supportCount } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');`);
overview = overview.replace(`const uniqueTickets = new Set(support?.map(s => s.user_id) || []).size;`, `const uniqueTickets = supportCount || 0;`);

fs.writeFileSync('src/pages/admin/AdminOverview.tsx', overview);

// Fix AdminSupport.tsx
let support = fs.readFileSync('src/pages/admin/AdminSupport.tsx', 'utf8');

// Change select to include status
support = support.replace(`select('id, user_id, subject, created_at, profiles(email)')`, `select('id, user_id, subject, created_at, status, profiles(email)')`);

// Also change thread mapping to include status
const oldThreadMap = `      setThreads(tickets.map(t => ({
        ticket_id: t.id,
        user_id: t.user_id,
        email: (t.profiles as any)?.email || 'Unknown',
        subject: t.subject,
        latest_time: t.created_at
      })));`;

const newThreadMap = `      setThreads(tickets.map(t => ({
        ticket_id: t.id,
        user_id: t.user_id,
        email: (t.profiles as any)?.email || 'Unknown',
        subject: t.subject,
        status: t.status,
        latest_time: t.created_at
      })));`;

support = support.replace(oldThreadMap, newThreadMap);

// Add mark as read / in_progress when clicked
const oldOnClick = `onClick={() => setActiveUser(t)}`;
const newOnClick = `onClick={async () => {
                  setActiveUser(t);
                  if (t.status === 'open') {
                    await supabase.from('support_tickets').update({ status: 'in_progress' }).eq('id', t.ticket_id);
                    fetchThreads(); // Refresh list
                  }
                }}`;

support = support.replace(oldOnClick, newOnClick);

// Add a Resolve button to the header
const oldHeader = `<p className="font-bold text-brand-dark">{activeUser.email}</p>`;
const newHeader = `<p className="font-bold text-brand-dark">{activeUser.email}</p>
                <button 
                  onClick={async () => {
                    await supabase.from('support_tickets').update({ status: 'resolved' }).eq('id', activeUser.ticket_id);
                    setActiveUser(null);
                    fetchThreads();
                  }}
                  className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Resolve Ticket
                </button>`;
support = support.replace(oldHeader, newHeader);

// display status in the list
const oldItemHeader = `<span className="font-bold text-sm text-brand-dark truncate">{t.email}</span>`;
const newItemHeader = `<span className="font-bold text-sm text-brand-dark truncate">{t.email}</span>
                  {t.status === 'open' && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>}`;
support = support.replace(oldItemHeader, newItemHeader);

fs.writeFileSync('src/pages/admin/AdminSupport.tsx', support);

console.log('Fixed admin support layouts');
