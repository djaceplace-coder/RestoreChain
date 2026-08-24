import { ArrowRight, Star, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 text-sm font-medium text-brand-text-gray">
            <div className="flex items-center gap-2">
              <div className="flex text-green-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span>4.9/5 on Trustpilot</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-500" />
              <span>Certified Blockchain Investigators</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-brand-dark mb-6 leading-[1.1]">
            Digital asset recovery <span className="text-brand-purple">made possible</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-brand-text-gray mb-10 max-w-2xl mx-auto leading-relaxed">
            Recover lost assets, trace stolen funds, and secure your blockchain identity with the #1 digital recovery platform. We combine on-chain analytics with legal expertise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto bg-brand-purple text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-brand-purple/90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/25">
              Start a Case Review <ArrowRight size={20} />
            </Link>
            <span className="text-sm text-brand-text-gray mt-2 sm:mt-0">Free initial consultation</span>
          </div>
        </div>

        {/* Hero Graphic / Dashboard Mockup */}
        <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto">
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-purple/20 blur-[100px] rounded-full -z-10"></div>
          
          <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-gray-100 overflow-hidden relative">
            {/* Window controls */}
            <div className="flex gap-2 mb-6 hidden md:flex">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            
            {/* Dashboard content mock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-brand-text-gray font-medium">Portfolio Balance</p>
                    <h3 className="text-3xl font-bold font-display">$124,592.45</h3>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    +14.2%
                  </div>
                </div>
                {/* Mock Chart Area */}
                <div className="h-48 w-full flex items-end gap-2 relative">
                  {/* Simplified bar chart with SVG path to look like a line chart */}
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path d="M0 40 L 10 35 L 20 38 L 30 25 L 40 28 L 50 15 L 60 20 L 70 5 L 80 10 L 90 2 L 100 8" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-purple" />
                    <path d="M0 40 L 10 35 L 20 38 L 30 25 L 40 28 L 50 15 L 60 20 L 70 5 L 80 10 L 90 2 L 100 8 L 100 40 L 0 40" fill="currentColor" className="text-brand-purple/10" />
                  </svg>
                </div>
              </div>

              <div className="col-span-1 flex flex-col gap-6">
                <div className="bg-brand-dark text-white rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple rounded-full blur-[40px] -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <p className="text-sm text-gray-400 font-medium mb-1">Estimated Tax Owed</p>
                    <h3 className="text-3xl font-bold font-display mb-4">$4,250</h3>
                    <button className="w-full bg-white text-brand-dark py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                      View Tax Report
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex-1">
                  <h4 className="font-semibold mb-4 text-sm">Recent Transactions</h4>
                  <div className="space-y-4">
                    {[
                      { type: 'Bought BTC', amount: '+0.15', fiat: '-$9,450', color: 'bg-orange-100 text-orange-600' },
                      { type: 'Staking Reward', amount: '+12 SOL', fiat: '+$1,680', color: 'bg-purple-100 text-purple-600' },
                      { type: 'Sold ETH', amount: '-2.5', fiat: '+$8,750', color: 'bg-blue-100 text-blue-600' },
                    ].map((tx, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.color}`}>
                            {tx.type.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{tx.type}</p>
                            <p className="text-gray-500 text-xs">Today</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{tx.amount}</p>
                          <p className="text-gray-500 text-xs">{tx.fiat}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-20 pt-10 border-t border-gray-200">
          <p className="text-center text-sm font-medium text-brand-text-gray mb-8 uppercase tracking-wider">Trusted by & Integrated with</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
             <div className="text-xl font-display font-bold">Chainalysis</div>
             <div className="text-xl font-display font-bold">Fireblocks</div>
             <div className="text-xl font-display font-bold text-green-600">Ledger</div>
             <div className="text-xl font-display font-bold">Trezor</div>
             <div className="text-xl font-display font-bold text-blue-500">Elliptic</div>
          </div>
        </div>
      </div>
    </section>
  );
}
