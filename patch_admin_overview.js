import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/AdminOverview.tsx', 'utf8');

code = code.replace(
  'const [stats, setStats] = useState({ users: 0, balance: 0, transactions: 0, recon: 0, subs: 0, tickets: 0 });',
  'const [stats, setStats] = useState({ users: 0, balance: 0, transactions: 0, recon: 0, subs: 0, tickets: 0, pending_kyc: 0, pending_nda: 0 });'
);

code = code.replace(
  'const { count: supportCount } = await supabase.from(\'support_tickets\').select(\'*\', { count: \'exact\', head: true }).eq(\'status\', \'open\');',
  `const { count: supportCount } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
      const { count: pendingKyc } = await supabase.from('kyc_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: pendingNda } = await supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending');`
);

code = code.replace(
  'setStats({ users: users || 0, balance, transactions: txs || 0, recon: recon || 0, subs: subs || 0, tickets: uniqueTickets });',
  'setStats({ users: users || 0, balance, transactions: txs || 0, recon: recon || 0, subs: subs || 0, tickets: uniqueTickets, pending_kyc: pendingKyc || 0, pending_nda: pendingNda || 0 });'
);

code = code.replace(
  `  const dynamicStats = [
    { label: 'Total Users', value: stats.users.toLocaleString(), change: 'Registered', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pending Recon', value: stats.recon.toLocaleString(), change: 'Require review', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Active Subs', value: stats.subs.toLocaleString(), change: 'Pro & Enterprise', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Open Tickets', value: stats.tickets.toLocaleString(), change: 'Active threads', icon: Clock, color: 'text-red-500', bg: 'bg-red-100' },
  ];`,
  `  const dynamicStats = [
    { label: 'Total Users', value: stats.users.toLocaleString(), change: 'Registered', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Pending KYC', value: stats.pending_kyc.toLocaleString(), change: 'Awaiting approval', icon: ShieldAlert, color: 'text-yellow-600', bg: 'bg-yellow-100', link: '/admin/kyc' },
    { label: 'Pending NDA', value: stats.pending_nda.toLocaleString(), change: 'Awaiting review', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100', link: '/admin/kyc' },
    { label: 'Pending Recon', value: stats.recon.toLocaleString(), change: 'Require review', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-100', link: '/admin/users' },
    { label: 'Open Tickets', value: stats.tickets.toLocaleString(), change: 'Active threads', icon: Clock, color: 'text-red-500', bg: 'bg-red-100', link: '/admin/support' },
  ];`
);

code = code.replace(
  'import { Users, ShieldAlert, CheckCircle, Clock, Search, ArrowRight } from \'lucide-react\';',
  'import { Users, ShieldAlert, CheckCircle, Clock, Search, ArrowRight, FileText } from \'lucide-react\';'
);

code = code.replace(
  /<div key=\{i\} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">/g,
  `<Link to={stat.link || '#'} key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand-purple transition-colors block">`
);

code = code.replace(
  '          </div>\n        ))}',
  '          </Link>\n        ))}'
);

fs.writeFileSync('src/pages/admin/AdminOverview.tsx', code);
