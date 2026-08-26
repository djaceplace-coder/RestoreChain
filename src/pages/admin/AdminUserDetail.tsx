import React, { useState, useEffect } from 'react';
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
  const [taxReports, setTaxReports] = useState<any[]>([]);
  const [defiPositions, setDefiPositions] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // System Update Form State
  const [usdAmount, setUsdAmount] = useState('');
  const [assetName, setAssetName] = useState('USD');
  const [messageTitle, setMessageTitle] = useState('Balance Updated');
  const [messageBody, setMessageBody] = useState('An admin has initialized your account balance.');
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 16));
  const [updateStatus, setUpdateStatus] = useState('');
  const [profitRate, setProfitRate] = useState('');
  const [updatingProfit, setUpdatingProfit] = useState(false);

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
    
    const channel = supabase.channel('admin_user_detail_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${id}` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reconciliation_issues', filter: `user_id=eq.${id}` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${id}` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${id}` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${id}` }, fetchUserAndData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tax_reports', filter: `user_id=eq.${id}` }, fetchUserAndData)
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

    const { data: taxData } = await supabase.from('tax_reports').select('*').eq('user_id', id).order('created_at', { ascending: false });
    const { data: defiData } = await supabase.from('defi_positions').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (defiData) setDefiPositions(defiData);
    const { data: nftData } = await supabase.from('nfts').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (nftData) setNfts(nftData);
    if (taxData) setTaxReports(taxData);

    setLoading(false);
  };

  const handleUpdateProfitRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfit(true);
    await supabase.from('profiles').update({ profit_rate: parseFloat(profitRate) || 0 }).eq('id', id);
    setUpdatingProfit(false);
    setUser({...user, profit_rate: parseFloat(profitRate) || 0});
  };

  const handleSystemUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus('Processing...');

    // 1. Try RPC call first
    const { error: rpcErr } = await supabase.rpc('admin_system_update', {
      target_user_id: id,
      usd_amount: Number(usdAmount),
      asset_name: assetName,
      message_title: messageTitle,
      message_body: messageBody,
      tx_date: txDate
    });
    
    if (!rpcErr) {
      setUpdateStatus('Success! Balance added and notification sent.');
      setUsdAmount('');
      fetchUserAndData();
      return;
    }

    // 2. Resilient Direct Table Operations Fallback (handles column constraints like value_usd)
    try {
      const addedAmount = Number(usdAmount) || 0;
      const newBal = (Number(user?.total_balance) || 0) + addedAmount;

      // Update User Profile Balance
      const { error: profErr } = await supabase.from('profiles').update({ total_balance: newBal }).eq('id', id);
      if (profErr) throw profErr;

      // Create Transaction record (supplying both amount AND value_usd to satisfy table constraints)
      const formattedDate = txDate ? new Date(txDate).toISOString() : new Date().toISOString();
      await supabase.from('transactions').insert({
        user_id: id,
        type: 'deposit',
        amount: addedAmount,
        value_usd: addedAmount,
        asset: assetName || 'USD',
        status: 'completed',
        created_at: formattedDate
      });

      // Create Notification
      await supabase.from('notifications').insert({
        user_id: id,
        type: 'system',
        title: messageTitle || 'Balance Updated',
        message: messageBody || 'An admin has initialized your account balance.',
        is_read: false,
        created_at: formattedDate
      });

      setUpdateStatus('Success! Balance added and notification sent.');
      setUsdAmount('');
      fetchUserAndData();
    } catch (fallbackErr: any) {
      setUpdateStatus(`Error: ${fallbackErr.message || rpcErr?.message}`);
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
    
    if (error) setReconStatus(`Error: ${error.message}`);
    else {
      setReconStatus('Issue pushed successfully!');
      setReconDesc('');
    }
  };

  const resolveReconIssue = async (issueId: string) => {
    await supabase.from('reconciliation_issues').update({ status: 'resolved' }).eq('id', issueId);
  };

  const approveWallet = async (walletId: string) => {
    await supabase.from('wallets').update({ status: 'active' }).eq('id', walletId);
  };

  const completeTaxReport = async (reportId: string) => {
    await supabase.from('tax_reports').update({ status: 'completed' }).eq('id', reportId);
  };

  const pushWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletStatusMsg('Adding...');
    const { error } = await supabase.from('wallets').insert({
      user_id: id,
      address_or_key: walletAddress,
      type: walletNetwork,
      name: walletLabel || walletNetwork + ' Wallet',
      balance: Number(walletBalance),
      status: 'active'
    });
    
    if (error) setWalletStatusMsg(`Error: ${error.message}`);
    else {
      setWalletStatusMsg('Wallet connected successfully!');
      setWalletAddress('');
    }
  };

  const approveDefi = async (posId: string) => {
    await supabase.from('defi_positions').update({ status: 'active' }).eq('id', posId);
    setDefiPositions(defiPositions.map(d => d.id === posId ? { ...d, status: 'active' } : d));
  };
  
  const approveDocument = async (docId: string) => {
    await supabase.from('user_documents').update({ status: 'approved' }).eq('id', docId);
    await supabase.from('profiles').update({ kyc_status: 'approved' }).eq('id', id);
    // Refresh
    const { data: userDocs } = await supabase.from('user_documents').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (userDocs) setDocuments(userDocs);
  };

  const approveNft = async (nftId: string) => {
    await supabase.from('nfts').update({ status: 'active' }).eq('id', nftId);
    setNfts(nfts.map(n => n.id === nftId ? { ...n, status: 'active' } : n));
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
            Balance: ${Number(user.total_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          { id: 'taxes', label: 'Tax Reports', icon: Receipt, badge: taxReports.filter(t=>t.status==='pending').length },
          { id: 'transactions', label: 'Transactions', icon: History },
          { id: 'notifications', label: 'Push Notifications', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300'
            }`}
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
                  </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input type="datetime-local" required value={txDate} onChange={e => setTxDate(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className={`p-3 text-sm font-bold rounded-xl ${updateStatus.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {updateStatus}
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl text-sm hover:bg-black transition-colors shadow-lg">
                  Execute System Update
                </button>
              </div>
            </form>
            
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold text-brand-dark mb-4">Update Active Profit Rate</h3>
              <form onSubmit={handleUpdateProfitRate} className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Profit Rate (%)</label>
                  <input type="number" step="0.01" value={profitRate} onChange={e => setProfitRate(e.target.value)} placeholder="e.g. 5.5" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" />
                </div>
                <button type="submit" disabled={updatingProfit} className="px-6 py-3 bg-brand-purple text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors disabled:opacity-50">
                  {updatingProfit ? 'Updating...' : 'Save Rate'}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">This will dictate the percentage growth shown on the user's dashboard balance in real-time.</p>
            </div>
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
                  <div className={`p-3 text-sm font-bold rounded-xl ${reconStatus.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
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
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${issue.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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
                  <div className={`p-3 text-sm font-bold rounded-xl ${walletStatusMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
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
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-brand-dark">{w.name}</p>
                        {w.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PENDING</span>}
                        {w.status === 'active' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ACTIVE</span>}
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-1">{(w.address_or_key||"").substring(0,8)}...{(w.address_or_key||"").substring((w.address_or_key||"").length-6)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-full">{w.type}</span>
                      {w.status === 'pending' && (
                        <button onClick={() => approveWallet(w.id)} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold rounded-lg transition-colors">
                          Approve
                        </button>
                      )}
                    </div>
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
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.created_at).toLocaleString()}</td>
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

        {/* TAB: TAX REPORTS */}
        {activeTab === 'taxes' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Manage User Tax Reports</h2>
            <div className="space-y-3">
              {taxReports.map(t => (
                <div key={t.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-dark">Tax Year {t.tax_year}</p>
                    <p className="text-xs text-gray-500 mt-1">Requested: {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.status === 'pending' ? (
                      <>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700">PENDING</span>
                        <button onClick={() => completeTaxReport(t.id)} className="px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">
                          Mark as Completed
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle size={12}/> COMPLETED</span>
                    )}
                  </div>
                </div>
              ))}
              {taxReports.length === 0 && <p className="text-sm text-gray-500">No tax reports requested by this user.</p>}
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
        {/* TAB: DEFI */}
        {activeTab === 'defi' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">DeFi Positions</h2>
            <div className="space-y-3">
              {defiPositions.map(d => (
                <div key={d.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-dark">{d.protocol}</p>
                      {d.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PENDING</span>}
                      {d.status === 'active' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ACTIVE</span>}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">{d.type} - {d.asset}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-brand-dark">${d.balance}</p>
                      <p className="text-xs text-gray-400 font-bold">{d.apy}% APY</p>
                    </div>
                    {d.status === 'pending' && (
                      <button onClick={() => approveDefi(d.id)} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold rounded-lg transition-colors">
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {defiPositions.length === 0 && <p className="text-sm text-gray-500">No DeFi positions requested.</p>}
            </div>
          </div>
        )}
        
        
        {/* TAB: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">User Documents (KYC/NDA)</h2>
            <div className="space-y-4">
              {documents.map(d => (
                <div key={d.id} className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-dark uppercase">{d.document_type.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(d.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${d.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {d.status.toUpperCase()}
                      </span>
                      {d.status === 'pending' && (
                        <button onClick={() => approveDocument(d.id)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
                          Approve Document
                        </button>
                      )}
                    </div>
                  </div>
                  {d.signature_data && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase">E-Signature</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 inline-block">
                        <img src={d.signature_data} alt="Signature" className="max-h-24 mix-blend-multiply" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {documents.length === 0 && <p className="text-sm text-gray-500">No documents submitted.</p>}
            </div>
          </div>
        )}

        {/* TAB: NFTS */}
        {activeTab === 'nfts' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">NFT Collection</h2>
            <div className="space-y-3">
              {nfts.map(n => (
                <div key={n.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-dark">{n.name}</p>
                      {n.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PENDING</span>}
                      {n.status === 'active' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ACTIVE</span>}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">{n.collection}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Floor</p>
                      <p className="font-bold text-brand-dark">${n.floor_price}</p>
                    </div>
                    {n.status === 'pending' && (
                      <button onClick={() => approveNft(n.id)} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold rounded-lg transition-colors">
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {nfts.length === 0 && <p className="text-sm text-gray-500">No NFTs requested.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
