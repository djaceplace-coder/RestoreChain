import React from 'react';
import { LayoutDashboard, Lock, Search, Activity, ShieldCheck, ArrowRight, Wallet, History, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortfolioTracker() {
  const steps = [
    { title: 'Incident Ingestion', status: 'Complete', date: 'Oct 12', color: 'bg-green-500' },
    { title: 'Heuristic Tracing', status: 'Complete', date: 'Oct 15', color: 'bg-green-500' },
    { title: 'CEX Identification', status: 'Active', date: 'Pending', color: 'bg-brand-purple animate-pulse' },
    { title: 'Legal Freeze', status: 'Waiting', date: '-', color: 'bg-gray-200' },
    { title: 'Escrow Return', status: 'Waiting', date: '-', color: 'bg-gray-200' },
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero */}
      <section className="py-24 bg-brand-dark text-white text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <LayoutDashboard className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">Client Recovery Portal</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Track the real-time status of your recovery case. Monitor tracing progress, legal milestones, and view secured assets in our multi-sig escrow.</p>
        </div>
      </section>

      {/* 2. Mock Dashboard UI */}
      <section className="py-20 relative z-10 -mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
             
             {/* Header */}
             <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-gray-50">
               <div>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Case</p>
                 <h3 className="text-xl font-bold text-brand-dark">RC-2025-8942A</h3>
               </div>
               <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                 <Activity size={16} /> Investigation Active
               </div>
             </div>

             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Timeline */}
                <div className="md:col-span-2">
                  <h4 className="font-bold text-brand-dark mb-6 text-lg">Recovery Timeline</h4>
                  <div className="space-y-6">
                    {steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="flex flex-col items-center mt-1">
                          <div className={`w-4 h-4 rounded-full ${step.color}`}></div>
                          {i !== steps.length -1 && <div className="w-0.5 h-12 bg-gray-100 mt-2"></div>}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="font-bold text-brand-dark">{step.title}</p>
                          <p className="text-xs text-gray-500">{step.status} • {step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secure Escrow Widget */}
                <div className="bg-brand-purple-bg p-6 rounded-2xl border border-brand-purple/20 h-fit">
                  <div className="flex items-center gap-2 mb-4 text-brand-dark">
                    <ShieldCheck size={20} className="text-brand-purple" />
                    <h4 className="font-bold">Secured in Escrow</h4>
                  </div>
                  <div className="text-3xl font-display font-bold text-brand-dark mb-1">$0.00</div>
                  <p className="text-xs text-brand-text-gray mb-6">Assets frozen and moved to RestoreChain multi-sig custody will appear here pending final payout.</p>
                  <button disabled className="w-full bg-gray-200 text-gray-400 py-3 rounded-xl font-bold cursor-not-allowed">
                    Withdraw Unavailable
                  </button>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 3. Privacy & Security */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-12">Client Confidentiality Guaranteed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <EyeOff className="mx-auto text-brand-purple mb-4" size={32} />
              <h4 className="font-bold text-brand-dark mb-2">Zero Public Exposure</h4>
              <p className="text-sm text-brand-text-gray">Your identity and wallet addresses are never published. We operate under strict NDAs.</p>
            </div>
            <div className="p-6">
              <Lock className="mx-auto text-brand-purple mb-4" size={32} />
              <h4 className="font-bold text-brand-dark mb-2">End-to-End Encryption</h4>
              <p className="text-sm text-brand-text-gray">All case files, communication, and affidavit drafts are stored on SOC2 compliant servers.</p>
            </div>
            <div className="p-6">
              <Wallet className="mx-auto text-brand-purple mb-4" size={32} />
              <h4 className="font-bold text-brand-dark mb-2">Cold Storage Payouts</h4>
              <p className="text-sm text-brand-text-gray">Recovered funds are routed directly from law enforcement to your newly secured cold wallets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-brand-dark mb-6">Open your case file.</h2>
          <p className="text-lg text-brand-text-gray mb-8">Create an account to submit your transaction details securely to our intake team.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-dark text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-black transition-all shadow-lg">
            Access Client Portal <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
