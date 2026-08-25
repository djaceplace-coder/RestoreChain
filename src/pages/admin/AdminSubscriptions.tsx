import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CreditCard, CheckCircle, Search, Edit2, Loader2, ShieldAlert } from 'lucide-react';

export default function AdminSubscriptions() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTier, setEditTier] = useState('free');

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    const channel = supabase.channel('admin_subs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleUpdate = async (userId: string) => {
    await supabase.from('profiles').update({ tier: editTier }).eq('id', userId);
    setEditingId(null);
  };

  const filtered = users.filter(u => 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.id || '').includes(search)
  );

  return (
    <div className="animate-fade-in">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Subscriptions</h1>
          <p className="text-gray-500">Manage user plans and billing tiers.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by email or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-red-500" size={32} /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Current Plan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-brand-dark">{u.email || 'Unknown User'}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{u.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <select 
                        value={editTier}
                        onChange={e => setEditTier(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg p-2 text-sm font-bold"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    ) : (
                      <span className="font-bold uppercase text-xs tracking-wider bg-gray-100 px-3 py-1 rounded-full text-brand-dark">
                        {u.tier || 'Free'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle size={14} /> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === u.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={() => handleUpdate(u.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(u.id); setEditTier(u.tier || 'free'); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
