import React, { useState } from 'react';
import { Calculator as CalcIcon, AlertTriangle, ShieldCheck, Clock, FileSearch, ArrowRight, DollarSign, Activity, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Calculator() {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('BTC');
  const [lossType, setLossType] = useState('hack');
  const [timeframe, setTimeframe] = useState('recent');
  
  const [isCalculated, setIsCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setIsCalculated(true);
    }, 1200);
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero */}
      <section className="py-20 bg-brand-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <CalcIcon className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">Recovery Viability Calculator</h1>
          <p className="text-xl text-gray-400">Estimate the statistical probability of freezing and recovering your lost digital assets based on historical case data.</p>
        </div>
      </section>

      {/* 2. Interactive Calculator Tool */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            
            {/* Input Form */}
            <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Asset Lost</label>
                  <div className="flex gap-2">
                    <select 
                      className="w-1/3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      value={asset}
                      onChange={(e) => setAsset(e.target.value)}
                    >
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                      <option value="USDT">USDT/USDC</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <input 
                      type="number" 
                      placeholder="Amount (e.g. 2.5)" 
                      className="w-2/3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Nature of Incident</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    value={lossType}
                    onChange={(e) => setLossType(e.target.value)}
                  >
                    <option value="hack">Exchange / Protocol Hack</option>
                    <option value="phishing">Phishing / Scam Approval</option>
                    <option value="lost_seed">Lost Seed Phrase / Password</option>
                    <option value="wrong_address">Sent to Wrong Address</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">Time Since Incident</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <option value="recent">Under 72 hours</option>
                    <option value="month">Within 1 month</option>
                    <option value="year">Within 1 year</option>
                    <option value="old">Over 1 year ago</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isCalculating}
                  className="w-full bg-brand-purple text-white py-4 rounded-xl font-bold hover:bg-brand-purple/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isCalculating ? <Activity className="animate-spin" size={20} /> : 'Calculate Viability'}
                </button>
              </form>
            </div>

            {/* Output Display */}
            <div className="flex-1 p-8 md:p-12 bg-gray-50 flex flex-col justify-center items-center text-center">
              {!isCalculated && !isCalculating ? (
                <div className="text-brand-text-gray max-w-sm">
                  <FileSearch className="mx-auto mb-4 opacity-50" size={48} />
                  <p>Enter your case details to generate an instant algorithmic viability assessment.</p>
                </div>
              ) : isCalculating ? (
                <div className="text-brand-purple">
                  <Activity className="animate-spin mx-auto mb-4" size={48} />
                  <p className="font-bold animate-pulse">Running heuristic models...</p>
                </div>
              ) : (
                <div className="w-full animate-in fade-in zoom-in duration-300">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Viability Score</h3>
                  
                  {lossType === 'wrong_address' ? (
                    <div className="text-red-500 mb-6">
                      <span className="text-6xl font-display font-bold">Low</span>
                      <p className="text-sm text-gray-600 mt-4 bg-red-50 p-3 rounded-lg border border-red-100">Errors sending to unowned smart contracts or wrong chains are typically irreversible at the protocol level.</p>
                    </div>
                  ) : timeframe === 'recent' ? (
                    <div className="text-brand-green mb-6">
                      <span className="text-6xl font-display font-bold">High</span>
                      <p className="text-sm text-gray-600 mt-4 bg-green-50 p-3 rounded-lg border border-green-100">Fast action increases probability. Funds often sit in intermediary wallets before hitting mixing services.</p>
                    </div>
                  ) : (
                    <div className="text-orange-500 mb-6">
                      <span className="text-6xl font-display font-bold">Medium</span>
                      <p className="text-sm text-gray-600 mt-4 bg-orange-50 p-3 rounded-lg border border-orange-100">Viable for tracing, but requires long-term monitoring for eventual liquidation at a CEX.</p>
                    </div>
                  )}

                  <Link to="/signup" className="block w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">
                    Submit Case for Free Manual Review
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Explanation of Scoring */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-brand-dark">How we calculate viability</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} />
              </div>
              <h4 className="font-bold text-brand-dark mb-2">Time Decay</h4>
              <p className="text-brand-text-gray text-sm">The fresher the trail, the easier it is to freeze assets before they are passed through complex laundering protocols.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} />
              </div>
              <h4 className="font-bold text-brand-dark mb-2">Attack Vector</h4>
              <p className="text-brand-text-gray text-sm">Phishing and exchange hacks leave on-chain evidence. Sending to a burn address does not.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
                <DollarSign size={28} />
              </div>
              <h4 className="font-bold text-brand-dark mb-2">Value Thresholds</h4>
              <p className="text-brand-text-gray text-sm">Law enforcement agencies typically require high monetary thresholds ($50k+) to prioritize international subpoenas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Costs vs Recovery Section */}
      <section className="py-20 bg-brand-purple-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">No Recovery, No Fee Structure</h2>
            <p className="text-lg text-brand-text-gray mb-6">
              We align our incentives with yours. For qualified cases, we operate on a contingency basis. You only pay our fee if we successfully recover your assets.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-purple" size={20} /> Free initial triage & feasibility check</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-purple" size={20} /> Transparent percentage-based fee on recovered funds</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="text-brand-purple" size={20} /> No hidden hourly legal retainers</li>
            </ul>
            <Link to="/pricing" className="text-brand-purple font-bold hover:text-brand-dark transition-colors flex items-center gap-2">
              View Detailed Pricing &rarr;
            </Link>
          </div>
          <div className="flex-1 w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <span className="font-bold text-gray-500">Asset Value</span>
              <span className="font-mono text-xl font-bold">$100,000</span>
            </div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <span className="font-bold text-gray-500">Upfront Tracing Fee</span>
              <span className="font-mono text-xl font-bold text-green-500">$0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-brand-dark text-lg">Contingency Fee</span>
              <span className="font-mono text-xl font-bold text-brand-purple">15 - 20%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Security Guarantee */}
      <section className="py-16 text-center border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <ShieldCheck size={40} className="mx-auto text-brand-green mb-4" />
          <h3 className="text-2xl font-bold text-brand-dark mb-4">Bank-Grade Data Security</h3>
          <p className="text-brand-text-gray">
            Any data submitted through this calculator or our portal is end-to-end encrypted. We never ask for your private keys unless executing a secure wallet password brute-force under strict NDA.
          </p>
        </div>
      </section>
      
      {/* 6. FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-display text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-brand-dark mb-2">Is the calculator 100% accurate?</h4>
              <p className="text-brand-text-gray text-sm">No, it is a statistical estimate based on past case resolutions. A human analyst must review the exact tx hashes for a definitive answer.</p>
            </div>
            <div>
              <h4 className="font-bold text-brand-dark mb-2">What happens after a 'High' viability score?</h4>
              <p className="text-brand-text-gray text-sm">You should immediately submit a formal case review so our analysts can begin monitoring the funds before they move to a mixer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-brand-dark mb-6">Have your transaction hash ready?</h2>
          <p className="text-lg text-brand-text-gray mb-8">Skip the calculator and go straight to our analysts for a free manual review.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-purple/90 transition-all shadow-lg">
            Submit Case File <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}
