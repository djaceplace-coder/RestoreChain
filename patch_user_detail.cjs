const fs = require('fs');
const adminUserDetailPath = 'src/pages/admin/AdminUserDetail.tsx';
let adminUserDetailCode = `import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, History, Activity, Receipt, CreditCard, MessageSquare, ShieldAlert, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('system');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // System Update Form State
  const [usdAmount, setUsdAmount] = useState('');
  const [assetName, setAssetName] = useState('USD');
  const [messageTitle, setMessageTitle] = useState('Balance Updated');
  const [messageBody, setMessageBody] = useState('An admin has initialized your account balance.');
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    fetchUser();
    
    // Subscribe to specific user changes
    const channel = supabase.channel('user_detail_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: \`id=eq.\${id}\` }, () => {
        fetchUser();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
      
    if (data) setUser(data);
    setLoading(false);
  };

  const handleSystemUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus('Processing...');
    
    const { error } = await supabase.rpc('admin_system_update', {
      target_user_id: id,
      usd_amount: Number(usdAmount),
      asset_name: assetName,
      message_title: messageTitle,
      message_body: messageBody
    });
    
    if (error) {
      setUpdateStatus(\`Error: \${error.message}\`);
    } else {
      setUpdateStatus('Success! Balance added and notification sent.');
      setUsdAmount('');
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
  if (!user) return <div className="p-12 text-center text-gray-500">User not found</div>;

  return (
    <div className="animate-fade-in">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-brand-dark">{user.first_name} {user.last_name}</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-purple/10 text-brand-purple">
              {user.plan || 'Free'} Plan
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              {user.role}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{user.email} • ID: {id} • Joined: {new Date(user.created_at).toLocaleDateString()}</p>
          <div className="mt-2 text-xl font-bold text-brand-dark">
            Balance: \${Number(user.total_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
            Impersonate
          </button>
          <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
            <ShieldAlert size={16} /> Suspend User
          </button>
        </div>
      </header>

      {/* Admin Module Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-200 pb-px custom-scrollbar">
        {[
          { id: 'system', label: 'System Update', icon: Wallet, alert: true },
          { id: 'reconciliation', label: 'Reconciliation', icon: Activity },
          { id: 'wallets', label: 'Wallets', icon: Wallet },
          { id: 'transactions', label: 'Transactions', icon: History },
          { id: 'notifications', label: 'Push Notifications', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={\`flex items-center gap-2 px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 -mb-px \${
              activeTab === tab.id 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300'
            }\`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.alert && <span className="w-2 h-2 rounded-full bg-red-500 ml-1"></span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
        {activeTab === 'system' && (
          <div className="animate-fade-in max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-dark">Provision Assets & System Updates</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6">
              <p className="text-sm text-orange-800 font-bold flex items-center gap-2">
                <AlertTriangle size={16} /> This triggers the admin_system_update secure RPC to provision funds directly to the user's system wallet and updates their total balance.
              </p>
            </div>

            <form onSubmit={handleSystemUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Amount (USD)</label>
                  <input type="number" step="0.01" required value={usdAmount} onChange={e => setUsdAmount(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" placeholder="10000.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Asset Name</label>
                  <input type="text" required value={assetName} onChange={e => setAssetName(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" placeholder="USD / BTC / ETH" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Notification Title</label>
                <input type="text" required value={messageTitle} onChange={e => setMessageTitle(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Notification Message</label>
                <textarea rows={3} required value={messageBody} onChange={e => setMessageBody(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500"></textarea>
              </div>
              
              {updateStatus && (
                <div className={\`p-3 text-sm font-bold rounded-xl \${updateStatus.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
                  {updateStatus}
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl text-sm hover:bg-black transition-colors shadow-lg">
                  Execute System Update
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab !== 'system' && (
          <div className="py-12 text-center animate-fade-in text-gray-500">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(adminUserDetailPath, adminUserDetailCode);
