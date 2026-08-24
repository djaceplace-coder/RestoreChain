import React from 'react';
import { Activity, ShieldAlert, TrendingUp, BarChart3, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Prices() {
  const assets = [
    { symbol: 'USDT', name: 'Tether', risk: 'Low', freezable: 'Yes (Contract Level)', exploits: '$1.2B' },
    { symbol: 'USDC', name: 'USD Coin', risk: 'Low', freezable: 'Yes (Contract Level)', exploits: '$800M' },
    { symbol: 'ETH', name: 'Ethereum', risk: 'Medium', freezable: 'No (Native)', exploits: '$4.5B' },
    { symbol: 'BTC', name: 'Bitcoin', risk: 'Medium', freezable: 'No (Native)', exploits: '$3.1B' },
    { symbol: 'DAI', name: 'Dai', risk: 'High', freezable: 'No (Decentralized)', exploits: '$400M' },
    { symbol: 'XMR', name: 'Monero', risk: 'Critical', freezable: 'No (Privacy)', exploits: 'Unknown' },
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero */}
      <section className="py-24 bg-brand-dark text-white text-center border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <Activity className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">Asset Risk & Freezability Index</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Not all digital assets are created equal. Understand the recovery probability, native blacklist capabilities, and historical exploit volume for top cryptocurrencies.</p>
        </div>
      </section>

      {/* 2. Live Data Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-6">Asset</th>
                    <th className="p-6">Laundering Risk</th>
                    <th className="p-6">Native Freeze Function?</th>
                    <th className="p-6">Historical Exploit Vol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assets.map((asset, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs">{asset.symbol[0]}</div>
                          <div>
                            <p className="font-bold text-brand-dark">{asset.symbol}</p>
                            <p className="text-xs text-gray-500">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          asset.risk === 'Low' ? 'bg-green-100 text-green-700' :
                          asset.risk === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                        }`}>{asset.risk}</span>
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-medium text-brand-dark flex items-center gap-2">
                          {asset.freezable.includes('Yes') ? <Lock size={16} className="text-brand-purple"/> : <AlertCircle size={16} className="text-gray-400"/>}
                          {asset.freezable}
                        </span>
                      </td>
                      <td className="p-6 font-mono text-sm text-brand-text-gray">{asset.exploits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stablecoin Architecture */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">The Stablecoin Advantage</h2>
            <p className="text-lg text-brand-text-gray mb-6">Centralized stablecoins like USDT and USDC have native smart contract functions that allow their issuers to blacklist addresses and freeze funds globally, instantly rendering stolen assets worthless.</p>
            <p className="text-lg text-brand-text-gray mb-6">If your stolen assets are converted into or currently held in centralized stablecoins, your recovery probability increases by 400%.</p>
            <Link to="/signup" className="text-brand-purple font-bold hover:underline">Submit a stablecoin freeze request &rarr;</Link>
          </div>
          <div className="flex-1 w-full bg-gray-900 rounded-3xl p-8 text-white font-mono text-sm shadow-xl">
             <p className="text-gray-500 mb-2">// Tether (USDT) Blacklist Function Example</p>
             <p className="text-brand-purple-light">function</p> <p className="inline">addBlackList (address _evilUser) public onlyOwner {'{'}</p>
             <p className="ml-4 inline">isBlackListed[_evilUser] = true;</p>
             <p className="ml-4 inline text-gray-500">// Funds locked instantly</p>
             <p>{'}'}</p>
          </div>
        </div>
      </section>

      {/* 4. Analytics & Stats */}
      <section className="py-20 bg-brand-purple-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="bg-white p-8 rounded-3xl shadow-sm">
               <TrendingUp className="mx-auto text-brand-purple mb-4" size={32} />
               <h4 className="text-4xl font-display font-bold text-brand-dark mb-2">$1.7B</h4>
               <p className="text-brand-text-gray">Laundered through Mixers in 2025</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm">
               <ShieldAlert className="mx-auto text-brand-purple mb-4" size={32} />
               <h4 className="text-4xl font-display font-bold text-brand-dark mb-2">68%</h4>
               <p className="text-brand-text-gray">Hacks involving Smart Contract Exploits</p>
             </div>
             <div className="bg-white p-8 rounded-3xl shadow-sm">
               <BarChart3 className="mx-auto text-brand-purple mb-4" size={32} />
               <h4 className="text-4xl font-display font-bold text-brand-dark mb-2">42 Days</h4>
               <p className="text-brand-text-gray">Average time from theft to CEX liquidation</p>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise API Data */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Need programmatic access to risk scores?</h2>
          <p className="text-lg text-brand-text-gray mb-8">Integrate our Asset Risk Index API directly into your exchange's risk management engine.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors">
            View API Docs <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
