const fs = require('fs');

const code = `
import React, { useState, useEffect } from 'react';
import { Layers, Droplet, Search, Activity, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DeFi() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ protocol: '', type: 'Liquidity Pool', asset: '', balance: '', apy: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPositions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('defi_positions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (data) setPositions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPositions();
    const channel = supabase.channel('user_defi_positions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'defi_positions' }, fetchPositions)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('defi_positions').insert({
        user_id: user.id,
        protocol: form.protocol,
        type: form.type,
        asset: form.asset,
        balance: Number(form.balance) || 0,
        apy: Number(form.apy) || 0,
        status: 'pending'
      });
    }
    
    setIsSubmitting(false);
    setShowAddForm(false);
    setForm({ protocol: '', type: 'Liquidity Pool', asset: '', balance: '', apy: '' });
  };

  const filtered = positions.filter(p => 
    p.protocol.toLowerCase().includes(search.toLowerCase()) || 
    p.asset.toLowerCase().includes(search.toLowerCase())
  );

  const activePositions = positions.filter(p => p.status === 'active');
  const totalLocked = activePositions.reduce((sum, p) => sum + Number(p.balance), 0);
  const avgApy = activePositions.length > 0 
    ? activePositions.reduce((sum, p) => sum + Number(p.apy), 0) / activePositions.length 
    : 0;

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">DeFi Positions</h1>
          <p className="text-brand-text-gray">Track your yield farming, staking, and liquidity pools.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-brand-purple text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-opacity"
        >
          <Plus size={18} /> Add Position
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-purple/10 text-brand-purple rounded-lg"><Layers size={20} /></div>
            <h3 className="font-bold text-brand-dark">Total Locked Value</h3>
          </div>
          <p className="text-3xl font-display font-bold text-brand-dark">
            \${totalLocked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Activity size={20} /></div>
            <h3 className="font-bold text-brand-dark">Average APY</h3>
          </div>
          <p className="text-3xl font-display font-bold text-brand-dark">{avgApy.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Droplet size={20} /></div>
            <h3 className="font-bold text-brand-dark">Pending Yield</h3>
          </div>
          <p className="text-3xl font-display font-bold text-brand-dark">
            \${(totalLocked * (avgApy / 100) / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search protocols or assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Protocol</th>
                <th className="px-6 py-4 font-medium">Asset/Pool</th>
                <th className="px-6 py-4 font-medium text-right">Value</th>
                <th className="px-6 py-4 font-medium text-right">APY</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin text-brand-purple mx-auto" size={24} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No positions found. Click "Add Position" to register one.
                  </td>
                </tr>
              ) : (
                filtered.map((pos) => (
                  <tr key={pos.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold bg-brand-purple/10 text-brand-purple">
                          {pos.protocol.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark">{pos.protocol}</p>
                          <p className="text-xs text-gray-500">{pos.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-dark">{pos.asset}</td>
                    <td className="px-6 py-4 text-right font-bold text-brand-dark">
                      \${Number(pos.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600 font-bold">{pos.apy}%</td>
                    <td className="px-6 py-4 text-right">
                      {pos.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 uppercase">
                          Pending Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-brand-dark/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-brand-dark text-lg">Add DeFi Position</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 text-gray-400 hover:text-brand-dark rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Register a new decentralized finance position. It will be marked as "Pending" until an administrator verifies the on-chain data.
              </p>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Protocol Name</label>
                <input required type="text" value={form.protocol} onChange={e => setForm({...form, protocol: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="e.g., Uniswap V3" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Position Type</label>
                <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple">
                  <option>Liquidity Pool</option>
                  <option>Lending</option>
                  <option>Liquid Staking</option>
                  <option>Yield Farm</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Asset or Pair</label>
                <input required type="text" value={form.asset} onChange={e => setForm({...form, asset: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="e.g., ETH/USDC" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Balance (USD)</label>
                  <input required type="number" step="0.01" value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="10000.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">APY (%)</label>
                  <input required type="number" step="0.1" value={form.apy} onChange={e => setForm({...form, apy: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="5.5" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-opacity-90 transition-opacity disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/pages/dashboard/DeFi.tsx', code);
