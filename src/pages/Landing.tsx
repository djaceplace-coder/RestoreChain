import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Wallet, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center font-bold text-xl">R</div>
            <span className="font-display font-bold text-xl tracking-tight">Tracefield</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</Link>
            <Link to="/signup" className="text-sm font-bold bg-white text-brand-dark px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 z-10">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-gray-300">Enterprise-Grade Asset Tracking</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-tight z-10">
          Secure digital asset <br className="hidden lg:block"/> forensics & recovery.
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed z-10">
          The industry standard for cryptocurrency reconciliation, multi-wallet tracking, and institutional-grade portfolio analytics.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
          <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-brand-purple hover:bg-indigo-500 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_40px_rgba(99,102,241,0.4)]">
            Enter App <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-24 bg-white/5 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Comprehensive Tooling</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to monitor, reconcile, and secure your digital portfolio across multiple chains and exchanges.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111116] p-8 rounded-3xl border border-white/10 hover:border-brand-purple/50 transition-colors">
              <div className="w-14 h-14 bg-brand-purple/20 rounded-2xl flex items-center justify-center text-brand-purple mb-6">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Reconciliation</h3>
              <p className="text-gray-400 leading-relaxed">Instantly match transactions across wallets and exchanges to identify discrepancies in real-time.</p>
            </div>
            
            <div className="bg-[#111116] p-8 rounded-3xl border border-white/10 hover:border-brand-purple/50 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                <Wallet size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Wallet Tracking</h3>
              <p className="text-gray-400 leading-relaxed">Consolidate all your digital assets into a single, unified dashboard for comprehensive oversight.</p>
            </div>
            
            <div className="bg-[#111116] p-8 rounded-3xl border border-white/10 hover:border-brand-purple/50 transition-colors">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-Grade Security</h3>
              <p className="text-gray-400 leading-relaxed">Your data is secured with enterprise-grade encryption. We never access your private keys.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
