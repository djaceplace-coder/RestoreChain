const fs = require('fs');
const walletsPath = 'src/pages/dashboard/Wallets.tsx';
const walletsCode = `
import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertCircle, Link2, ExternalLink, Loader2, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Wallets() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newNetwork, setNewNetwork] = useState('Ethereum');
  const [newLabel, setNewLabel] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    init();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchWallets = async () => {
      const { data } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setWallets(data);
      setLoading(false);
    };

    fetchWallets();

    const channel = supabase.channel('user_wallets_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, fetchWallets)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');
    
    const { error } = await supabase.from('wallets').insert({
      user_id: user.id,
      address: newAddress,
      network: newNetwork,
      label: newLabel || newNetwork + ' Wallet',
      status: 'pending',
      balance: 0
    });
    
    if (error) {
      setSubmitStatus(\`Error: \${error.message}\`);
    } else {
      setSubmitStatus('Wallet submitted successfully! Waiting for admin approval.');
      setNewAddress('');
      setNewLabel('');
      setTimeout(() => setIsAdding(false), 3000);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Connected Wallets & Exchanges</h1>
          <p className="text-brand-text-gray">Manage your data sources. Manual connections require admin resolution.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
        >
          <Plus size={20} /> Add Wallet
        </button>
      </header>

      {isAdding && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-bold text-brand-dark mb-4">Submit Wallet for Connection</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Wallet Address</label>
              <input type="text" required value={newAddress} onChange={e => setNewAddress(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="0x..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Network</label>
                <select value={newNetwork} onChange={e => setNewNetwork(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple">
                  <option>Ethereum</option>
                  <option>Bitcoin</option>
                  <option>Solana</option>
                  <option>Polygon</option>
                  <option>Exchange API</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Label (Optional)</label>
                <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="e.g. Main Cold Storage" />
              </div>
            </div>
            
            {submitStatus && (
              <div className={\`p-3 text-sm font-bold rounded-xl \${submitStatus.includes('success') ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}\`}>
                {submitStatus}
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-md text-sm">Submit Connection</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {wallets.map(wallet => (
            <div key={wallet.id} className={\`bg-white p-5 rounded-2xl border \${wallet.status === 'pending' ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200'} shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors\`}>
              <div className="flex items-center gap-4">
                <div className={\`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 \${wallet.status === 'pending' ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-500'}\`}>
                  {wallet.network.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark flex items-center gap-2">
                    {wallet.label || wallet.network}
                    {wallet.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase">
                        Pending Admin Resolution
                      </span>
                    )}
                    {wallet.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{wallet.address.substring(0,6)}...{wallet.address.substring(wallet.address.length-4)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
                <div className="text-right">
                  <p className="font-bold text-brand-dark">\${Number(wallet.balance).toLocaleString()}</p>
                  {wallet.status === 'pending' ? (
                    <p className="text-xs text-orange-500 font-bold flex items-center justify-end gap-1">
                      <Clock size={12} /> Awaiting Sync
                    </p>
                  ) : (
                    <p className="text-xs text-green-500 font-bold flex items-center justify-end gap-1">
                      <Link2 size={12} /> Connected
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {wallets.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-400 mb-2">No wallets connected</h3>
              <p className="text-sm text-gray-400">Click "Add Wallet" to submit a connection request.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(walletsPath, walletsCode);
