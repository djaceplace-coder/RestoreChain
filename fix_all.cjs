const fs = require('fs');

// 1. Fix AdminOverview
const overviewPath = 'src/pages/admin/AdminOverview.tsx';
let overviewCode = fs.readFileSync(overviewPath, 'utf8');
overviewCode = overviewCode.replace('stats.map((stat, i)', 'staticStats.map((stat, i)');
fs.writeFileSync(overviewPath, overviewCode);

// 2. Wire up Portfolio
const portfolioPath = 'src/pages/dashboard/Portfolio.tsx';
let portfolioCode = `
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

export default function Portfolio() {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState('1M');
  
  const [assets, setAssets] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch profile total balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_balance')
        .eq('id', user.id)
        .single();
        
      if (profile) setTotalValue(Number(profile.total_balance || 0));

      // Fetch assets
      const { data: userAssets } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id);
        
      if (userAssets && userAssets.length > 0) {
        setAssets(userAssets);
      } else {
        setAssets([]);
      }
      setLoading(false);
    };

    fetchData();

    const channel = supabase.channel('portfolio_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: \`id=eq.\${user.id}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets', filter: \`user_id=eq.\${user.id}\` }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Balance</h1>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-brand-purple transition-colors"
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              <ShieldCheck size={12} /> High Confidence
            </span>
          </div>
          <div className="text-4xl md:text-5xl font-display font-bold text-brand-dark">
            {showBalance ? \`$\${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}\` : '••••••••'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center text-sm font-bold text-green-500">
              <ArrowUpRight size={16} /> $0.00 (0.0%)
            </span>
            <span className="text-sm text-gray-500">Past 24 hours</span>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          {['24H', '1W', '1M', '1Y', 'ALL'].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={\`px-4 py-1.5 text-sm font-bold rounded-md transition-colors \${
                timeRange === range ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500 hover:text-brand-dark'
              }\`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-purple to-blue-600 rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold font-display mb-2">Secure your account with the mobile app</h3>
          <p className="text-purple-100 text-sm max-w-md">Enable push notifications for critical reconciliation updates and approve multi-sig transactions on the go.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-brand-purple hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors shadow-sm">
            Install App
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-brand-dark">Your Assets</h2>
        </div>
        <div className="overflow-x-auto">
          {assets.length === 0 ? (
             <div className="p-12 text-center text-gray-500">No assets found. Waiting for system initialization.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Asset</th>
                  <th className="px-6 py-4 font-medium text-right">Balance</th>
                  <th className="px-6 py-4 font-medium text-right">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={\`w-10 h-10 rounded-full \${asset.color || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-xs\`}>
                          {asset.symbol[0]}
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-brand-dark">{showBalance ? Number(asset.balance).toLocaleString() : '••••'}</p>
                      <p className="text-xs text-gray-500">{asset.symbol}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-brand-dark">
                        \${Number(asset.balance) > 0 ? (Number(asset.value_usd) / Number(asset.balance)).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                      </p>
                      <div className={\`text-xs font-bold flex items-center justify-end gap-1 \${(asset.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}\`}>
                        {(asset.change || 0) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(asset.change || 0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-brand-dark">{showBalance ? \`$\${Number(asset.value_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })}\` : '••••'}</p>
                    </td>
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
`;
fs.writeFileSync(portfolioPath, portfolioCode);

// 3. Wire up Transactions
const transactionsPath = 'src/pages/dashboard/Transactions.tsx';
let transactionsCode = `
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowDownRight, ArrowUpRight, ArrowRightLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

export default function Transactions() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

    const channel = supabase.channel('tx_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: \`user_id=eq.\${user.id}\` }, fetchTxs)
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
                className={\`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors \${
                  filter === f ? 'bg-brand-dark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }\`}
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
                        <div className={\`w-8 h-8 rounded-full flex items-center justify-center \${
                          tx.type.toLowerCase() === 'deposit' || tx.type.toLowerCase() === 'reward' ? 'bg-green-100 text-green-600' :
                          tx.type.toLowerCase() === 'withdrawal' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }\`}>
                          {tx.type.toLowerCase() === 'deposit' || tx.type.toLowerCase() === 'reward' ? <ArrowDownRight size={16} /> : 
                           tx.type.toLowerCase() === 'withdrawal' ? <ArrowUpRight size={16} /> : <ArrowRightLeft size={16} />}
                        </div>
                        <span className="font-bold text-brand-dark capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={\`font-bold \${String(tx.amount).startsWith('-') ? 'text-red-600' : 'text-green-600'}\`}>
                        {tx.amount}
                      </p>
                      <p className="text-xs text-gray-500">{tx.asset}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-dark">
                      \${Number(tx.value || tx.amount).toLocaleString(undefined, {minimumFractionDigits:2})}
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
`;
fs.writeFileSync(transactionsPath, transactionsCode);

