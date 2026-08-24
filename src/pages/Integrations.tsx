import React, { useState } from 'react';
import { Search, Link2, Database, Shield, Hexagon, Layers, Box, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Integrations() {
  const [search, setSearch] = useState('');

  const categories = ['All', 'Blockchains', 'Exchanges', 'Wallets', 'DeFi Protocols'];
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-purple/20 text-brand-purple-light font-semibold text-sm mb-6 tracking-wide uppercase border border-brand-purple/30">
            Global Coverage
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            Supported Integrations
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Our forensic engine natively indexes and traces assets across 800+ blockchains, centralized exchanges, and smart contract protocols.
          </p>
        </div>
      </section>

      {/* 2. Search & Filter Bar */}
      <section className="py-8 bg-gray-900 border-b border-gray-800 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search networks, exchanges, wallets..." 
                className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-brand-purple text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured / Law Enforcement Partners */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold text-brand-dark mb-8 text-center">Tier 1 Exchange Freeze Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Binance', 'Coinbase', 'Kraken', 'KuCoin', 'Bitfinex', 'OKX', 'Huobi', 'Bybit'].map((exchange, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-center gap-3 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-brand-dark font-bold text-xs">{exchange[0]}</div>
                <span className="font-bold text-brand-dark">{exchange}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Blockchains (L1/L2) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Hexagon className="text-brand-purple" size={32} />
            <h2 className="text-3xl font-display font-bold text-brand-dark">Supported Networks (L1 & L2)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Bitcoin (BTC)', desc: 'Full UTXO tracking & mempool analysis', icon: 'B' },
              { name: 'Ethereum (ETH)', desc: 'ERC-20, ERC-721, and internal transactions', icon: 'E' },
              { name: 'Solana (SOL)', desc: 'SPL tokens and program invocations', icon: 'S' },
              { name: 'Polygon (MATIC)', desc: 'Full L2 state mapping', icon: 'P' },
              { name: 'Arbitrum (ARB)', desc: 'Cross-chain bridge correlation', icon: 'A' },
              { name: 'Optimism (OP)', desc: 'Fraud proof tracking', icon: 'O' }
            ].map((chain, i) => (
              <div key={i} className="group p-6 border border-gray-100 rounded-3xl hover:border-brand-purple/50 hover:shadow-lg transition-all bg-white flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center font-display font-bold text-xl group-hover:bg-brand-purple group-hover:text-white transition-colors">{chain.icon}</div>
                <div>
                  <h4 className="font-bold text-brand-dark text-lg">{chain.name}</h4>
                  <p className="text-brand-text-gray text-sm">{chain.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="text-brand-purple font-bold hover:text-brand-dark transition-colors">View all 142 supported networks &rarr;</button>
          </div>
        </div>
      </section>

      {/* 5. Smart Contracts & DeFi */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <Layers className="text-brand-purple" size={32} />
            <h2 className="text-3xl font-display font-bold text-brand-dark">DeFi & Mixers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Tornado Cash', 'FixedFloat', 'ThorChain', 'Curve Finance', 'Uniswap', 'PancakeSwap', 'Aave', 'Compound'].map((defi, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
                <CheckCircle2 size={16} className="text-brand-green" />
                <span className="font-medium text-brand-dark">{defi}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Wallet Recovery Targets */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-brand-purple" size={32} />
                <h2 className="text-3xl font-display font-bold text-brand-dark">Wallet Recovery</h2>
              </div>
              <p className="text-lg text-brand-text-gray mb-6">
                For clients who have lost passwords or have corrupted seed phrases, our cryptographic cracking cluster supports extraction and brute-forcing for major wallet formats.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-brand-purple" /> <strong>Hardware:</strong> Ledger (Nano S/X), Trezor (One/T)</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-brand-purple" /> <strong>Software:</strong> MetaMask, Trust Wallet, Exodus</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} className="text-brand-purple" /> <strong>Core:</strong> Bitcoin Core (wallet.dat), Ethereum Keystore</li>
              </ul>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-colors">
                Request Wallet Recovery <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex-1 w-full bg-gray-50 rounded-3xl p-8 border border-gray-200">
               <div className="space-y-4">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <Cpu className="text-gray-400" />
                     <span className="font-bold">BIP-39 Seed Phrase Recovery</span>
                   </div>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Supported</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <Box className="text-gray-400" />
                     <span className="font-bold">Encrypted JSON Keystores</span>
                   </div>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Supported</span>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <Database className="text-gray-400" />
                     <span className="font-bold">Legacy wallet.dat files</span>
                   </div>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Supported</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Enterprise API */}
      <section className="py-24 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link2 size={48} className="mx-auto text-brand-purple mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Build on our Infrastructure</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Exchanges and custodians use our API to integrate live threat intelligence directly into their compliance engines.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="bg-brand-purple text-white px-8 py-4 rounded-full font-bold hover:bg-brand-purple/90 transition-colors">
              Get API Documentation
            </Link>
            <Link to="/signup" className="bg-gray-800 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-700 transition-colors">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Missing an Integration? */}
      <section className="py-20 bg-brand-purple-bg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Don't see your network?</h2>
          <p className="text-lg text-brand-text-gray mb-8">
            Our engineering team adds support for new L1s, L2s, and protocols weekly based on case demand. If you've been exploited on an unsupported chain, we can build custom parsers.
          </p>
          <Link to="/signup" className="text-brand-purple font-bold hover:text-brand-dark transition-colors flex items-center justify-center gap-2">
            Request Custom Integration <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="py-20 bg-gray-50 border-t border-gray-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Ready to start tracing?</h2>
          <Link to="/signup" className="inline-block bg-brand-dark text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-black transition-all shadow-lg">
            Submit Case File
          </Link>
        </div>
      </section>
    </div>
  );
}
