const fs = require('fs');

const adminUserDetailPath = 'src/pages/admin/AdminUserDetail.tsx';
let adminUserDetailCode = `import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, History, Activity, Receipt, CreditCard, MessageSquare, ShieldAlert, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('system');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [reconIssues, setReconIssues] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // System Update Form State
  const [usdAmount, setUsdAmount] = useState('');
  const [assetName, setAssetName] = useState('USD');
  const [messageTitle, setMessageTitle] = useState('Balance Updated');
  const [messageBody, setMessageBody] = useState('An admin has initialized your account balance.');
  const [updateStatus, setUpdateStatus] = useState('');

  // Recon Form State
  const [reconType, setReconType] = useState('Missing Cost Basis');
  const [reconAsset, setReconAsset] = useState('ETH');
  const [reconAmount, setReconAmount] = useState('2.5 ETH');
  const [reconDesc, setReconDesc] = useState('Transfer from unknown external wallet.');
  const [reconStatus, setReconStatus] = useState('');

  // Wallet Form State
  const [walletAddress, setWalletAddress] = useState('');
  const [walletNetwork, setWalletNetwork] = useState('Ethereum');
  const [walletLabel, setWalletLabel] = useState('Main Cold Storage');
  const [walletBalance, setWalletBalance] = useState('0');
  const [walletStatusMsg, setWalletStatusMsg] = useState('');

  useEffect(() => {
    fetchUserAndData();
    
    const channel = supabase.channel('admin_user_detail_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: \`id=eq.\${id}\` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reconciliation_issues', filter: \`user_id=eq.\${id}\` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: \`user_id=eq.\${id}\` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: \`user_id=eq.\${id}\` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: \`user_id=eq.\${id}\` }, fetchUserAndData)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const fetchUserAndData = async () => {
    const { data: userData } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (userData) setUser(userData);

    const { data: reconData } = await supabase.from('reconciliation_issues').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (reconData) setReconIssues(reconData);

    const { data: walletData } = await supabase.from('wallets').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (walletData) setWallets(walletData);

    const { data: txData } = await supabase.from('transactions').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (txData) setTransactions(txData);

    const { data: notifData } = await supabase.from('notifications').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (notifData) setNotifications(notifData);

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
    
    if (error) setUpdateStatus(\`Error: \${error.message}\`);
    else {
      setUpdateStatus('Success! Balance added and notification sent.');
      setUsdAmount('');
    }
  };

  const pushReconIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setReconStatus('Pushing...');
    const { error } = await supabase.from('reconciliation_issues').insert({
      user_id: id,
      type: reconType,
      asset: reconAsset,
      amount: reconAmount,
      issue_desc: reconDesc,
      status: 'open'
    });
    
    if (error) setReconStatus(\`Error: \${error.message}\`);
    else {
      setReconStatus('Issue pushed successfully!');
      setReconDesc('');
    }
  };

  const resolveReconIssue = async (issueId: string) => {
    await supabase.from('reconciliation_issues').update({ status: 'resolved' }).eq('id', issueId);
  };

  const pushWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletStatusMsg('Adding...');
    const { error } = await supabase.from('wallets').insert({
      user_id: id,
      address: walletAddress,
      network: walletNetwork,
      label: walletLabel,
      balance: Number(walletBalance),
      status: 'active'
    });
    
    if (error) setWalletStatusMsg(\`Error: \${error.message}\`);
    else {
      setWalletStatusMsg('Wallet connected successfully!');
      setWalletAddress('');
    }
  };

  const pushNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    await supabase.from('notifications').insert({
      user_id: id,
      type: 'system',
      title,
      message
    });
    form.reset();
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
  if (!user) return <div className="p-12 text-center text-gray-500">User not found</div>;

  return (
    <div className="animate-fade-in pb-20">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-brand-dark">{user.first_name} {user.last_name}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-purple/10 text-brand-purple">
              {user.plan || 'Free'} Plan
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
              {user.role}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{user.email} • ID: {id} • Joined: {new Date(user.created_at).toLocaleDateString()}</p>
          <div className="mt-2 text-xl font-bold text-brand-dark">
            Balance: \${Number(user.total_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors" title="The Impersonate button allows an admin to securely log in as this user to view the app exactly as they see it. (Requires backend SSO auth setup)">
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
          { id: 'reconciliation', label: 'Reconciliation', icon: Activity, badge: reconIssues.filter(r=>r.status==='open').length },
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
            {tab.badge ? <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px]">{tab.badge}</span> : null}
            {!tab.badge && tab.alert && <span className="w-2 h-2 rounded-full bg-red-500 ml-1"></span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
        
        {/* TAB: SYSTEM UPDATE */}
        {activeTab === 'system' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Provision Assets & System Updates</h2>
            
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

        {/* TAB: RECONCILIATION */}
        {activeTab === 'reconciliation' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-4">Push New Assessment</h2>
              <p className="text-sm text-gray-500 mb-6">Input assessment results to give response/flags for the user's reconciliation dashboard.</p>
              
              <form onSubmit={pushReconIssue} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Issue Type</label>
                    <select value={reconType} onChange={e=>setReconType(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500">
                      <option>Missing Cost Basis</option>
                      <option>Unclassified DeFi</option>
                      <option>Suspicious Transfer</option>
                      <option>Missing Tax ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Asset</label>
                    <input type="text" value={reconAsset} onChange={e=>setReconAsset(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Amount / Value String</label>
                  <input type="text" value={reconAmount} onChange={e=>setReconAmount(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Description</label>
                  <textarea rows={3} value={reconDesc} onChange={e=>setReconDesc(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500"></textarea>
                </div>
                
                {reconStatus && (
                  <div className={\`p-3 text-sm font-bold rounded-xl \${reconStatus.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
                    {reconStatus}
                  </div>
                )}
                
                <button type="submit" className="w-full px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-colors">
                  Push to User Dashboard
                </button>
              </form>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-4">Active & Resolved Issues</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {reconIssues.map(issue => (
                  <div key={issue.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={\`text-xs font-bold px-2 py-0.5 rounded \${issue.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}\`}>
                          {issue.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{issue.type}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-brand-dark text-sm mb-3">{issue.issue_desc}</p>
                    {issue.status === 'open' && (
                      <div className="flex justify-end pt-2 border-t border-gray-100">
                        <button onClick={() => resolveReconIssue(issue.id)} className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                          <CheckCircle size={14} className="text-green-500" /> Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {reconIssues.length === 0 && <p className="text-sm text-gray-500">No reconciliation issues recorded.</p>}
              </div>
            </div>
          </div>
        )}

        {/* TAB: WALLETS */}
        {activeTab === 'wallets' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-4">Connect Manual Wallet</h2>
              <form onSubmit={pushWallet} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Wallet Address</label>
                  <input type="text" required value={walletAddress} onChange={e=>setWalletAddress(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Network</label>
                    <input type="text" required value={walletNetwork} onChange={e=>setWalletNetwork(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Label</label>
                    <input type="text" value={walletLabel} onChange={e=>setWalletLabel(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
                  </div>
                </div>
                
                {walletStatusMsg && (
                  <div className={\`p-3 text-sm font-bold rounded-xl \${walletStatusMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}\`}>
                    {walletStatusMsg}
                  </div>
                )}
                
                <button type="submit" className="w-full px-4 py-2.5 bg-brand-dark text-white font-bold rounded-xl text-sm hover:bg-black transition-colors">
                  Add Wallet to User
                </button>
              </form>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-4">Connected Wallets</h2>
              <div className="space-y-3">
                {wallets.map(w => (
                  <div key={w.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-dark">{w.label}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">{w.address.substring(0,8)}...{w.address.substring(w.address.length-6)}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-full">{w.network}</span>
                  </div>
                ))}
                {wallets.length === 0 && <p className="text-sm text-gray-500">No wallets connected.</p>}
              </div>
            </div>
          </div>
        )}

        {/* TAB: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Asset/Amount</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-dark capitalize">{tx.type}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-brand-dark">{tx.amount}</p>
                        <p className="text-xs text-gray-500">{tx.asset}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No transactions recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Push Custom Notification</h2>
            <form onSubmit={pushNotification} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input name="title" type="text" required placeholder="e.g. Account Review Required" className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                <textarea name="message" required rows={3} placeholder="Notification body..." className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm">
                  Send to User
                </button>
              </div>
            </form>
            
            <h3 className="font-bold text-brand-dark mb-4">Notification History</h3>
            <div className="space-y-2">
              {notifications.map(n => (
                <div key={n.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white">
                  <div>
                    <p className="font-bold text-sm text-brand-dark">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-sm text-gray-500">No notifications sent.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(adminUserDetailPath, adminUserDetailCode);
