import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, ShieldCheck, Loader2, Plus, Download, Wallet, ArrowRight, Building, Globe, Copy, Check, Repeat } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AddAssetModal from '../../components/AddAssetModal';
import ConnectWalletModal from "../../components/ConnectWalletModal";
import CoinLogo from '../../components/CoinLogo';
import { COINS } from '../../data/coins';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState('1M');
  const [assets, setAssets] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  const [isConnectWalletOpen, setIsConnectWalletOpen] = useState(false);
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

      // Fetch portfolios (try portfolios table, fallback to assets table)
      let { data: userPortfolios, error: pErr } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id);
        
      if (pErr || !userPortfolios) {
        const { data: fallbackAssets } = await supabase
          .from('assets')
          .select('*')
          .eq('user_id', user.id);
        userPortfolios = fallbackAssets || [];
      }
      setAssets(userPortfolios);

      const { data: wData } = await supabase.from("wallet_connections").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (wData) setWallets(wData);
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
    <div className="animate-fade-in pb-12 space-y-8">
      <ConnectWalletModal isOpen={isConnectWalletOpen} onClose={() => setIsConnectWalletOpen(false)} onSuccess={() => window.location.reload()} />
      {isFundModalOpen && <FundModal onClose={() => setIsFundModalOpen(false)} user={user} />}
      {isWithdrawModalOpen && <WithdrawModal onClose={() => setIsWithdrawModalOpen(false)} user={user} />}

      {/* Dynamic Greeting */}
      <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">{displayGreeting}</h1>

      {/* Total Balance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Balance</h2>
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
            {showBalance ? `$${displayedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {Number(userProfile?.profit_rate) > 0 ? (
               <span className="flex items-center text-sm font-bold text-green-500">
                 <ArrowUpRight size={16} /> +{userProfile?.profit_rate}% Active Growth
               </span>
            ) : (
               <span className="flex items-center text-sm font-bold text-green-500">
                 <ArrowUpRight size={16} /> $0.00 (0.0%)
               </span>
            )}
            <span className="text-sm text-gray-500">Live Updating</span>
          </div>
        </div>

        {/* Mid-sized Swap Button to the right of balance */}
        <Link 
          to="/dashboard/swap" 
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 self-start sm:self-center"
        >
          <Repeat size={18} />
          <span>Swap Assets</span>
        </Link>
      </div>
      
      {/* Top Action Buttons: Add Funds & Withdraw */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        <button onClick={() => setIsFundModalOpen(true)} className="p-4 bg-brand-purple text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-purple-700 transition-colors shadow-md group">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Plus size={20} />
          </div>
          <span className="font-bold text-base">Add Funds</span>
        </button>
        <button onClick={() => setIsWithdrawModalOpen(true)} className="p-4 bg-white border border-gray-200 text-brand-dark rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm group">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Download size={20} />
          </div>
          <span className="font-bold text-base">Withdraw</span>
        </button>
      </div>

      {/* Your Portfolios Section with Add Portfolio button */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <Wallet size={20} />
            </div>
            <h2 className="text-lg font-bold font-display text-brand-dark">Your Portfolios</h2>
          </div>
          <button 
            onClick={() => setIsConnectWalletOpen(true)} 
            className="px-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Connect Wallet
          </button>
        </div>
        <div className="overflow-x-auto">
          {assets.length === 0 ? ( 
             <div className="p-10 text-center text-gray-500 flex flex-col items-center justify-center">
               <Wallet size={40} className="text-gray-300 mb-3" />
               <p className="text-sm font-medium">No portfolios recorded yet.</p>
               <button 
                 onClick={() => setIsConnectWalletOpen(true)}
                 className="mt-3 px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors"
               >
                 + Connect First Wallet
               </button>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Portfolio Asset</th>
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
                        <CoinLogo symbol={asset.symbol} size="md" />
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
                      <p className="font-medium text-brand-dark">${asset.balance > 0 ? (asset.value / asset.balance).toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-brand-dark">${Number(asset.value || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Connected Wallets / Exchanges */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-bold font-display text-brand-dark">Connected Web3 & Exchanges</h2>
          </div>
          <button 
            onClick={() => setIsConnectWalletOpen(true)} 
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> New Connection
          </button>
        </div>
        <div className="p-0">
          {wallets.length === 0 ? (
             <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center">
               <Globe size={40} className="text-gray-300 mb-3" />
               <p className="text-sm font-medium">No external wallets or exchanges connected.</p>
               <button onClick={() => setIsConnectWalletOpen(true)} className="mt-3 px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded-xl hover:bg-black transition-colors">
                 Securely Connect Account
               </button>
             </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {wallets.map(w => (
                <div key={w.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-sm">
                      {w.wallet_provider === 'metamask' ? '🦊' : w.wallet_provider === 'binance' ? '🟨' : w.wallet_provider === 'ledger' ? '🔐' : '🛡️'}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-dark capitalize">{w.wallet_provider.replace('_', ' ')}</h4>
                      <p className="text-xs text-gray-500 font-medium capitalize">{w.wallet_type} Connection &bull; Read-Only</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                       <p className="text-sm font-bold text-gray-700">Status: <span className="text-green-600">Active</span></p>
                       <p className="text-xs text-gray-400">Syncing live</p>
                    </div>
                    <div className="bg-green-100 text-green-700 p-2 rounded-full">
                       <Check size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Recent Transactions (Last 3) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-brand-dark">Recent Transactions</h2>
          <Link to="/dashboard/transactions" className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No recent transactions.</div>
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
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${tx.type === 'deposit' ? 'bg-green-100 text-green-700' : tx.type === 'withdrawal' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {tx.type ? tx.type.toUpperCase() : 'TRANSFER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-dark">
                      {Number(tx.amount || 0).toLocaleString(undefined, {style: 'currency', currency: 'USD'})}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{tx.asset || 'USD'}</td>
                    <td className="px-6 py-4 text-right text-gray-500 text-sm">{new Date(tx.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Complete Supported Crypto Portfolios List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-brand-dark">Supported Crypto Portfolios</h2>
            <p className="text-xs text-gray-500">Live cryptocurrency rates & supported tracking assets</p>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {COINS.map(coin => (
            <div key={coin.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <CoinLogo symbol={coin.symbol} size="md" />
                <div>
                  <p className="font-bold text-brand-dark text-md">{coin.name}</p>
                  <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
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

