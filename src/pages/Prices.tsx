import React, { useState } from 'react';
import { Activity, ShieldAlert, TrendingUp, BarChart3, AlertCircle, ArrowRight, Lock, Search, ArrowUpRight, ArrowDownRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLivePrices } from '../hooks/useLivePrices';
import CoinLogo from '../components/CoinLogo';

// Static intelligence mapping for security & exploit analysis
const ASSET_INTEL: Record<string, { risk: 'Low' | 'Medium' | 'High' | 'Critical'; freezable: string; exploits: string; category: string }> = {
  USDT: { risk: 'Low', freezable: 'Yes (Tether Contract)', exploits: '$1.2B', category: 'Stablecoins' },
  USDC: { risk: 'Low', freezable: 'Yes (Centre Blacklist)', exploits: '$800M', category: 'Stablecoins' },
  DAI: { risk: 'High', freezable: 'No (Decentralized)', exploits: '$400M', category: 'Stablecoins' },
  BTC: { risk: 'Medium', freezable: 'No (Native Layer-1)', exploits: '$3.1B', category: 'Layer 1' },
  ETH: { risk: 'Medium', freezable: 'No (Native Layer-1)', exploits: '$4.5B', category: 'Layer 1' },
  SOL: { risk: 'Medium', freezable: 'No (Native Layer-1)', exploits: '$1.1B', category: 'Layer 1' },
  BNB: { risk: 'Medium', freezable: 'No (Validator Quorum)', exploits: '$920M', category: 'Layer 1' },
  XRP: { risk: 'Medium', freezable: 'Yes (Ripple Freeze Flag)', exploits: '$350M', category: 'Payment' },
  ADA: { risk: 'Medium', freezable: 'No (Native Layer-1)', exploits: '$180M', category: 'Layer 1' },
  DOGE: { risk: 'High', freezable: 'No (Native Layer-1)', exploits: '$210M', category: 'Meme' },
  AVAX: { risk: 'Medium', freezable: 'No (Native Layer-1)', exploits: '$420M', category: 'Layer 1' },
  TRX: { risk: 'Medium', freezable: 'No (Native Layer-1)', exploits: '$640M', category: 'Layer 1' },
  DOT: { risk: 'Medium', freezable: 'No (Substrate)', exploits: '$190M', category: 'Layer 1' },
  LINK: { risk: 'Low', freezable: 'No (Oracle Network)', exploits: '$130M', category: 'DeFi' },
  POL: { risk: 'Medium', freezable: 'No (POS Network)', exploits: '$310M', category: 'Layer 2' },
  MATIC: { risk: 'Medium', freezable: 'No (POS Network)', exploits: '$310M', category: 'Layer 2' },
  TON: { risk: 'Medium', freezable: 'No (Native Layer-1)', exploits: '$95M', category: 'Layer 1' },
  SHIB: { risk: 'High', freezable: 'No (ERC-20 Token)', exploits: '$140M', category: 'Meme' },
  LTC: { risk: 'Medium', freezable: 'No (Native UTXO)', exploits: '$270M', category: 'Payment' },
  BCH: { risk: 'Medium', freezable: 'No (Native UTXO)', exploits: '$310M', category: 'Payment' },
  UNI: { risk: 'Medium', freezable: 'No (Governance Token)', exploits: '$160M', category: 'DeFi' },
  ATOM: { risk: 'Medium', freezable: 'No (Cosmos Hub)', exploits: '$110M', category: 'Layer 1' },
  XLM: { risk: 'Low', freezable: 'Yes (Asset Clawback)', exploits: '$90M', category: 'Payment' },
  XMR: { risk: 'Critical', freezable: 'No (RingCT Privacy)', exploits: '$1.8B Unknown', category: 'Privacy' },
  ICP: { risk: 'Medium', freezable: 'No (Internet Computer)', exploits: '$75M', category: 'Layer 1' },
  NEAR: { risk: 'Medium', freezable: 'No (Nightshade Sharding)', exploits: '$120M', category: 'Layer 1' },
  APT: { risk: 'Medium', freezable: 'No (Move Engine)', exploits: '$85M', category: 'Layer 1' },
  SUI: { risk: 'Medium', freezable: 'No (Move Engine)', exploits: '$90M', category: 'Layer 1' },
  AAVE: { risk: 'Low', freezable: 'No (Lending Protocol)', exploits: '$220M', category: 'DeFi' },
};

export default function Prices() {
  const { coins, btcPrice, loading, lastUpdated, refresh } = useLivePrices(30000);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Layer 1' | 'Stablecoins' | 'DeFi' | 'Payment'>('All');

  const filteredCoins = coins.filter((coin) => {
    const matchesSearch =
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    const intel = ASSET_INTEL[coin.symbol.toUpperCase()];
    const category = intel ? intel.category : 'Crypto';
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Layer 1') return matchesSearch && (category === 'Layer 1' || coin.symbol === 'BTC' || coin.symbol === 'ETH' || coin.symbol === 'SOL');
    if (selectedFilter === 'Stablecoins') return matchesSearch && (category === 'Stablecoins' || coin.symbol === 'USDT' || coin.symbol === 'USDC' || coin.symbol === 'DAI');
    if (selectedFilter === 'DeFi') return matchesSearch && (category === 'DeFi' || coin.symbol === 'LINK' || coin.symbol === 'UNI' || coin.symbol === 'AAVE');
    if (selectedFilter === 'Payment') return matchesSearch && (category === 'Payment' || coin.symbol === 'XRP' || coin.symbol === 'LTC' || coin.symbol === 'XLM');
    return matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero with Live Sync Badge */}
      <section className="py-20 bg-brand-dark text-white text-center border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple-light text-xs font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live Market Rates & Blockchain Risk Index
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Cryptocurrency Live Rates & Asset Risk Index
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real-time cryptocurrency valuation paired with institutional forensic risk assessment, native blacklist capabilities, and historical exploit probability.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-400">
            <span className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl">
              BTC Live: <strong className="text-white">${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </span>
            <span className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl flex items-center gap-2">
              Sync: <strong className="text-green-400">Active</strong> • Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Live Data Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls: Search & Category Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by token or symbol (e.g. BTC, Solana)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {(['All', 'Layer 1', 'Stablecoins', 'DeFi', 'Payment'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedFilter === filter
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}

              <button
                onClick={() => refresh()}
                title="Refresh Live Rates"
                className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-brand-purple hover:bg-gray-50 transition-colors shrink-0"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin text-brand-purple' : ''} />
              </button>
            </div>
          </div>

          {/* Pricing Table Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-5 pl-6">Asset</th>
                    <th className="p-5 text-right">Live Price</th>
                    <th className="p-5 text-right">24h Change</th>
                    <th className="p-5 text-right hidden sm:table-cell">Market Cap</th>
                    <th className="p-5 text-center hidden md:table-cell">Laundering Risk</th>
                    <th className="p-5 text-center hidden lg:table-cell">Native Freeze</th>
                    <th className="p-5 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCoins.map((coin) => {
                    const sym = coin.symbol.toUpperCase();
                    const intel = ASSET_INTEL[sym] || {
                      risk: 'Medium' as const,
                      freezable: 'No (Decentralized)',
                      exploits: '$50M+',
                      category: 'Crypto',
                    };

                    return (
                      <tr key={coin.id} className="hover:bg-gray-50/80 transition-colors group">
                        {/* Asset Column */}
                        <td className="p-5 pl-6">
                          <div className="flex items-center gap-3">
                            <CoinLogo symbol={coin.symbol} size="md" image={coin.image} />
                            <div>
                              <p className="font-bold text-brand-dark flex items-center gap-2">
                                {coin.name}
                                <span className="text-xs font-mono font-normal text-gray-400 uppercase">
                                  {coin.symbol}
                                </span>
                              </p>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {intel.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Live Price */}
                        <td className="p-5 text-right font-mono font-bold text-brand-dark">
                          ${coin.price.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: coin.price < 1 ? 6 : 2,
                          })}
                        </td>

                        {/* 24h Change */}
                        <td className="p-5 text-right">
                          <span
                            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${
                              coin.change24h >= 0
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {coin.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {Math.abs(coin.change24h).toFixed(2)}%
                          </span>
                        </td>

                        {/* Market Cap */}
                        <td className="p-5 text-right font-mono text-sm text-gray-600 hidden sm:table-cell">
                          ${(coin.marketCap / 1e9).toFixed(2)}B
                        </td>

                        {/* Laundering Risk */}
                        <td className="p-5 text-center hidden md:table-cell">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              intel.risk === 'Low'
                                ? 'bg-green-100 text-green-700'
                                : intel.risk === 'Medium'
                                ? 'bg-orange-100 text-orange-700'
                                : intel.risk === 'High'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {intel.risk}
                          </span>
                        </td>

                        {/* Native Freeze Function */}
                        <td className="p-5 text-center hidden lg:table-cell">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
                            {intel.freezable.includes('Yes') ? (
                              <Lock size={14} className="text-green-600" />
                            ) : (
                              <AlertCircle size={14} className="text-gray-400" />
                            )}
                            {intel.freezable}
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="p-5 pr-6 text-right">
                          <Link
                            to="/signup"
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-brand-purple/10 text-brand-purple font-bold text-xs rounded-xl hover:bg-brand-purple hover:text-white transition-colors"
                          >
                            Trace <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredCoins.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-gray-500">
                        No cryptocurrency matching "{searchTerm}" found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stablecoin Recovery Protocol */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-2 block">Centralized vs Decentralized</span>
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">The Stablecoin Freezability Advantage</h2>
            <p className="text-base text-gray-600 mb-4 leading-relaxed">
              Centralized tokens such as Tether (USDT) and Circle (USDC) contain native smart contract methods that permit law enforcement and verified forensic teams to freeze illicit balances globally before cash-out.
            </p>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              If your stolen assets are converted into or currently held in centralized stablecoins, your recovery probability increases substantially compared to native UTXO or privacy tokens.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 text-brand-purple font-bold hover:underline">
              Submit an Emergency Asset Freeze Request &rarr;
            </Link>
          </div>
          <div className="flex-1 w-full bg-gray-900 rounded-3xl p-8 text-white font-mono text-xs md:text-sm shadow-xl border border-gray-800">
            <p className="text-gray-500 mb-3">// Tether (USDT) On-Chain Smart Contract Method</p>
            <p className="text-brand-purple-light font-bold">function <span className="text-white">addBlackList</span> (address _evilUser) public onlyOwner &#123;</p>
            <p className="ml-4 text-green-400">isBlackListed[_evilUser] = true;</p>
            <p className="ml-4 text-gray-500">// Emits on-chain event: AddedBlackList(_evilUser)</p>
            <p className="ml-4 text-yellow-300">emit AddedBlackList(_evilUser);</p>
            <p>&#125;</p>
            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-2 text-green-400 text-xs font-sans">
              <CheckCircle2 size={16} /> Tracefield automated contract monitoring active
            </div>
          </div>
        </div>
      </section>

      {/* 4. Analytics & Stats */}
      <section className="py-20 bg-brand-purple-bg border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100">
              <TrendingUp className="mx-auto text-brand-purple mb-4" size={32} />
              <h4 className="text-4xl font-display font-bold text-brand-dark mb-2">$1.7B</h4>
              <p className="text-gray-600 text-sm">Laundered through Mixers & Bridges in 2025</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100">
              <ShieldAlert className="mx-auto text-brand-purple mb-4" size={32} />
              <h4 className="text-4xl font-display font-bold text-brand-dark mb-2">68%</h4>
              <p className="text-gray-600 text-sm">Hacks involving Smart Contract Exploits</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100">
              <BarChart3 className="mx-auto text-brand-purple mb-4" size={32} />
              <h4 className="text-4xl font-display font-bold text-brand-dark mb-2">42 Days</h4>
              <p className="text-gray-600 text-sm">Average time from theft to CEX liquidation attempt</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise API Data */}
      <section className="py-20 text-center bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Need programmatic live rates & forensic scoring?</h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Integrate our real-time Asset Risk Index and Live Pricing API directly into your exchange or compliance management pipeline.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors shadow-lg">
            Create API Key <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
