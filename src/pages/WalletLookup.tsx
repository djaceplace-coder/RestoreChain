import { Search, ShieldAlert, AlertTriangle, ShieldCheck, Activity, MapPin, Database, ChevronRight, Lock } from 'lucide-react';
import React, { useState } from 'react';

export default function WalletLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    // Simulate lookup delay
    setTimeout(() => {
      setIsSearching(false);
      alert("This is a frontend demonstration. In a production environment, this would query our active threat intelligence database.");
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* 1. Hero Search Area */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Threat Intel Lookup
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Check any cryptocurrency address against our proprietary database of known scammers, sanctioned entities, and exploited smart contracts.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
            <div className="flex items-center bg-white rounded-full p-2 pl-6 shadow-2xl">
              <Search className="text-gray-400 mr-3" size={24} />
              <input 
                type="text" 
                placeholder="Paste BTC, ETH, SOL, or any major blockchain address..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-brand-dark text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-brand-purple text-white px-8 py-4 rounded-full font-bold hover:bg-brand-purple/90 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isSearching ? 'Scanning...' : 'Analyze Wallet'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Global Threat Metrics */}
      <section className="py-12 bg-brand-purple text-white border-b border-brand-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="py-4">
              <p className="text-4xl font-display font-bold mb-1">14.2M+</p>
              <p className="text-sm text-brand-purple-light uppercase tracking-wider font-medium">Flagged Addresses</p>
            </div>
            <div className="py-4">
              <p className="text-4xl font-display font-bold mb-1">980+</p>
              <p className="text-sm text-brand-purple-light uppercase tracking-wider font-medium">Hacked Protocols Tracked</p>
            </div>
            <div className="py-4">
              <p className="text-4xl font-display font-bold mb-1">Live</p>
              <p className="text-sm text-brand-purple-light uppercase tracking-wider font-medium">OFAC Sanctions Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How Risk Scoring Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-6">How our risk engine evaluates addresses</h2>
              <p className="text-lg text-brand-text-gray mb-8">
                Our lookup tool doesn't just check static lists. It evaluates the relational graph of an address up to 5 hops away, looking for interaction with high-risk entities.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark text-lg mb-1">Direct Exposure (Tier 1)</h4>
                    <p className="text-brand-text-gray">Address is directly flagged as a scammer, hacker, terrorist financing entity, or sanctioned wallet.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark text-lg mb-1">Indirect Exposure (Tier 2)</h4>
                    <p className="text-brand-text-gray">Address regularly transacts with high-risk entities, darknet markets, or unregulated mixing services.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark text-lg mb-1">Clean Entity (Tier 3)</h4>
                    <p className="text-brand-text-gray">Address belongs to a regulated exchange, known smart contract, or has no ties to illicit activity.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full bg-gray-50 rounded-3xl p-8 border border-gray-100">
               {/* Mock UI showing a scan result */}
               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                   <div>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Analysis Result</p>
                     <p className="font-mono text-sm text-brand-dark">0x742d35Cc...333</p>
                   </div>
                   <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                     <AlertTriangle size={14} /> HIGH RISK
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Known Entity</span>
                     <span className="font-bold text-brand-dark">Lazarus Group (DPRK)</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Primary Chain</span>
                     <span className="font-bold text-brand-dark">Ethereum</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Tornado Cash Deposits</span>
                     <span className="font-bold text-brand-dark">42 Transactions</span>
                   </div>
                 </div>

                 <div className="mt-6 pt-4 border-t border-gray-100">
                   <button className="w-full text-center text-brand-purple font-semibold text-sm flex items-center justify-center gap-1 hover:text-brand-dark transition-colors">
                     View Full Relational Graph <ChevronRight size={16} />
                   </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Threat Feed (Mock) */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-brand-dark mb-2">Recent Flags</h2>
              <p className="text-brand-text-gray">Newly identified malicious addresses added to our registry.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-brand-purple font-bold hover:text-brand-dark transition-colors">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                    <th className="p-4 font-semibold">Address</th>
                    <th className="p-4 font-semibold">Chain</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Date Flagged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-brand-dark">0x44fa...91ea</td>
                    <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">ETH</span></td>
                    <td className="p-4 text-sm text-brand-dark">Phishing Contract</td>
                    <td className="p-4 text-sm text-gray-500">2 hours ago</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-brand-dark">bc1qxy...89lk</td>
                    <td className="p-4"><span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md font-medium">BTC</span></td>
                    <td className="p-4 text-sm text-brand-dark">Ransomware Affiliate</td>
                    <td className="p-4 text-sm text-gray-500">5 hours ago</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-brand-dark">7aD9x...Kx2w</td>
                    <td className="p-4"><span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-medium">SOL</span></td>
                    <td className="p-4 text-sm text-brand-dark">Drainer Wallet</td>
                    <td className="p-4 text-sm text-gray-500">12 hours ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Institutional Use Cases */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">Enterprise Compliance & AML</h2>
            <p className="text-lg text-brand-text-gray max-w-2xl mx-auto">Protect your platform from tainted funds. Our API integrates directly into your withdrawal and deposit flows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition-shadow bg-white">
              <Database className="text-brand-purple mb-4" size={32} />
              <h3 className="text-xl font-bold font-display mb-3 text-brand-dark">Rest API Access</h3>
              <p className="text-brand-text-gray text-sm leading-relaxed mb-4">Sub-50ms latency queries to check incoming deposits against global OFAC and custom sanction lists.</p>
              <a href="#" className="text-brand-purple font-bold text-sm hover:underline">View API Docs &rarr;</a>
            </div>
            <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition-shadow bg-white">
              <MapPin className="text-brand-purple mb-4" size={32} />
              <h3 className="text-xl font-bold font-display mb-3 text-brand-dark">Travel Rule Enforcement</h3>
              <p className="text-brand-text-gray text-sm leading-relaxed mb-4">Automatically gather required originator and beneficiary data for transactions crossing jurisdictional thresholds.</p>
              <a href="#" className="text-brand-purple font-bold text-sm hover:underline">Learn more &rarr;</a>
            </div>
            <div className="p-8 border border-gray-100 rounded-3xl hover:shadow-lg transition-shadow bg-white">
              <Lock className="text-brand-purple mb-4" size={32} />
              <h3 className="text-xl font-bold font-display mb-3 text-brand-dark">Automated Freezing</h3>
              <p className="text-brand-text-gray text-sm leading-relaxed mb-4">Set custom risk tolerance parameters to automatically hold withdrawals destined for tier-1 malicious addresses.</p>
              <a href="#" className="text-brand-purple font-bold text-sm hover:underline">Compliance overview &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Report an Address */}
      <section className="py-20 bg-brand-purple-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldAlert className="mx-auto text-brand-purple mb-6" size={48} />
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Scammed? Report the address.</h2>
          <p className="text-lg text-brand-text-gray mb-8 max-w-2xl mx-auto">
            Help us protect the community. Submit known scam addresses to our analysts for verification. Once verified, it will be added to our global blacklist, preventing them from cashing out at partner exchanges.
          </p>
          <button className="bg-brand-purple text-white px-8 py-4 rounded-full font-bold hover:bg-brand-purple/90 transition-colors shadow-lg">
            Submit Threat Intel Report
          </button>
        </div>
      </section>

      {/* 7. FAQ for Lookup Tool */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-10 text-center">Lookup Tool FAQs</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-brand-dark text-lg mb-2">How often is the database updated?</h4>
              <p className="text-brand-text-gray">Our threat intelligence database is updated in real-time. Major hacks are tagged within minutes of the exploit, and OFAC lists are synced every 60 seconds.</p>
            </div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div>
              <h4 className="font-bold text-brand-dark text-lg mb-2">Can a legitimate address be flagged by mistake?</h4>
              <p className="text-brand-text-gray">While rare, false positives can occur if you interact heavily with a tainted address. We have an expedited appeals process to remove flags from legitimate wallets.</p>
            </div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div>
              <h4 className="font-bold text-brand-dark text-lg mb-2">What blockchains do you index?</h4>
              <p className="text-brand-text-gray">We actively index Bitcoin, Ethereum, Solana, Polygon, Arbitrum, Optimism, Avalanche, and over 800 other chains, including UTXO, EVM, and non-EVM architectures.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 8. Bottom CTA */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold mb-4">Need institutional API access?</h2>
          <p className="text-gray-400 mb-8">Get full access to our threat intel database for your exchange or protocol.</p>
          <button className="bg-white text-brand-dark px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
            Contact Enterprise Sales
          </button>
        </div>
      </section>

    </div>
  );
}
