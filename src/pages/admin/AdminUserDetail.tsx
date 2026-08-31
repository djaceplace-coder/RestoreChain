import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Eye, ArrowLeft, Wallet, History, Activity, Receipt, MessageSquare, 
  ShieldAlert, Loader2, CheckCircle, Bitcoin, DollarSign, 
  TrendingUp, RefreshCw, FileText, ArrowRight, Check,
  PlusCircle, MinusCircle, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLivePrices } from '../../hooks/useLivePrices';
import CoinLogo from '../../components/CoinLogo';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('system');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Live prices hook
  const { coins: liveRates, btcPrice, getPrice, refresh: refreshPrices } = useLivePrices(30000);

  // Data states
  const [reconIssues, setReconIssues] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [taxReports, setTaxReports] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // Overhauled Balance & System Update State
  const [provisionMode, setProvisionMode] = useState<'crypto' | 'fiat'>('crypto');
  const [txAction, setTxAction] = useState<'credit' | 'debit' | 'set' | 'clear'>('credit');
  const [deductionReason, setDeductionReason] = useState('Transfer Out');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [messageTitle, setMessageTitle] = useState('Bitcoin Balance Credited');
  const [messageBody, setMessageBody] = useState('Your portfolio has been credited with new asset holdings.');
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 16));
  const [updateStatus, setUpdateStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profit Rate Form State
  const [profitRate, setProfitRate] = useState('');
  const [updatingProfit, setUpdatingProfit] = useState(false);
  const [profitSuccessMsg, setProfitSuccessMsg] = useState('');

  // Recon Form State
  const [reconType, setReconType] = useState('Missing Cost Basis');
  const [reconAsset, setReconAsset] = useState('BTC');
  const [reconAmount, setReconAmount] = useState('0.5 BTC');
  const [reconDesc, setReconDesc] = useState('Unconfirmed UTXO transfer detected on cold storage network.');
  const [reconStatus, setReconStatus] = useState('');

  // Wallet Form State
  const [walletAddress, setWalletAddress] = useState('');
  const [walletNetwork, setWalletNetwork] = useState('Bitcoin');
  const [walletLabel, setWalletLabel] = useState('Secured Vault Storage');
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_documents', filter: `user_id=eq.${id}` }, fetchUserAndData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const fetchUserAndData = async () => {
    const { data: userData } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (userData) {
      setUser(userData);
      if (userData.profit_rate !== undefined && userData.profit_rate !== null) {
        setProfitRate(String(userData.profit_rate));
      }
    }

    const { data: reconData } = await supabase.from('reconciliation_issues').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (reconData) setReconIssues(reconData);

    const { data: walletData } = await supabase.from('wallets').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (walletData) setWallets(walletData);

    const { data: txData } = await supabase.from('transactions').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (txData) setTransactions(txData);

    const { data: notifData } = await supabase.from('notifications').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (notifData) setNotifications(notifData);

    const { data: taxData } = await supabase.from('tax_reports').select('*').eq('user_id', id).order('created_at', { ascending: false });
    if (taxData) setTaxReports(taxData);

    const { data: userDocs } = await supabase.from('user_documents').select('*').eq('user_id', id).order('created_at', { ascending: false });
    const { data: kycDocs } = await supabase.from('kyc_documents').select('*').eq('user_id', id).order('created_at', { ascending: false });
    
    let combinedDocs: any[] = [];
    if (userDocs) {
      combinedDocs = [...combinedDocs, ...userDocs.map(d => ({ ...d, source_table: 'user_documents' }))];
    }
    if (kycDocs) {
      combinedDocs = [...combinedDocs, ...kycDocs.map(d => ({ ...d, source_table: 'kyc_documents' }))];
    }
    // Sort by created_at descending
    combinedDocs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setDocuments(combinedDocs);

    setLoading(false);
  };

  // Sync crypto amount -> USD amount when typing
  const handleCryptoChange = (val: string, asset = selectedAsset) => {
    setCryptoAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const currentRate = getPrice(asset, asset === 'BTC' ? btcPrice : 1);
      const calculatedUsd = (num * currentRate).toFixed(2);
      setUsdAmount(calculatedUsd);
      
      if (txAction === 'credit') {
        setMessageTitle(`${asset} Balance Credited`);
        setMessageBody(`Your account has been credited with ${num} ${asset} (≈ $${Number(calculatedUsd).toLocaleString()}).`);
      } else {
        setMessageTitle(`${asset} Balance Deduction`);
        setMessageBody(`A deduction of ${num} ${asset} (≈ $${Number(calculatedUsd).toLocaleString()}) has been processed. Reason: ${deductionReason}`);
      }
    } else {
      setUsdAmount('');
    }
  };

  // Sync USD amount -> crypto amount when typing
  const handleUsdChange = (val: string, asset = selectedAsset) => {
    setUsdAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const currentRate = getPrice(asset, asset === 'BTC' ? btcPrice : 1);
      if (currentRate > 0) {
        const calculatedCrypto = (num / currentRate).toFixed(6);
        setCryptoAmount(calculatedCrypto);
        
        if (txAction === 'credit') {
          setMessageTitle(`${asset} Balance Credited`);
          setMessageBody(`Your account has been credited with ${calculatedCrypto} ${asset} (≈ $${num.toLocaleString()}).`);
        } else {
          setMessageTitle(`${asset} Balance Deduction`);
          setMessageBody(`A deduction of ${calculatedCrypto} ${asset} (≈ $${num.toLocaleString()}) has been processed. Reason: ${deductionReason}`);
        }
      }
    } else {
      setCryptoAmount('');
    }
  };

  const handleAssetSelect = (newAsset: string) => {
    setSelectedAsset(newAsset);
    if (cryptoAmount) {
      handleCryptoChange(cryptoAmount, newAsset);
    } else if (usdAmount) {
      handleUsdChange(usdAmount, newAsset);
    }
  };

  const handleUpdateProfitRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfit(true);
    setProfitSuccessMsg('');
    const rate = parseFloat(profitRate) || 0;
    const { error } = await supabase.from('profiles').update({ profit_rate: rate }).eq('id', id);
    setUpdatingProfit(false);
    if (!error) {
      setUser({ ...user, profit_rate: rate });
      setProfitSuccessMsg(`Profit rate updated to +${rate}% per annum`);
      setTimeout(() => setProfitSuccessMsg(''), 4000);
    }
  };

  
  const toggleFreeze = async () => {
    try {
      const newFreezeStatus = !user?.is_frozen;
      const { error } = await supabase.from('profiles').update({ is_frozen: newFreezeStatus }).eq('id', id);
      if (error) throw error;
      setUser({ ...user, is_frozen: newFreezeStatus });
      alert(newFreezeStatus ? 'Account has been frozen.' : 'Account has been unfrozen.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSystemUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateStatus(`Executing balance ${txAction}...`);

    try {
      const finalUsdAmount = parseFloat(usdAmount) || 0;
      const finalCryptoQty = parseFloat(cryptoAmount) || 0;
      const assetSymbol = provisionMode === 'crypto' ? selectedAsset.toUpperCase() : (user?.preferred_currency || 'USD');

      if (finalUsdAmount <= 0 && txAction !== 'clear') {
        throw new Error('Please enter a valid balance amount greater than 0.');
      }

      const { data: adminUser } = await supabase.auth.getUser();
      if (!adminUser.user) throw new Error("Admin not authenticated");

      // Call the streamlined SQL RPC function

      // 1. Fetch user current balances
      const { data: profile, error: profileErr } = await supabase.from('profiles').select('total_balance, fiat_balance').eq('id', id).single();
      if (profileErr) throw new Error("Could not fetch user profile: " + profileErr.message);

      const currentTotal = Number(profile.total_balance) || 0;
      const currentFiat = Number(profile.fiat_balance) || 0;

      let newTotal = currentTotal;
      let newFiat = currentFiat;
      let newCrypto = 0;
      
      let txType = 'Deposit';
      let txAmount = assetSymbol === 'USD' ? finalUsdAmount : finalCryptoQty;

      // Calculate logic
      if (txAction === 'credit') {
        newTotal += finalUsdAmount;
        if (assetSymbol === 'USD') newFiat += finalUsdAmount;
      } else if (txAction === 'debit') {
        newTotal = Math.max(0, newTotal - finalUsdAmount);
        if (assetSymbol === 'USD') newFiat = Math.max(0, newFiat - finalUsdAmount);
        txType = 'Withdrawal';
      } else if (txAction === 'set') {
        newTotal = finalUsdAmount;
        if (assetSymbol === 'USD') newFiat = finalUsdAmount;
      } else if (txAction === 'clear') {
        newTotal = 0;
        newFiat = 0;
        txType = 'Withdrawal';
        txAmount = currentTotal;
      }

      // Update portfolios if crypto
      if (assetSymbol !== 'USD') {
        const { data: portData } = await supabase.from('portfolios').select('id, balance, value').eq('user_id', id).eq('symbol', assetSymbol).maybeSingle();
        const oldCrypto = portData ? Number(portData.balance) || 0 : 0;
        
        if (txAction === 'credit') newCrypto = oldCrypto + finalCryptoQty;
        else if (txAction === 'debit') newCrypto = Math.max(0, oldCrypto - finalCryptoQty);
        else if (txAction === 'set') newCrypto = finalCryptoQty;
        else if (txAction === 'clear') newCrypto = 0;

        if (portData) {
          const { error: pErr } = await supabase.from('portfolios').update({ balance: newCrypto, value: newCrypto * (finalUsdAmount / (finalCryptoQty || 1)) }).eq('id', portData.id);
          if (pErr) console.warn("Portfolio update error:", pErr);
        } else if (newCrypto > 0) {
          const { error: pErr } = await supabase.from('portfolios').insert({ user_id: id, symbol: assetSymbol, name: assetSymbol, balance: newCrypto, value: finalUsdAmount, change_24h: 0 });
          if (pErr) console.warn("Portfolio insert error:", pErr);
        }
      }

      if (txAction === 'clear') {
        const { error: cErr } = await supabase.from('portfolios').update({ balance: 0, value: 0 }).eq('user_id', id);
        if (cErr) console.warn("Clear portfolios error:", cErr);
      }

      // 2. Update Profile
      const { error: updateErr } = await supabase.from('profiles').update({ total_balance: newTotal, fiat_balance: newFiat }).eq('id', id);
      if (updateErr) throw new Error("Failed to update profile: " + updateErr.message);

      // 3. Insert Transaction Ledger
      const { error: txErr } = await supabase.from('transactions').insert({
        user_id: id,
        type: txType,
        amount: txAmount,
        value_usd: finalUsdAmount,
        asset: assetSymbol,
        status: 'Completed - ' + (deductionReason || 'System Update')
      });
      if (txErr) console.warn("Failed to insert transaction log (non-fatal):", txErr.message);

      // 4. Send Notification
      await supabase.from('notifications').insert({
        user_id: id,
        type: 'system',
        title: 'Balance Update',
        message: `Your account balance was updated by ${finalUsdAmount} (${deductionReason || 'System Action'})`,
        is_read: false
      });


      setUpdateStatus(`Success! Balance ${txAction} executed successfully.`);
      
      // Refresh user profile
      fetchUser();
      
      setTimeout(() => {
        setUpdateStatus('');
        setUsdAmount('');
        setCryptoAmount('');
        setDeductionReason('');
      }, 3000);
    } catch (err: any) {
      console.error("System Update Error:", err);
      alert("System Update Error: " + (err.message || err));
      setUpdateStatus(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
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
      status: 'open',
    });

    if (error) setReconStatus(`Error: ${error.message}`);
    else {
      setReconStatus('Issue pushed successfully!');
      setReconDesc('');
      fetchUserAndData();
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you SURE you want to completely delete this user and all associated data? This cannot be undone.")) return;
    
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id });
    if (error) {
      // Fallback: Delete profile only
      console.warn(error);
      const { error: profileErr } = await supabase.from('profiles').delete().eq('id', id);
      if (profileErr) {
         alert("Failed to delete user: " + profileErr.message);
      } else {
         alert("User profile deleted. (Run the SQL script to fully remove auth record).");
         window.location.href = '#/admin/users';
      }
    } else {
      alert("User account completely deleted.");
      window.location.href = '#/admin/users';
    }
  };

  const resolveReconIssue = async (issueId: string) => {
    await supabase.from('reconciliation_issues').update({ status: 'resolved' }).eq('id', issueId);
    fetchUserAndData();
  };

  const approveWallet = async (walletId: string) => {
    await supabase.from('wallets').update({ status: 'active' }).eq('id', walletId);
    fetchUserAndData();
  };

  const completeTaxReport = async (reportId: string) => {
    await supabase.from('tax_reports').update({ status: 'completed' }).eq('id', reportId);
    fetchUserAndData();
  };

  const pushWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalletStatusMsg('Adding...');
    const { error } = await supabase.from('wallets').insert({
      user_id: id,
      address_or_key: walletAddress,
      type: walletNetwork,
      name: walletLabel || walletNetwork + ' Wallet',
      balance: Number(walletBalance) || 0,
      status: 'active',
    });

    if (error) setWalletStatusMsg(`Error: ${error.message}`);
    else {
      setWalletStatusMsg('Wallet connected successfully!');
      setWalletAddress('');
      fetchUserAndData();
    }
  };

  const approveDocument = async (docId: string, sourceTable: string = 'user_documents') => {
    await supabase.from(sourceTable).update({ status: 'approved' }).eq('id', docId);
    
    // Only set KYC to approved if they've completed both, or maybe just approve it here. 
    // Usually NDA is user_documents, KYC is kyc_documents.
    await supabase.from('profiles').update({ kyc_status: 'approved' }).eq('id', id);
    fetchUserAndData();
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
      message,
    });
    form.reset();
    fetchUserAndData();
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-brand-purple" size={32} />
        <span className="text-sm font-bold text-gray-500">Loading user profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 font-bold mb-4">User account not found.</p>
        <Link to="/admin/users" className="px-4 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold">
          Return to User List
        </Link>
      </div>
    );
  }

  const userTotalUsd = Number(user.total_balance) || 0;
  const userBtcEquivalent = btcPrice > 0 ? userTotalUsd / btcPrice : 0;

  return (
    <div className="animate-fade-in pb-20">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-purple transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Users
      </Link>

      {/* Header Profile Summary */}
      <header className="mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-bold text-brand-dark">
              {user.first_name} {user.last_name}
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-purple/10 text-brand-purple">
              {user.plan || 'Standard'} Plan
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
              user.kyc_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              KYC {user.kyc_status || 'Pending'}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-700">
              {user.role}
            </span>
          </div>

          <p className="text-gray-500 text-sm font-mono mb-3">
            {user.email} • ID: {id} • Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>
          <button 
            onClick={toggleFreeze}
            className={`px-4 py-2 ${user?.is_frozen ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white font-bold rounded-xl text-sm transition-colors shadow-sm inline-flex items-center gap-2`}
          >
            <ShieldAlert size={16} /> {user?.is_frozen ? 'Unfreeze Account' : 'Freeze Account'}
          </button>
          <button 
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl text-sm hover:bg-red-600 hover:text-white transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Account
          </button>
        </div>

        {/* Live Total & BTC Equivalent Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <div className="pr-4 sm:border-r border-gray-200">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Balance (USD)</span>
            <span className="text-2xl font-display font-bold text-brand-dark">
              ${userTotalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
              <Bitcoin size={12} className="text-orange-500" /> BTC Live Equivalent
            </span>
            <span className="text-2xl font-display font-bold text-orange-600 font-mono">
              {userBtcEquivalent.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })} BTC
            </span>
          </div>
        </div>
      </header>

      {/* Admin Module Tabs (Streamlined to essential panels) */}
      <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-200 pb-px custom-scrollbar">
        {[
          { id: 'system', label: 'System Update & Balance', icon: Wallet, alert: true },
          { id: 'reconciliation', label: 'Reconciliation', icon: Activity, badge: reconIssues.filter(r => r.status === 'open').length },
          { id: 'wallets', label: 'Wallets', icon: Wallet },
          { id: 'transactions', label: 'Transactions Ledger', icon: History },
          { id: 'taxes', label: 'Tax Reports', icon: Receipt, badge: taxReports.filter(t => t.status === 'pending').length },
          { id: 'documents', label: 'KYC & Signatures', icon: FileText, badge: documents.filter(d => d.status === 'pending').length },
          { id: 'notifications', label: 'Push Notifications', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 -mb-px rounded-t-xl ${
              activeTab === tab.id
                ? 'border-brand-dark text-brand-dark bg-white shadow-sm'
                : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.badge ? (
              <span className="ml-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px]">
                {tab.badge}
              </span>
            ) : null}
            {!tab.badge && tab.alert && (
              <span className="w-2 h-2 rounded-full bg-green-500 ml-1"></span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 min-h-[450px]">
        
        {/* ========================================================= */}
        {/* TAB 1: SYSTEM UPDATE & DIRECT BTC BALANCE PROVISIONING   */}
        {/* ========================================================= */}
        {activeTab === 'system' && (
          <div className="animate-fade-in max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold font-display text-brand-dark">Provision Balance & System Updates</h2>
                <p className="text-sm text-gray-500 mt-1">Directly credit Bitcoin, cryptocurrency holdings, or fiat balances with live equivalent calculation.</p>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-2xl text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                BTC Live: <strong>${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setTxAction('credit');
                  setCryptoAmount('');
                  setUsdAmount('');
                  setMessageTitle(`${selectedAsset} Balance Credited`);
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  txAction === 'credit'
                    ? 'bg-orange-100 text-orange-700 shadow-sm ring-2 ring-orange-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <PlusCircle size={16} />
                Credit (Add)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTxAction('debit');
                  setCryptoAmount('');
                  setUsdAmount('');
                  setMessageTitle(`${selectedAsset} Balance Deduction`);
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  txAction === 'debit'
                    ? 'bg-red-100 text-red-700 shadow-sm ring-2 ring-red-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <MinusCircle size={16} />
                Debit (Deduct)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTxAction('set');
                  setCryptoAmount('');
                  setUsdAmount('');
                  setMessageTitle(`${selectedAsset} Balance Override`);
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  txAction === 'set'
                    ? 'bg-blue-100 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <RefreshCw size={16} />
                Set (Override)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTxAction('clear');
                  setCryptoAmount('0');
                  setUsdAmount('0');
                  setMessageTitle(`Balance Cleared`);
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  txAction === 'clear'
                    ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <MinusCircle size={16} />
                Clear All
              </button>
            </div>

            {/* Mode Selection: Crypto (BTC direct) vs Fiat */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setProvisionMode('crypto')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  provisionMode === 'crypto'
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-gray-500 hover:text-brand-dark'
                }`}
              >
                <Bitcoin size={16} className="text-orange-500" />
                Crypto Asset Balance (BTC Direct)
              </button>

              <button
                type="button"
                onClick={() => setProvisionMode('fiat')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  provisionMode === 'fiat'
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-gray-500 hover:text-brand-dark'
                }`}
              >
                <DollarSign size={16} className="text-green-600" />
                Direct Fiat Balance ({user?.preferred_currency || 'USD'})
              </button>
            </div>

            <form onSubmit={handleSystemUpdate} className="space-y-5">
              
              {provisionMode === 'crypto' && (
                <>
                  {/* Asset Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Cryptocurrency</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { symbol: 'BTC', name: 'Bitcoin' },
                        { symbol: 'ETH', name: 'Ethereum' },
                        { symbol: 'SOL', name: 'Solana' },
                        { symbol: 'USDT', name: 'Tether' },
                      ].map((item) => (
                        <button
                          key={item.symbol}
                          type="button"
                          onClick={() => handleAssetSelect(item.symbol)}
                          className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                            selectedAsset === item.symbol
                              ? 'border-brand-dark bg-gray-50 ring-2 ring-brand-dark/10'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <CoinLogo symbol={item.symbol} size="md" />
                          <div>
                            <p className="font-bold text-xs text-brand-dark">{item.symbol}</p>
                            <p className="text-[10px] text-gray-500 font-mono">${getPrice(item.symbol, btcPrice).toLocaleString()}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dual Synchronized Inputs: BTC Quantity & USD Value */}
                  {txAction !== 'clear' && (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border ${txAction === 'credit' ? 'bg-orange-50/50 border-orange-100' : txAction === 'set' ? 'bg-blue-50/50 border-blue-100' : 'bg-red-50/50 border-red-100'}`}>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                        <span>Direct {selectedAsset} Amount to {txAction === 'credit' ? 'Add' : 'Deduct'}*</span>
                        <span className={`text-[10px] font-mono ${txAction === 'credit' ? 'text-orange-600' : 'text-red-600'}`}>1 {selectedAsset} = ${getPrice(selectedAsset, btcPrice).toLocaleString()}</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={cryptoAmount}
                          onChange={(e) => handleCryptoChange(e.target.value)}
                          placeholder="e.g. 0.45"
                          className="w-full pl-4 pr-16 py-3 bg-white border border-gray-200 rounded-xl text-base font-bold font-mono focus:outline-none focus:border-brand-dark focus:ring-1 focus:ring-brand-dark"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-mono">
                          {selectedAsset}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                        <span>USD Equivalent Value*</span>
                        <span className="text-[10px] text-gray-500 font-mono">Auto-Calculated</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={usdAmount}
                        onChange={(e) => handleUsdChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple font-mono font-bold"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  </div>
                )}
                </>
              )}

              {provisionMode === 'fiat' && txAction !== 'clear' && (
                <div className={`p-5 rounded-2xl border ${txAction === 'credit' ? 'bg-green-50/50 border-green-100' : txAction === 'set' ? 'bg-blue-50/50 border-blue-100' : 'bg-red-50/50 border-red-100'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Direct Fiat Balance to {txAction === 'credit' ? 'Add' : 'Deduct'} ({user?.preferred_currency || 'USD'})*
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={usdAmount}
                          onChange={(e) => handleUsdChange(e.target.value, 'USD')}
                          placeholder="e.g. 25000.00"
                          className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-bold font-mono focus:outline-none focus:border-brand-dark"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Live BTC Equivalent
                      </label>
                      <div className={`py-3 px-4 bg-white border border-gray-200 rounded-xl text-base font-bold font-mono ${txAction === 'credit' ? 'text-orange-600' : 'text-red-600'}`}>
                        {usdAmount && btcPrice > 0 
                          ? `${(parseFloat(usdAmount) / btcPrice).toFixed(6)} BTC`
                          : '0.000000 BTC'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Deduction Reason (if debiting) */}
              {txAction === 'debit' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Reason for Deduction</label>
                  <select
                    value={deductionReason}
                    onChange={(e) => {
                      setDeductionReason(e.target.value);
                      if (txAction === 'debit' && !messageBody.includes('credited')) {
                        setMessageBody(`A deduction has been processed. Reason: ${e.target.value}`);
                      }
                    }}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                  >
                    <option value="Transfer Out">Transfer Out to External Wallet</option>
                    <option value="Network Fee Deduction">Network Fee Deduction</option>
                    <option value="Security Service Fee">Security Service Fee</option>
                    <option value="Correction">Balance Correction</option>
                    <option value="Liquidation">Asset Liquidation</option>
                  </select>
                </div>
              )}

              {/* Transaction Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Transaction Ledger Timestamp*</label>
                  <input
                    type="datetime-local"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Push Notification Title</label>
                  <input
                    type="text"
                    required
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notification Message for User</label>
                <textarea
                  rows={2}
                  required
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                ></textarea>
              </div>

              {updateStatus && (
                <div
                  className={`p-4 text-sm font-bold rounded-2xl flex items-center gap-2 ${
                    updateStatus.includes('Success')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {updateStatus.includes('Success') ? <CheckCircle size={18} /> : null}
                  {updateStatus}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-brand-dark text-white font-bold rounded-2xl text-sm hover:bg-black transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  Execute {txAction === 'credit' ? 'Credit' : txAction === 'debit' ? 'Deduction' : txAction === 'set' ? 'Override' : 'Wipe'}
                </button>
              </div>
            </form>

            {/* Profit Rate Growth Configuration */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-600" />
                <h3 className="text-lg font-bold text-brand-dark">Active Growth / Profit Rate</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">Dictates the simulated real-time annualized yield increment displayed on the user's dashboard balance.</p>

              <form onSubmit={handleUpdateProfitRate} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Profit Rate Percentage (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={profitRate}
                      onChange={(e) => setProfitRate(e.target.value)}
                      placeholder="e.g. 8.5"
                      className="w-full pl-4 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold font-mono focus:outline-none focus:border-brand-dark"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingProfit}
                  className="px-6 py-3 bg-brand-purple text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingProfit ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save Profit Rate
                </button>
              </form>

              {profitSuccessMsg && (
                <div className="mt-3 text-xs font-bold text-green-600 flex items-center gap-1.5">
                  <CheckCircle size={14} /> {profitSuccessMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RECONCILIATION ISSUES & ASSESSMENTS                */}
        {/* ========================================================= */}
        {activeTab === 'reconciliation' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-2">Push Forensic Assessment</h2>
              <p className="text-sm text-gray-500 mb-6">Input on-chain assessment flags and resolution requirements for the user's dashboard.</p>

              <form onSubmit={pushReconIssue} className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Issue Classification</label>
                    <select
                      value={reconType}
                      onChange={(e) => setReconType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                    >
                      <option>Missing Cost Basis</option>
                      <option>Unconfirmed UTXO</option>
                      <option>Suspicious Bridge Transfer</option>
                      <option>Missing Tax ID Verification</option>
                      <option>Smart Contract Freeze Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Asset Symbol</label>
                    <input
                      type="text"
                      value={reconAsset}
                      onChange={(e) => setReconAsset(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Amount / Flagged Value</label>
                  <input
                    type="text"
                    value={reconAmount}
                    onChange={(e) => setReconAmount(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Forensic Note</label>
                  <textarea
                    rows={3}
                    value={reconDesc}
                    onChange={(e) => setReconDesc(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                  ></textarea>
                </div>

                {reconStatus && (
                  <div className={`p-3 text-xs font-bold rounded-xl ${reconStatus.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {reconStatus}
                  </div>
                )}

                <button type="submit" className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl text-sm hover:bg-black transition-colors">
                  Push Assessment to User
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-4">Active & Resolved Records</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {reconIssues.map((issue) => (
                  <div key={issue.id} className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${issue.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {issue.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{issue.type}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-brand-dark text-sm mb-1">{issue.issue_desc}</p>
                    <p className="text-xs text-brand-purple font-mono font-bold">{issue.amount} ({issue.asset})</p>
                    {issue.status === 'open' && (
                      <div className="flex justify-end pt-3 border-t border-gray-100 mt-3">
                        <button
                          onClick={() => resolveReconIssue(issue.id)}
                          className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-lg hover:bg-green-100 flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Mark as Resolved
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

        {/* ========================================================= */}
        {/* TAB 3: WALLETS                                            */}
        {/* ========================================================= */}
        {activeTab === 'wallets' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-4">Connect Cold/Hot Wallet</h2>
              <form onSubmit={pushWallet} className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Public Address / Key*</label>
                  <input
                    type="text"
                    required
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="e.g. bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Network</label>
                    <select
                      value={walletNetwork}
                      onChange={(e) => setWalletNetwork(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                    >
                      <option>Bitcoin</option>
                      <option>Ethereum</option>
                      <option>Solana</option>
                      <option>Tron</option>
                      <option>Polygon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Wallet Label</label>
                    <input
                      type="text"
                      value={walletLabel}
                      onChange={(e) => setWalletLabel(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>

                {walletStatusMsg && (
                  <div className={`p-3 text-xs font-bold rounded-xl ${walletStatusMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {walletStatusMsg}
                  </div>
                )}

                <button type="submit" className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl text-sm hover:bg-black transition-colors">
                  Assign Wallet to Account
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-bold text-brand-dark mb-4">Assigned Wallets</h2>
              <div className="space-y-3">
                {wallets.map((w) => (
                  <div key={w.id} className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-brand-dark text-sm">{w.name}</p>
                        {w.status === 'pending' && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">PENDING</span>}
                        {w.status === 'active' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">ACTIVE</span>}
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        {(w.address_or_key || '').substring(0, 10)}...{(w.address_or_key || '').substring((w.address_or_key || '').length - 8)}
                      </p>
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

        {/* ========================================================= */}
        {/* TAB 4: TRANSACTIONS LEDGER                                */}
        {/* ========================================================= */}
        {activeTab === 'transactions' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-brand-dark mb-6">User Transaction Ledger</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Amount / Asset</th>
                    <th className="px-6 py-4 font-medium">USD Value</th>
                    <th className="px-6 py-4 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-dark capitalize">
                        <span className={`px-2.5 py-1 rounded-full text-xs ${
                          tx.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold font-mono text-brand-dark">{tx.amount}</p>
                        <p className="text-xs text-gray-500 uppercase">{tx.asset}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm font-bold text-gray-700">
                        ${Number(tx.value_usd || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-gray-500 font-mono">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No transactions recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: TAX REPORTS                                        */}
        {/* ========================================================= */}
        {activeTab === 'taxes' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">User Tax Reports & Filings</h2>
            <div className="space-y-3">
              {taxReports.map((t) => (
                <div key={t.id} className="p-4 border border-gray-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-dark">Tax Year {t.tax_year}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">Requested: {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.status === 'pending' ? (
                      <>
                        <span className="text-xs font-bold px-2.5 py-1 rounded bg-orange-100 text-orange-700">PENDING</span>
                        <button onClick={() => completeTaxReport(t.id)} className="px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded-xl hover:bg-black transition-colors">
                          Mark as Completed
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle size={14} /> COMPLETED
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {taxReports.length === 0 && <p className="text-sm text-gray-500">No tax reports requested by this user.</p>}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: KYC & DOCUMENTS                                    */}
        {/* ========================================================= */}
        {activeTab === 'documents' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">KYC Verifications & E-Signatures</h2>
            <div className="space-y-4">
              {documents.map((d) => (
                <div key={d.id} className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-dark uppercase">{d.document_type?.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">Submitted: {new Date(d.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${d.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {d.status?.toUpperCase()}
                      </span>
                      {d.status === 'pending' && (
                        <button onClick={() => approveDocument(d.id, d.source_table)} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors">
                          Approve KYC Document
                        </button>
                      )}
                    </div>
                  </div>
                  {d.signature_data && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase">E-Signature Artifact</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 inline-block">
                        <img src={d.signature_data} alt="Signature" className="max-h-24 mix-blend-multiply" />
                      </div>
                    </div>
                  )}
                  {d.document_url && (
                    <div className="mt-4 border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Front ID</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 h-40 flex items-center justify-center overflow-hidden">
                          <img src={d.document_url} alt="ID Front" className="max-h-full max-w-full object-contain" />
                        </div>
                      </div>
                      {d.document_back_url && (
                        <div>
                          <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Back ID</p>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 h-40 flex items-center justify-center overflow-hidden">
                            <img src={d.document_back_url} alt="ID Back" className="max-h-full max-w-full object-contain" />
                          </div>
                        </div>
                      )}
                      {d.selfie_url && (
                        <div>
                          <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Selfie</p>
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 h-40 flex items-center justify-center overflow-hidden">
                            <img src={d.selfie_url} alt="Selfie" className="max-h-full max-w-full object-contain" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {documents.length === 0 && <p className="text-sm text-gray-500">No KYC documents submitted.</p>}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PUSH NOTIFICATIONS                                 */}
        {/* ========================================================= */}
        {activeTab === 'notifications' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Push Custom Client Notification</h2>
            <form onSubmit={pushNotification} className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notification Title*</label>
                <input name="title" type="text" required placeholder="e.g. Urgent Security Advisory" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Message Body*</label>
                <textarea name="message" required rows={3} placeholder="Notification body..." className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-dark"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-brand-dark text-white font-bold rounded-xl text-sm hover:bg-black transition-colors shadow-sm">
                  Send to Client
                </button>
              </div>
            </form>

            <h3 className="font-bold text-brand-dark mb-4">Notification History</h3>
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white">
                  <div>
                    <p className="font-bold text-sm text-brand-dark">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">{new Date(n.created_at).toLocaleDateString()}</span>
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
