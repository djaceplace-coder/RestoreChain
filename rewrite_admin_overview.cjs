const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminOverview.tsx', 'utf8');

code = code.replace(
  'const [stats, setStats] = useState({ users: 0, balance: 0, transactions: 0 });',
  'const [stats, setStats] = useState({ users: 0, balance: 0, transactions: 0, recon: 0, subs: 0, tickets: 0 });'
);

code = code.replace(
  "const { count: txs } = await supabase.from('transactions').select('*', { count: 'exact', head: true });",
  `const { count: txs } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
      const { count: recon } = await supabase.from('reconciliation_issues').select('*', { count: 'exact', head: true }).eq('status', 'open');
      const { count: subs } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('tier', 'free');
      const { data: support } = await supabase.from('support_messages').select('user_id');
      const uniqueTickets = new Set(support?.map(s => s.user_id) || []).size;`
);

code = code.replace(
  "setStats({ users: users || 0, balance, transactions: txs || 0 });",
  "setStats({ users: users || 0, balance, transactions: txs || 0, recon: recon || 0, subs: subs || 0, tickets: uniqueTickets });"
);

code = code.replace(
  "const staticStats = [",
  `const dynamicStats = [
    { label: 'Total Users', value: stats.users.toLocaleString(), change: 'Registered', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pending Recon', value: stats.recon.toLocaleString(), change: 'Require review', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Active Subs', value: stats.subs.toLocaleString(), change: 'Pro & Enterprise', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Open Tickets', value: stats.tickets.toLocaleString(), change: 'Active threads', icon: Clock, color: 'text-red-500', bg: 'bg-red-100' },
  ];
  // ignore old staticStats`
);

code = code.replace(
  "staticStats.map",
  "dynamicStats.map"
);

// We can replace the static Activity log with a fetch to notifications, but maybe just leave it or pull latest transactions.
// Let's pull recent transactions for activity log to make it real.
code = code.replace(
  'const loadStats = async () => {',
  `const [recentTx, setRecentTx] = useState<any[]>([]);\n  const loadStats = async () => {`
);

code = code.replace(
  'loadStats();',
  `loadStats();
    const fetchTx = async () => {
      const { data } = await supabase.from('transactions').select('*, profiles(email)').order('created_at', { ascending: false }).limit(5);
      if (data) setRecentTx(data);
    };
    fetchTx();`
);

code = code.replace(
  "{[\n              { admin: 'Sarah J.', action: 'resolved recon item RC-1049 for', target: 'Jane Doe', time: '10 mins ago' },\n              { admin: 'System', action: 'suspended account', target: 'Sam Taylor', time: '1 hour ago' },\n              { admin: 'Mike R.', action: 'updated tax elections for', target: 'Alex Smith', time: '3 hours ago' },\n            ].map((log, i) => (",
  `{recentTx.length === 0 ? <p className="text-sm text-gray-500">No recent activity.</p> : recentTx.map((log, i) => (`
);

code = code.replace(
  '<span className="font-bold">{log.admin}</span> {log.action} <span className="font-bold">{log.target}</span>',
  '<span className="font-bold">System</span> processed {log.type} of {log.amount} {log.asset} for <span className="font-bold">{log.profiles?.email || \'User\'}</span>'
);

code = code.replace(
  '<p className="text-xs text-gray-400 mt-1">{log.time}</p>',
  '<p className="text-xs text-gray-400 mt-1">{new Date(log.created_at).toLocaleString()}</p>'
);

fs.writeFileSync('src/pages/admin/AdminOverview.tsx', code);
