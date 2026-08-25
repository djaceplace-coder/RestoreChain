
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowDownRight, ArrowUpRight, ArrowRightLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Transactions() {
  
  const [filter, setFilter] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    init();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchTxs = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setTransactions(data);
      setLoading(false);
    };

    fetchTxs();

    const channel = supabase.channel('tx_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, fetchTxs)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const filtered = filter === 'All' ? transactions : transactions.filter(t => t.type.toLowerCase() === filter.toLowerCase() || (filter === 'Trades' && t.type === 'trade'));

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Transactions</h1>
          <p className="text-brand-text-gray">Your complete history across all connected wallets.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-brand-dark font-bold rounded-xl hover:bg-gray-50 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
          <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 hide-scrollbar">
            {['All', 'Deposit', 'Withdrawal', 'Trade', 'Reward'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-brand-dark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tx hash, asset..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-purple"
              />
            </div>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>
          ) : filtered.length === 0 ? (
             <div className="p-12 text-center text-gray-500">No transactions found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Asset/Amount</th>
                  <th className="px-6 py-4 font-medium">Value (USD)</th>
                  <th className="px-6 py-4 font-medium">Wallet</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type.toLowerCase() === 'deposit' || tx.type.toLowerCase() === 'reward' ? 'bg-green-100 text-green-600' :
                          tx.type.toLowerCase() === 'withdrawal' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {tx.type.toLowerCase() === 'deposit' || tx.type.toLowerCase() === 'reward' ? <ArrowDownRight size={16} /> : 
                           tx.type.toLowerCase() === 'withdrawal' ? <ArrowUpRight size={16} /> : <ArrowRightLeft size={16} />}
                        </div>
                        <span className="font-bold text-brand-dark capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-bold ${String(tx.amount).startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                        {tx.amount}
                      </p>
                      <p className="text-xs text-gray-500">{tx.asset}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-dark">
                      ${Number(tx.value || tx.amount).toLocaleString(undefined, {minimumFractionDigits:2})}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.wallet || 'System'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
