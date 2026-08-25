const fs = require('fs');

const adminUsersPath = 'src/pages/admin/AdminUsers.tsx';
let adminUsersCode = `
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, ShieldAlert, UserPlus, Loader2 } from 'lucide-react';
import AdminCreateUserModal from './AdminCreateUserModal';
import { supabase } from '../../lib/supabase';

export default function AdminUsers() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();

    // Subscribe to real-time changes
    const channel = supabase.channel('profiles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const handleUserCreated = (newUser: any) => {
    setIsCreateModalOpen(false);
    // User is created via Supabase Admin API in the modal (or we just let the real-time sub pick it up)
    fetchUsers();
  };

  return (
    <div className="animate-fade-in">
      {isCreateModalOpen && (
        <AdminCreateUserModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onUserCreated={handleUserCreated} 
        />
      )}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Users</h1>
          <p className="text-gray-500">Manage all registered accounts.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchUsers} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
            Refresh
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
          >
            <UserPlus size={18} />
            Create Account
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={\`/admin/users/\${user.id}\`} className="block">
                      <p className="font-bold text-brand-dark group-hover:text-red-600 transition-colors">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={\`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase \${
                      user.plan === 'Free' ? 'bg-gray-100 text-gray-600' : 'bg-brand-purple/10 text-brand-purple'
                    }\`}>
                      {user.plan || 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-brand-dark">
                      ${Number(user.total_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase \${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }\`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(adminUsersPath, adminUsersCode);

const adminOverviewPath = 'src/pages/admin/AdminOverview.tsx';
let adminOverviewCode = fs.readFileSync(adminOverviewPath, 'utf8');
if (!adminOverviewCode.includes('import { supabase }')) {
  adminOverviewCode = adminOverviewCode.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';\nimport { supabase } from '../../lib/supabase';");
  
  // Quick stats replacement
  const effectCode = `
  const [stats, setStats] = useState({ users: 0, balance: 0, transactions: 0 });
  useEffect(() => {
    const loadStats = async () => {
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: profiles } = await supabase.from('profiles').select('total_balance');
      const { count: txs } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
      
      const balance = profiles?.reduce((sum, p) => sum + Number(p.total_balance || 0), 0) || 0;
      setStats({ users: users || 0, balance, transactions: txs || 0 });
    };
    loadStats();
    
    const channel = supabase.channel('overview_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, loadStats)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);
  `;
  
  adminOverviewCode = adminOverviewCode.replace("export default function AdminOverview() {", "export default function AdminOverview() {\n" + effectCode);
  adminOverviewCode = adminOverviewCode.replace("const kpis = [", "const kpis = [\n    { title: 'Total Users', value: stats.users.toString(), change: '+0', trend: 'up', icon: Users },\n    { title: 'Total AUM (USD)', value: '$' + stats.balance.toLocaleString(), change: '+0%', trend: 'up', icon: DollarSign },\n    { title: 'Total Transactions', value: stats.transactions.toString(), change: '+0', trend: 'up', icon: Activity },\n  ];\n  const dummy = [");
  
  fs.writeFileSync(adminOverviewPath, adminOverviewCode);
}
