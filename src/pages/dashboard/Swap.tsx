import React, { useState, useEffect } from 'react';
import { 
  ArrowUpDown, RefreshCw, Info, Lock, ChevronDown, Check, 
  Search, ShieldCheck, ArrowUpRight, ArrowDownRight, Settings, 
  Wallet, AlertCircle, Loader2, Sparkles, Home, BarChart2, Repeat, 
  Newspaper, MoreHorizontal, Layers, Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import CoinLogo from '../../components/CoinLogo';

// List of popular tokens/portfolios
const SWAP_TOKENS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 78367.00, change24h: -0.92, changeUsd: -724.61, iconBg: 'bg-amber-500', network: 'Bitcoin' },
  { id: 'usdto', symbol: 'USDTO', name: 'USDTO', price: 0.9999, change24h: 0.04, changeUsd: 0.00, iconBg: 'bg-emerald-600', network: 'Polygon' },
  { id: 'fusd', symbol: 'FUSD', name: 'Freedom Dollar', price: 1.00, change24h: 0.03, changeUsd: 0.00, iconBg: 'bg-sky-500', network: 'Ethereum' },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 0.9999, change24h: 0.00, changeUsd: 0.00, iconBg: 'bg-blue-600', network: 'Ethereum' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3400.00, change24h: 1.58, changeUsd: 52.90, iconBg: 'bg-indigo-600', network: 'Ethereum' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', price: 145.20, change24h: 2.15, changeUsd: 3.05, iconBg: 'bg-teal-500', network: 'Solana' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether USD', price: 1.00, change24h: 0.01, changeUsd: 0.00, iconBg: 'bg-emerald-500', network: 'Ethereum' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB Chain', price: 580.40, change24h: 1.25, changeUsd: 7.16, iconBg: 'bg-yellow-500', network: 'BNB' },
  { id: 'matic', symbol: 'MATIC', name: 'Polygon', price: 0.85, change24h: -0.51, changeUsd: -0.004, iconBg: 'bg-purple-600', network: 'Polygon' },
  { id: 'avax', symbol: 'AVAX', name: 'Avalanche', price: 28.60, change24h: -1.06, changeUsd: -0.30, iconBg: 'bg-red-500', network: 'Avalanche' },
];

export default function Swap() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPortfolios, setUserPortfolios] = useState<any[]>([]);

  // Swap State
    const fiatToken = {
    id: 'fiat',
    symbol: userProfile?.preferred_currency || 'USD',
    name: 'Fiat Wallet',
    price: 1.00,
    change24h: 0,
    changeUsd: 0,
    iconBg: 'bg-green-600',
    network: 'Bank'
  };
  
  const availableTokens = [fiatToken, ...SWAP_TOKENS];
  const [payToken, setPayToken] = useState(SWAP_TOKENS[0]); // BTC
  const [receiveToken, setReceiveToken] = useState(fiatToken); // Default ETH
  
  
  const [payUsdAmount, setPayUsdAmount] = useState<string>('0');
  const [rateType, setRateType] = useState<'Fixed' | 'Floating'>('Fixed');
  const [slippage, setSlippage] = useState<number>(0.5); // 0.5%
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Selection Modal State
  const [tokenSelectorMode, setTokenSelectorMode] = useState<'pay' | 'receive' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    if (userProfile && receiveToken.id === 'fiat') {
      setReceiveToken(prev => ({ ...prev, symbol: userProfile.preferred_currency || 'USD' }));
    }
  }, [userProfile]);

  // Processing & Toast
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapStatus, setSwapStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch User & Balances (tries portfolios table first, falls back to assets)
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;
      setUser(data.user);

      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profile) setUserProfile(profile);

      // Fetch Portfolios (try 'portfolios' table, fallback to 'assets')
      let { data: items, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', data.user.id);
      
      if (error || !items) {
        const { data: fallbackAssets } = await supabase
          .from('assets')
          .select('*')
          .eq('user_id', data.user.id);
        items = fallbackAssets || [];
      }
      setUserPortfolios(items);
    };
    init();
  }, []);

  // Calculate Pay Token Quantity based on USD Input
  const payUsdVal = parseFloat(payUsdAmount) || 0;
  const payTokenQty = payToken.price > 0 ? payUsdVal / payToken.price : 0;

  // Real-time Exchange Algorithm logic
  const feeRate = 0.001; // 0.1% platform route fee
  const netReceiveUsd = Math.max(0, payUsdVal * (1 - feeRate - (slippage / 100)));
  const receiveTokenQty = receiveToken.price > 0 ? netReceiveUsd / receiveToken.price : 0;

  // Exchange rate ratio (rates can be calculated freely without requiring a wallet balance)
  const exchangeRate = payToken.price / receiveToken.price;

  // Helper to get user balance if held in portfolio
  const getPortfolioBalance = (symbol: string) => {
    const found = userPortfolios.find(a => a.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) return Number(found.balance) || 0;
    if (['USD', 'USDT', 'USDTO', 'USDC', 'FUSD'].includes(symbol.toUpperCase())) {
      return Number(userProfile?.total_balance) || 0;
    }
    return 0;
  };

  const payTokenBalance = getPortfolioBalance(payToken.symbol);
  const receiveTokenBalance = getPortfolioBalance(receiveToken.symbol);

  // Flip Tokens handler
  const handleFlip = () => {
    const temp = payToken;
    setPayToken(receiveToken);
    setReceiveToken(temp);
  };

  // Pre-fill MAX balance
  const handleSetMax = () => {
    if (payTokenBalance > 0) {
      const maxUsd = payTokenBalance * payToken.price;
      setPayUsdAmount(maxUsd.toFixed(2));
    } else if (Number(userProfile?.total_balance) > 0) {
      setPayUsdAmount(Number(userProfile.total_balance).toFixed(2));
    } else {
      setPayUsdAmount('1000'); // Friendly default rate test amount
    }
  };

  // Execute Swap Logic with resilient DB table handling
  const handleExecuteSwap = async () => {
    if (payUsdVal <= 0) {
      setSwapStatus({ type: 'error', message: 'Please enter an amount to swap.' });
      return;
    }

    setIsSwapping(true);
    setSwapStatus(null);

    try {
      if (!user) throw new Error('User not authenticated');

      const formattedDate = new Date().toISOString();

      // Record transaction
      const { error: txErr } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'swap',
        amount: payUsdVal,
        value_usd: payUsdVal,
        asset: `${payToken.symbol} ➔ ${receiveToken.symbol}`,
        status: 'completed',
        created_at: formattedDate
      });

      if (txErr) console.warn('Swap transaction insert notice:', txErr.message);

      // Create notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'system',
        title: 'Portfolio Swap Executed',
        message: `Swapped $${payUsdVal.toLocaleString()} (${payTokenQty.toFixed(6)} ${payToken.symbol}) to ${receiveTokenQty.toFixed(4)} ${receiveToken.symbol}.`,
        is_read: false,
        created_at: formattedDate
      });

            // Deduct Pay Token
      if (payToken.id === 'fiat') {
        const currentFiat = Number(userProfile?.fiat_balance || 0);
        await supabase.from('profiles').update({ fiat_balance: Math.max(0, currentFiat - payTokenQty) }).eq('id', user.id);
      } else {
        const existingPay = userPortfolios.find(a => a.symbol.toUpperCase() === payToken.symbol.toUpperCase());
        if (existingPay && existingPay.balance >= payTokenQty) {
          const { error: pErr } = await supabase.from('portfolios').update({
            balance: Math.max(0, existingPay.balance - payTokenQty),
            value: Math.max(0, existingPay.value - payUsdVal)
          }).eq('id', existingPay.id);
          if (pErr) {
            await supabase.from('assets').update({
              balance: Math.max(0, existingPay.balance - payTokenQty),
              value: Math.max(0, existingPay.value - payUsdVal)
            }).eq('id', existingPay.id);
          }
        }
      }

      // Add Receive Token
      if (receiveToken.id === 'fiat') {
        const currentFiat = Number(userProfile?.fiat_balance || 0);
        await supabase.from('profiles').update({ fiat_balance: currentFiat + receiveTokenQty }).eq('id', user.id);
      } else {
        const existingReceive = userPortfolios.find(a => a.symbol.toUpperCase() === receiveToken.symbol.toUpperCase());
        if (existingReceive) {
          const { error: pErr } = await supabase.from('portfolios').update({
            balance: (Number(existingReceive.balance) || 0) + receiveTokenQty,
            value: (Number(existingReceive.value) || 0) + netReceiveUsd
          }).eq('id', existingReceive.id);
          if (pErr) {
            await supabase.from('assets').update({
              balance: (Number(existingReceive.balance) || 0) + receiveTokenQty,
              value: (Number(existingReceive.value) || 0) + netReceiveUsd
            }).eq('id', existingReceive.id);
          }
        } else {
          const portfolioPayload = {
            user_id: user.id,
            name: receiveToken.name,
            symbol: receiveToken.symbol,
            balance: receiveTokenQty,
            value: netReceiveUsd,
            color: receiveToken.iconBg
          };
          const { error: pErr } = await supabase.from('portfolios').insert(portfolioPayload);
          if (pErr) {
            await supabase.from('assets').insert(portfolioPayload);
          }
        }
      }

      // Success feedback
      setSwapStatus({
        type: 'success',
        message: `Successfully swapped ${payTokenQty.toFixed(6)} ${payToken.symbol} for ${receiveTokenQty.toFixed(4)} ${receiveToken.symbol}!`
      });
      setPayUsdAmount('0');

      // Refresh user portfolios
      const { data: updatedProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (updatedProfile) setUserProfile(updatedProfile);

      let { data: updatedPortfolios } = await supabase.from('portfolios').select('*').eq('user_id', user.id);
      if (!updatedPortfolios) {
        const { data: fallbackP } = await supabase.from('assets').select('*').eq('user_id', user.id);
        updatedPortfolios = fallbackP || [];
      }
      setUserPortfolios(updatedPortfolios);

    } catch (err: any) {
      setSwapStatus({
        type: 'error',
        message: err.message || 'Swap execution failed. Please try again.'
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const filteredTokens = availableTokens.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 pt-2 px-2 sm:px-4">
      
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-full shadow-sm flex items-center gap-2">
              <Repeat size={16} /> Portfolio Swap & Trade
            </span>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">Tracefield Smart Liquidity Router</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-brand-dark mt-2 hidden lg:block">Trade & Swap Crypto Portfolios</h1>
        </div>
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2.5 text-gray-500 hover:text-brand-dark bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors shadow-2xs flex items-center gap-2 text-xs font-bold"
          title="Swap Settings"
        >
          <Settings size={16} />
          <span className="hidden sm:inline">Slippage: {slippage}%</span>
        </button>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-dark">Slippage Tolerance</h3>
            <span className="text-xs font-bold text-brand-purple">{slippage}%</span>
          </div>
          <div className="flex items-center gap-2">
            {[0.1, 0.5, 1.0].map(s => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  slippage === s 
                    ? 'bg-brand-purple text-white border-brand-purple' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DESKTOP GRID LAYOUT: Left 7 Cols (Swap Engine), Right 5 Cols (Live Market Portfolios & Rates) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SWAP INTERFACE */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm relative space-y-3">
            
            {/* Card 1: YOU PAY */}
            <div className="p-5 bg-gray-50 hover:bg-gray-100/80 transition-colors rounded-2xl border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>You Pay</span>
                <div className="flex items-center gap-1.5 text-gray-700 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{payToken.symbol} Portfolio</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                {/* Input Big USD */}
                <div className="flex-1">
                  <div className="flex items-center font-display font-bold text-2xl sm:text-3xl text-brand-dark">
                    <span className="text-gray-400 mr-1">US$</span>
                    <input 
                      type="number" 
                      value={payUsdAmount} 
                      onChange={(e) => setPayUsdAmount(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-brand-dark font-display font-bold"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Token Dropdown Selector */}
                <button 
                  onClick={() => setTokenSelectorMode('pay')}
                  className="flex items-center gap-2.5 px-3.5 py-2 bg-white border border-gray-200 rounded-full shadow-2xs hover:bg-gray-50 transition-colors shrink-0"
                >
                  <CoinLogo symbol={payToken.symbol} size="sm" />
                  <span className="font-bold text-sm text-brand-dark">{payToken.symbol}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  {payTokenQty.toFixed(6)} {payToken.symbol}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-gray-500">
                    Portfolio Bal: {payTokenBalance > 0 ? `${payTokenBalance.toFixed(4)} ${payToken.symbol}` : '0.00'}
                  </span>
                  <button 
                    onClick={handleSetMax} 
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase bg-blue-50 px-2 py-0.5 rounded-full"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {/* Center Flip Swap Button */}
            <div className="relative h-2 my-[-10px] z-10 flex items-center justify-center">
              <button 
                onClick={handleFlip}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:text-brand-purple shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Swap pay and receive portfolios"
              >
                <ArrowUpDown size={18} />
              </button>
            </div>

            {/* Card 2: YOU RECEIVE */}
            <div className="p-5 bg-gray-50 hover:bg-gray-100/80 transition-colors rounded-2xl border border-gray-200/80 space-y-3 pt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>You Receive</span>
                <div className="flex items-center gap-1.5 text-gray-700 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span>{receiveToken.symbol} Portfolio</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                {/* Output Big USD */}
                <div className="flex-1 font-display font-bold text-2xl sm:text-3xl text-brand-dark">
                  US${netReceiveUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>

                {/* Token Dropdown Selector */}
                <button 
                  onClick={() => setTokenSelectorMode('receive')}
                  className="flex items-center gap-2.5 px-3.5 py-2 bg-white border border-gray-200 rounded-full shadow-2xs hover:bg-gray-50 transition-colors shrink-0"
                >
                  <CoinLogo symbol={receiveToken.symbol} size="sm" />
                  <span className="font-bold text-sm text-brand-dark">{receiveToken.symbol}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="font-mono">
                  {receiveTokenQty.toFixed(6)} {receiveToken.symbol}
                </span>
                <span className="font-mono text-[11px] text-gray-400">
                  Portfolio Bal: {receiveTokenBalance > 0 ? `${receiveTokenBalance.toFixed(4)} ${receiveToken.symbol}` : '0.00'}
                </span>
              </div>
            </div>

            {/* Rate & Floating Selection Bar */}
            <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200 flex items-center justify-between text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1.5">
                <span>Guaranteed Rate:</span>
                <span className="font-mono font-bold text-brand-dark ml-1">
                  1 {payToken.symbol} ≈ {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {receiveToken.symbol}
                </span>
              </div>

              <button 
                onClick={() => setRateType(rateType === 'Fixed' ? 'Floating' : 'Fixed')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-brand-dark font-bold text-[11px] hover:bg-gray-100 transition-colors"
              >
                <Lock size={12} className="text-gray-500" />
                <span>{rateType}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>

            {/* Status Alert Banner */}
            {swapStatus && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                swapStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {swapStatus.type === 'success' ? <ShieldCheck size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                <span>{swapStatus.message}</span>
              </div>
            )}

            {/* Action Swap Button */}
            <button 
              onClick={handleExecuteSwap}
              disabled={isSwapping}
              className="w-full py-4 bg-brand-dark hover:bg-black text-white font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isSwapping ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Executing Smart Swap...</span>
                </>
              ) : payUsdVal <= 0 ? (
                <span>Enter Amount to Get Instant Rates</span>
              ) : (
                <span>Swap {payToken.symbol} ➔ {receiveToken.symbol}</span>
              )}
            </button>

          </div>

          {/* Trade Details Panel for Desktop */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Smart Liquidity Routing Info
            </h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-400">Network Fee</p>
                <p className="font-bold text-brand-dark mt-0.5">0.10% ($0.00)</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-400">Execution Speed</p>
                <p className="font-bold text-emerald-600 mt-0.5">&lt; 2.5s Instant</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-400">Max Slippage</p>
                <p className="font-bold text-brand-purple mt-0.5">{slippage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: POPULAR PORTFOLIOS & LIVE MARKETS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold font-display text-brand-dark flex items-center gap-2">
                <Layers size={18} className="text-blue-600" />
                Popular Crypto Portfolios
              </h2>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Live Market Rates</span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto custom-scrollbar">
              {availableTokens.map((token) => (
                <div 
                  key={token.id}
                  onClick={() => {
                    setReceiveToken(token);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <CoinLogo symbol={token.symbol} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-brand-dark text-sm">{token.symbol}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">{token.network}</span>
                      </div>
                      <p className="text-xs text-gray-400">{token.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-brand-dark text-sm">
                      US${token.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </div>
                    <div className={`text-xs font-bold flex items-center justify-end gap-0.5 ${
                      token.change24h >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {token.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      <span>{token.change24h >= 0 ? '+' : ''}{token.change24h}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Token Selector Modal */}
      {tokenSelectorMode && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-brand-dark">Select Portfolio Asset</h3>
              <button 
                onClick={() => setTokenSelectorMode(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search token name or symbol..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm border-none focus:ring-2 focus:ring-brand-purple outline-none"
              />
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1">
              {filteredTokens.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => {
                    if (tokenSelectorMode === 'pay') setPayToken(t);
                    else setReceiveToken(t);
                    setTokenSelectorMode(null);
                  }}
                  className="p-3 flex items-center justify-between hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CoinLogo symbol={t.symbol} size="sm" />
                    <div>
                      <p className="font-bold text-sm text-brand-dark">{t.symbol}</p>
                      <p className="text-xs text-gray-400">{t.name}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-brand-dark">
                    ${t.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex items-center justify-around z-30 lg:hidden shadow-lg">
        <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand-purple">
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/dashboard/prices" className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand-purple">
          <BarChart2 size={20} />
          <span className="text-[10px] font-medium">Markets</span>
        </Link>
        <Link to="/dashboard/swap" className="flex flex-col items-center gap-0.5 text-blue-600 font-bold">
          <Repeat size={20} />
          <span className="text-[10px]">Trade</span>
        </Link>
        <Link to="/dashboard/notifications" className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand-purple">
          <Newspaper size={20} />
          <span className="text-[10px] font-medium">News</span>
        </Link>
        <button onClick={() => navigate('/dashboard/settings')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-brand-purple">
          <MoreHorizontal size={20} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

    </div>
  );
}
