import Hero from '../components/Hero';
import FeaturesGrid from '../components/FeaturesGrid';
import FeatureHighlight from '../components/FeatureHighlight';
import Testimonials from '../components/Testimonials';
import { ArrowDownToLine, RefreshCw, Sparkles, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturesGrid />
      
      {/* Analyze Highlight */}
      <FeatureHighlight
        label="1. Analyze"
        title="Trace your digital footprint"
        description="Connect public keys or upload transaction histories securely. Our proprietary heuristic engine analyzes interactions across 800+ blockchains and obscure DeFi protocols."
        bulletPoints={[
          "Read-only analytics ensure your remaining funds are safe",
          "Real-time wallet monitoring and risk-scoring",
          "Support for NFTs, cross-chain bridges, and mixers"
        ]}
      >
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">E</div>
                <div>
                  <p className="font-semibold text-sm">Ethereum Mainnet</p>
                  <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircleMini /> Scanning 142 hops...</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-brand-purple"><RefreshCw size={18} /></button>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">B</div>
                <div>
                  <p className="font-semibold text-sm">Bitcoin Network</p>
                  <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircleMini /> Trace complete</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-brand-purple"><RefreshCw size={18} /></button>
            </div>

            <div className="bg-brand-purple text-white p-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20 mt-2">
              <RefreshCw size={18} className="animate-spin-slow" /> 
              <span className="font-medium">Unmixing Tornado Cash transactions...</span>
            </div>
        </div>
      </FeatureHighlight>

      {/* Recover Highlight */}
      <FeatureHighlight
        label="2. Recover"
        title="Identify liquidation points"
        description="Don't wait helplessly. Our continuous monitoring engine tracks stolen assets until they hit a centralized exchange (CEX) where they can be frozen."
        bulletPoints={[
          "Real-time alerts when funds hit a KYC exchange",
          "Identify ultimate beneficiary addresses",
          "Advanced deanonymization algorithms"
        ]}
        imageFirst={true}
      >
        <div className="relative aspect-square max-h-[400px] w-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D9F950]/20 to-brand-purple/10 rounded-2xl"></div>
            
            {/* Abstract Optimization UI */}
            <div className="w-4/5 bg-white shadow-2xl rounded-2xl p-6 border border-gray-100 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="font-bold text-gray-500 mb-1">Recoverable Assets Identified</h4>
                  <p className="text-4xl font-display font-bold text-brand-green flex items-center gap-2">
                    <Sparkles size={28} className="text-brand-green" /> $1.24M
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-purple w-3/4"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Probability of Freeze</span>
                  <span>75%</span>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg mt-6">
                  <p className="text-sm text-orange-800 font-medium">
                    Funds have been traced to Binance deposit address. Initiating freeze request.
                  </p>
                </div>
              </div>
            </div>
        </div>
      </FeatureHighlight>

      {/* File Highlight */}
      <FeatureHighlight
        label="3. Execute"
        title="Generate court-admissible reports"
        description="When you're ready, generate the exact documentation needed for law enforcement, insurance claims, or civil litigation."
        bulletPoints={[
          "Generates comprehensive forensic affidavits",
          "Direct exports for law enforcement agencies",
          "Full cryptographic audit trail for every finding"
        ]}
      >
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-4">
          {[
            { name: 'Forensic Audit Report', desc: 'PDF Report', icon: FileText, color: 'text-red-500 bg-red-100' },
            { name: 'Law Enforcement Export', desc: 'Encrypted Data', icon: ArrowDownToLine, color: 'text-blue-500 bg-blue-100' },
            { name: 'Subpoena Packet', desc: 'PDF & Exhibits', icon: ArrowDownToLine, color: 'text-green-500 bg-green-100' }
          ].map((file, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-brand-purple transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${file.color}`}>
                  <file.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark group-hover:text-brand-purple transition-colors">{file.name}</h4>
                  <p className="text-sm text-gray-500">{file.desc}</p>
                </div>
              </div>
              <button className="text-brand-purple font-medium text-sm px-4 py-2 rounded-lg bg-brand-purple-bg opacity-0 group-hover:opacity-100 transition-opacity">
                Download
              </button>
            </div>
          ))}
        </div>
      </FeatureHighlight>

      <Testimonials />
      
      {/* Bottom CTA */}
      <section className="py-24 bg-brand-purple relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green opacity-20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Time is critical. Don't wait.
          </h2>
          <p className="text-xl text-brand-purple-light mb-10">
            Reach out to our experts immediately to begin tracing your digital assets.
          </p>
          <Link to="/signup" className="inline-block bg-brand-green text-brand-dark px-10 py-5 rounded-full text-lg font-bold hover:bg-white transition-colors shadow-xl">
            Start a Free Case Review
          </Link>
          <div className="mt-12 text-brand-purple-light text-sm flex flex-col items-center gap-2">
            <p><strong>Email:</strong> info@tracefield.co.uk</p>
            <p><strong>Location:</strong> London, United Kingdom</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckCircleMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
