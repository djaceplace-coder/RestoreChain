import React from 'react';
import { Check, X, Shield, Scale, ArrowRight, Building, User, Lock, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* 1. Hero */}
      <section className="py-24 bg-brand-dark text-white text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-purple/20 text-brand-purple-light font-semibold text-sm mb-6 tracking-wide uppercase border border-brand-purple/30">
            Transparent Pricing
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            No Recovery. No Fee.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We align our success entirely with yours. We shoulder the cost of investigation, tracing, and legal drafting. You only pay when assets are returned to your control.
          </p>
        </div>
      </section>

      {/* 2. Pricing Tiers */}
      <section className="py-24 relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Triage */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">Initial Triage</h3>
              <p className="text-brand-text-gray mb-6 h-12">Case feasibility assessment & initial trace check.</p>
              <div className="text-4xl font-bold text-brand-dark mb-8">$0 <span className="text-lg text-gray-400 font-normal">/ flat</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Review of transaction hashes</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Probability score generation</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Check against known threat actors</span></li>
                <li className="flex items-start gap-3 text-gray-400"><X className="mt-1 shrink-0" size={18} /> <span className="text-sm">Continuous monitoring</span></li>
                <li className="flex items-start gap-3 text-gray-400"><X className="mt-1 shrink-0" size={18} /> <span className="text-sm">Law enforcement liaison</span></li>
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 bg-gray-100 text-brand-dark text-center font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Submit Hash
              </Link>
            </div>

            {/* Individual Recovery (Highlight) */}
            <div className="bg-brand-purple rounded-3xl p-8 border border-brand-purple shadow-2xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-green text-brand-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Common
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Individual Recovery</h3>
              <p className="text-brand-purple-light mb-6 h-12">For victims of phishing, hacks, and lost wallets.</p>
              <div className="text-4xl font-bold text-white mb-8">15-20% <span className="text-lg text-brand-purple-light font-normal">/ contingency</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-white">
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">24/7 continuous node monitoring</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Forensic affidavit generation</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Exchange freeze execution</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Law enforcement collaboration</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Secure asset escrow return</span></li>
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 bg-white text-brand-purple text-center font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Start a Case
              </Link>
            </div>

            {/* Enterprise / Protocol */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">Enterprise & Protocol</h3>
              <p className="text-brand-text-gray mb-6 h-12">For hacked DeFi protocols, treasuries, and institutions.</p>
              <div className="text-4xl font-bold text-brand-dark mb-8">Custom <span className="text-lg text-gray-400 font-normal">/ structure</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Immediate incident response SLA</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Hacker negotiation & bounties</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">PR and crisis management liaison</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Smart contract vulnerability patch</span></li>
                <li className="flex items-start gap-3"><Check className="text-brand-green mt-1 shrink-0" size={18} /> <span className="text-sm">Global injunctions</span></li>
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 bg-gray-100 text-brand-dark text-center font-bold rounded-xl hover:bg-gray-200 transition-colors">
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Contingency Model Explained */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">How the Contingency Fee Works</h2>
            <p className="text-brand-text-gray">No surprises. Total transparency from day one.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <h4 className="font-bold text-brand-dark text-lg">Sign Agreement</h4>
                <p className="text-brand-text-gray text-sm mt-1">We agree on a set percentage (usually 15-20% depending on complexity) via a legally binding digital contract.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <h4 className="font-bold text-brand-dark text-lg">We Absorb All Costs</h4>
                <p className="text-brand-text-gray text-sm mt-1">Server costs, analyst hours, and legal drafting fees are paid entirely by RestoreChain during the investigation.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <h4 className="font-bold text-brand-dark text-lg">Recovery & Payout</h4>
                <p className="text-brand-text-gray text-sm mt-1">When assets are successfully frozen and released by the exchange/law enforcement, they are routed through a secure escrow. Our fee is deducted, and the remaining balance is sent to your new secure wallet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cost Comparison */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-brand-dark text-center mb-12">RestoreChain vs. Traditional Law Firms</h2>
          
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-left bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-6 font-bold text-brand-dark">Feature</th>
                  <th className="p-6 font-bold text-brand-purple">RestoreChain</th>
                  <th className="p-6 font-bold text-gray-500">Traditional Law Firm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-6 font-medium text-brand-dark">Upfront Retainer</td>
                  <td className="p-6 font-bold text-green-600">$0</td>
                  <td className="p-6 text-gray-500">$10,000 - $50,000+</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="p-6 font-medium text-brand-dark">Hourly Billing</td>
                  <td className="p-6 font-bold text-green-600">None</td>
                  <td className="p-6 text-gray-500">$400 - $1,000 / hr</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-brand-dark">In-house Blockchain Forensics</td>
                  <td className="p-6"><Check className="text-green-500" /></td>
                  <td className="p-6 text-gray-500">Outsourced (Extra Cost)</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="p-6 font-medium text-brand-dark">Financial Risk if Recovery Fails</td>
                  <td className="p-6 font-bold text-green-600">Zero</td>
                  <td className="p-6 text-red-500 font-medium">You lose all legal fees paid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Wallet Recovery Exceptions */}
      <section className="py-20 bg-brand-purple-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lock className="mx-auto text-brand-purple mb-4" size={40} />
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Note on Hardware Wallet Password Recovery</h2>
          <p className="text-brand-text-gray mb-6">
            For cases involving forgotten passwords or partial seed phrases (where no theft has occurred), we offer a separate brute-force service. This typically incurs a flat computing fee + a smaller 5-10% contingency upon successful unlock.
          </p>
          <Link to="/signup" className="text-brand-purple font-bold hover:underline">Contact us for custom wallet recovery pricing &rarr;</Link>
        </div>
      </section>

      {/* 6. Payment Methods */}
      <section className="py-16 text-center border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-lg font-bold text-brand-dark mb-6 text-gray-500 uppercase tracking-wider">Accepted Payment Methods for Settlements</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
             <span className="font-display font-bold text-xl">USDC / USDT</span>
             <span className="font-display font-bold text-xl">Bitcoin</span>
             <span className="font-display font-bold text-xl">Ethereum</span>
             <span className="font-display font-bold text-xl">Wire Transfer</span>
          </div>
        </div>
      </section>

      {/* 7. Pricing FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-10 text-center">Financial FAQs</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-brand-dark text-lg mb-2">Are there absolutely no hidden fees?</h4>
              <p className="text-brand-text-gray">Correct. The only exception is if your specific case requires highly specialized international counsel outside of our network to file a local injunction. In such rare cases, we will present the option to you for approval before incurring any cost. You always have the right to refuse.</p>
            </div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div>
              <h4 className="font-bold text-brand-dark text-lg mb-2">How is the asset value calculated?</h4>
              <p className="text-brand-text-gray">The fee percentage is based on the USD value of the assets at the time of successful recovery and return, not the value at the time of theft.</p>
            </div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div>
              <h4 className="font-bold text-brand-dark text-lg mb-2">What if you only recover a portion of the funds?</h4>
              <p className="text-brand-text-gray">Our fee is strictly applied to the amount actually recovered. If you lost $1M and we recover $100k, our percentage only applies to the $100k.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-24 bg-brand-dark text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-display font-bold mb-6">You have nothing to lose.</h2>
          <p className="text-xl text-gray-400 mb-10">Get a free assessment of your case today.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-purple text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-brand-purple/90 transition-all shadow-xl">
            Submit Case Details <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}
