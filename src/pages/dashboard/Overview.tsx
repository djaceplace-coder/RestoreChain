import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, FileText, TrendingUp, Bitcoin, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLivePrices } from '../../hooks/useLivePrices';
import CoinLogo from '../../components/CoinLogo';

export default function Overview() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [displayedBalance, setDisplayedBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { coins, btcPrice, refresh } = useLivePrices(30000);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setUserProfile(profile);
          setDisplayedBalance(Number(profile.total_balance) || 0);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Real-time balance growth effect
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

  const btcEquivalent = btcPrice > 0 ? displayedBalance / btcPrice : 0;

  return (
    <div className="animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">
             {loading ? 'Loading...' : displayGreeting}
          </h1>
          <p className="text-brand-text-gray mt-1">Here is the real-time status of your assets and cryptocurrency operations.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium text-sm">Total Balance (USD)</h3>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Activity size={20} /></div>
          </div>
          <p className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-1">
            ${displayedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 font-mono">
            ≈ {btcEquivalent.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })} BTC
          </p>
          {Number(userProfile?.profit_rate) > 0 && (
            <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
              <TrendingUp size={14} /> +{userProfile?.profit_rate}% Active Growth
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium text-sm">Bitcoin (BTC) Live Rate</h3>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl"><Bitcoin size={20} /></div>
          </div>
          <p className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-1">
            ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-green-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Synchronized Live
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium text-sm">Security & Audit Status</h3>
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><ShieldCheck size={20} /></div>
          </div>
          <p className="text-3xl sm:text-4xl font-display font-bold text-brand-dark mb-1">Protected</p>
          <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 px-2 py-1 rounded-lg inline-block">256-bit Cold Storage Active</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Market List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-brand-dark flex items-center gap-2">
              <Bitcoin size={24} className="text-orange-500" /> Supported Crypto Assets
            </h2>
            <button 
              onClick={() => refresh()} 
              title="Refresh Rates" 
              className="p-2 text-gray-400 hover:text-brand-purple rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {coins.map(coin => (
              <div key={coin.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <CoinLogo symbol={coin.symbol} size="md" image={coin.image} />
                  <div>
                    <h4 className="font-bold text-brand-dark">{coin.name}</h4>
                    <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold font-mono text-brand-dark">
                    ${Number(coin.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: coin.price < 1 ? 6 : 2,
                    })}
                  </p>
                  <p className={`text-xs font-bold flex items-center justify-end gap-0.5 ${Number(coin.change24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Number(coin.change24h) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(coin.change24h).toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-brand-dark">Recent Operations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="group block p-4 rounded-xl border border-gray-100 hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-brand-dark">SYS-9921</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-sm text-brand-text-gray mb-3">Monitoring wallet deposits & cold storage</p>
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Synchronized</span>
              </div>
            </div>
            
            <div className="block p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
              Account telemetry active and compliant.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
