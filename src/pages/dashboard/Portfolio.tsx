import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, ShieldCheck, Loader2, Plus, Download, Wallet, ArrowRight, Building, Globe, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddAssetModal from '../../components/AddAssetModal';
import { COINS } from '../../data/coins';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState('1M');
  const [assets, setAssets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets'>('overview');
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    } else {
      alert("To install on iOS: Tap the Share button at the bottom, then select 'Add to Home Screen'. \n\nOn Android: Tap the 3 dots menu and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    init();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Fetch profile total balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profile) {
        setUserProfile(profile);
        setTotalValue(Number(profile.total_balance || 0));
        if (displayedBalance === 0) setDisplayedBalance(Number(profile.total_balance || 0));
      }

      // Fetch assets
      const { data: userAssets } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id);
        
      if (userAssets) setAssets(userAssets);

      // Fetch recent txs
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (txs) setTransactions(txs);

      setLoading(false);
    };
    fetchData();

    const channel = supabase.channel('portfolio_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets', filter: `user_id=eq.${user.id}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  
  useEffect(() => {
    if (!userProfile) return;
    const profitRate = Number(userProfile.profit_rate) || 0;
    if (profitRate <= 0) return;

    const interval = setInterval(() => {
      setDisplayedBalance(prev => {
        const incrementFactor = (profitRate / 100) * (Math.random() * 0.0001); 
        const minIncrement = prev > 0 ? 0.01 : 0;
        return prev + (prev * incrementFactor) + minIncrement;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [userProfile]);

  const greetingName = userProfile?.last_name || userProfile?.first_name || 'User';
  const displayGreeting = userProfile?.last_name ? `Welcome, ${userProfile.last_name}` : `Hello, ${greetingName}`;

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>;

  return (
    <div className="animate-fade-in pb-12">
      <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} />
      {isFundModalOpen && <FundModal onClose={() => setIsFundModalOpen(false)} user={user} />}
      {isWithdrawModalOpen && <WithdrawModal onClose={() => setIsWithdrawModalOpen(false)} user={user} />}

      
      {/* Dynamic Greeting */}
      <h1 className="text-3xl font-display font-bold text-brand-dark mb-6">{displayGreeting}</h1>
      
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'overview' ? 'text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Overview
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('assets')}
          className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === 'assets' ? 'text-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Assets
          {activeTab === 'assets' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple rounded-t-full"></div>}
        </button>
      </div>

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
          <div className="text-3xl md:text-5xl font-display font-bold text-brand-dark">
            {showBalance ? `${displayedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {Number(userProfile?.profit_rate) > 0 ? (
               <span className="flex items-center text-sm font-bold text-green-500">
                 <ArrowUpRight size={16} /> +${user?.profit_rate}% Active Growth
               </span>
            ) : (
               <span className="flex items-center text-sm font-bold text-green-500">
                 <ArrowUpRight size={16} /> $0.00 (0.0%)
               </span>
            )}
            <span className="text-sm text-gray-500">Live Updating</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <button onClick={() => setIsFundModalOpen(true)} className="p-4 bg-brand-purple text-white rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-purple-700 transition-colors shadow-md group">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={20} />
          </div>
          <span className="font-bold text-sm text-center">Add Funds</span>
        </button>
        <button onClick={() => setIsWithdrawModalOpen(true)} className="p-4 bg-white border border-gray-200 text-brand-dark rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download size={20} />
          </div>
          <span className="font-bold text-sm text-center">Withdraw</span>
        </button>
        <button onClick={() => setIsAddAssetOpen(true)} className="p-4 bg-white border border-gray-200 text-brand-dark rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet size={20} />
          </div>
          <span className="font-bold text-sm text-center">Add Asset</span>
        </button>
      </div>

      
      {activeTab === 'overview' ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-brand-dark">Supported Crypto Assets</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
            {COINS.map(coin => (
              <div key={coin.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-600">
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark text-md">{coin.name}</p>
                    <p className="text-xs text-gray-500">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-dark text-md">${coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</p>
                  <div className={`text-xs font-bold flex items-center justify-end gap-1 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(coin.change24h)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-brand-dark">Your Assets</h2>
              </div>
              <div className="overflow-x-auto">
                {assets.length === 0 ? ( 
                   <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                     <Wallet size={48} className="text-gray-300 mb-4" />
                     <p>No assets found. Click 'Add Asset' to start building your portfolio.</p>
                   </div>
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
                              <div className={`w-10 h-10 rounded-full ${asset.color || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-xs`}>
                                {asset.symbol[0]}
                              </div>
                              <div>
                                <p className="font-bold text-brand-dark">{asset.name}</p>
                                <p className="text-xs text-gray-500">{asset.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-bold text-brand-dark">{asset.balance} {asset.symbol}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-medium text-brand-dark">${(asset.value / asset.balance).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-bold text-brand-dark">${asset.value.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
                        </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-brand-dark">Recent Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                {transactions.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">No recent transactions.</div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Type</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Asset</th>
                        <th className="px-6 py-4 font-medium text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.slice(0, 3).map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${tx.type === 'deposit' ? 'bg-green-100 text-green-700' : tx.type === 'withdrawal' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {tx.type ? tx.type.toUpperCase() : 'TRANSFER'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-dark">
                            {Number(tx.amount).toLocaleString(undefined, {style: 'currency', currency: 'USD'})}
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{tx.asset}</td>
                          <td className="px-6 py-4 text-right text-gray-500 text-sm">{new Date(tx.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ---- Modals ----

function FundModal({ onClose, user }: { onClose: () => void, user: any }) {
  const [method, setMethod] = useState<'crypto'>('crypto');
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState('');

  const submitFundRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 3000);
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-display text-brand-dark">Add Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" /></button>
        </div>
        
        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Request Submitted</h3>
            <p className="text-gray-500">Your deposit instruction has been recorded. Admin will credit your account once funds clear.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Select Asset</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple">
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                    <option>USDC (ERC-20)</option>
                    <option>USDT (TRC-20)</option>
                  </select>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center">
                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x1234567890abcdef1234567890abcdef12345678" alt="QR" className="mx-auto mb-4 rounded-lg mix-blend-multiply" />
                   <p className="text-xs font-bold text-gray-500 uppercase mb-1">Deposit Address</p>
                   <div className="flex items-center justify-center gap-2">
                     <code className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded">0x123...5678</code>
                     <button className="p-1.5 text-gray-400 hover:text-brand-purple bg-white border border-gray-200 rounded"><Copy size={16}/></button>
                   </div>
                </div>
                <button onClick={submitFundRequest} className="w-full py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors mt-2">I have sent the crypto</button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WithdrawModal({ onClose, user }: { onClose: () => void, user: any }) {
  const [method, setMethod] = useState<'crypto'>('crypto');
  const [submitted, setSubmitted] = useState(false);

  const submitWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 3000);
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold font-display text-brand-dark">Withdraw Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Plus className="rotate-45" /></button>
        </div>
          
        {submitted ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Withdrawal Pending</h3>
            <p className="text-gray-500">Your withdrawal request is under review. Our administration team will process it shortly.</p>
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={submitWithdrawRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Asset</label>
                <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple">
                  <option>USDC</option>
                  <option>USDT</option>
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Destination Address</label>
                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple" placeholder="0x..." />
              </div>
               
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input type="number" required className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple" placeholder="0.00" />
                </div>
              </div>
               
              <button type="submit" className="w-full py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors mt-2">Submit Request</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

