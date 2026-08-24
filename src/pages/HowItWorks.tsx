import { Search, ShieldAlert, Scale, CheckCircle2, ArrowRight, Activity, Database, Lock, Globe, FileText, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How long does a typical investigation take?",
      a: "Initial triage takes 24-48 hours. Full investigations depend on case complexity, mixing services used, and jurisdictional hurdles. Most recoveries span 3 to 9 months from initiation to asset return."
    },
    {
      q: "Do you guarantee recovery?",
      a: "No reputable firm can guarantee 100% recovery. We guarantee that if assets are recoverable and hit a KYC-compliant chokepoint, our technical and legal framework provides the highest statistical probability of freezing and seizing them."
    },
    {
      q: "What is the minimum case size you accept?",
      a: "For individual tracing and recovery, our minimum case size is typically $50,000 USD equivalent. For institutional clients and protocol exploits, we handle cases of any magnitude."
    },
    {
      q: "Are my details kept confidential?",
      a: "Strictly. We operate under rigorous NDAs. Your identity and wallet details are never shared publicly, and only disclosed to law enforcement when absolutely necessary for a freeze order."
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-purple/10 text-brand-purple font-semibold text-sm mb-6 tracking-wide uppercase">
            The Methodology
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-8 tracking-tight max-w-4xl mx-auto">
            From lost to recovered. <br/>
            <span className="text-brand-purple">Here's how we do it.</span>
          </h1>
          <p className="text-xl text-brand-text-gray mb-10 max-w-2xl mx-auto leading-relaxed">
            Asset recovery isn't magic. It's a rigorous combination of advanced blockchain heuristics, global law enforcement partnerships, and relentless legal execution.
          </p>
        </div>
      </section>

      {/* 2. Stats / Trust Bar */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200">
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-brand-dark mb-2">$120M+</p>
              <p className="text-sm text-brand-text-gray uppercase tracking-wider font-medium">Assets Recovered</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-brand-dark mb-2">99.9%</p>
              <p className="text-sm text-brand-text-gray uppercase tracking-wider font-medium">Tracing Accuracy</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-brand-dark mb-2">40+</p>
              <p className="text-sm text-brand-text-gray uppercase tracking-wider font-medium">Jurisdictions</p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-display font-bold text-brand-dark mb-2">800+</p>
              <p className="text-sm text-brand-text-gray uppercase tracking-wider font-medium">Blockchains Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Core Process (4 Steps) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-brand-dark mb-4">The Recovery Lifecycle</h2>
            <p className="text-lg text-brand-text-gray max-w-2xl mx-auto">Our four-phase approach ensures no stone is left unturned, from the moment funds are lost to the moment they are returned.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Triage & Ingestion', desc: 'We securely collect your transaction IDs, public keys, and incident details. Our systems immediately scan for active movement.', icon: Database },
              { step: '02', title: 'Forensic Tracing', desc: 'Our heuristic engine maps the flow of funds through mixers, cross-chain bridges, and intermediary wallets.', icon: Search },
              { step: '03', title: 'Identification', desc: 'We pinpoint when assets hit centralized exchanges or OTC desks (chokepoints) where KYC data is held.', icon: ShieldAlert },
              { step: '04', title: 'Legal Execution', desc: 'We draft affidavits and liaise with law enforcement to freeze accounts, subpoena KYC data, and execute recovery.', icon: Scale }
            ].map((phase, i) => (
              <div key={i} className="relative group">
                <div className="h-full bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:border-brand-purple/30 z-10 relative">
                  <div className="text-6xl font-display font-bold text-gray-100 mb-6 group-hover:text-brand-purple/10 transition-colors">{phase.step}</div>
                  <phase.icon size={32} className="text-brand-purple mb-6" />
                  <h3 className="text-xl font-bold font-display mb-3 text-brand-dark">{phase.title}</h3>
                  <p className="text-brand-text-gray text-sm leading-relaxed">{phase.desc}</p>
                </div>
                {/* Connector line for desktop */}
                {i < 3 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gray-200 z-0"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Technology Stack (Bento) */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-display font-bold text-brand-dark mb-4">Powered by proprietary tech</h2>
            <p className="text-lg text-brand-text-gray max-w-2xl">We don't just use off-the-shelf tools. Our internal forensic suite is built specifically to unmask complex laundering techniques.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <Activity size={32} className="text-blue-500 mb-6 relative z-10" />
              <h3 className="text-2xl font-bold font-display mb-4 relative z-10">Cross-Chain Heuristics</h3>
              <p className="text-brand-text-gray mb-8 relative z-10 max-w-md">When criminals bridge Ethereum to Solana, traditional trackers lose the trail. Our engine correlates bridge contract timings and amounts to maintain visibility across networks.</p>
              
              <div className="h-32 bg-gray-50 border border-gray-100 rounded-xl relative overflow-hidden flex items-center px-6 gap-4">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 z-10">ETH</div>
                 <div className="flex-1 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 relative z-10">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 text-[10px] font-bold rounded shadow-sm border border-gray-100">ThorChain</div>
                 </div>
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600 z-10">BTC</div>
                 
                 {/* Decorative background grid */}
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <Lock size={32} className="text-orange-500 mb-6" />
              <h3 className="text-xl font-bold font-display mb-4">Mixer Deanonymization</h3>
              <p className="text-brand-text-gray text-sm leading-relaxed mb-6">We utilize machine learning to identify cluster patterns in services like Tornado Cash, successfully unmixing transactions based on gas prices, timing analysis, and deposit/withdrawal behavioral links.</p>
            </div>

            <div className="bg-brand-dark rounded-3xl p-8 shadow-xl text-white">
              <Globe size={32} className="text-brand-green mb-6" />
              <h3 className="text-xl font-bold font-display mb-4">Dark Web Node Scraping</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Continuous monitoring of darknet markets, illicit forums, and known threat-actor wallets to identify pre-liquidation chatter and unmask identities linked to specific wallet clusters.</p>
            </div>

            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-center">
              <h3 className="text-2xl font-bold font-display mb-4">Continuous Real-Time Monitoring</h3>
              <p className="text-brand-text-gray mb-6">Stolen funds often sit dormant for months. Our 24/7 nodes monitor target addresses indefinitely, triggering automated alerts the millisecond funds move toward an exchange.</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active Watcher #8942</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active Watcher #8943</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Legal & Compliance Layer */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 uppercase">Legal Framework</span>
              <h2 className="text-4xl font-display font-bold text-brand-dark mb-6">Blockchain data alone doesn't return your funds.</h2>
              <p className="text-lg text-brand-text-gray mb-8">
                Tracing the crypto is only half the battle. Without a court order, exchanges will not freeze assets or release the thief's KYC information (name, IP address, ID documents).
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <FileText className="text-blue-500 shrink-0 mt-1" size={20} />
                  <span className="text-brand-dark"><strong>Affidavits:</strong> We draft expert witness reports mapping the flow of funds in a format prosecutors and judges understand.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Scale className="text-blue-500 shrink-0 mt-1" size={20} />
                  <span className="text-brand-dark"><strong>Law Enforcement:</strong> Direct channels with global cybercrime units (FBI, Europol, NCA) to expedite freeze requests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldAlert className="text-blue-500 shrink-0 mt-1" size={20} />
                  <span className="text-brand-dark"><strong>Exchange Liaisons:</strong> Fast-track communication with compliance officers at Binance, Kraken, Coinbase, and 50+ other exchanges.</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-3 opacity-10"></div>
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl relative z-10">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Confidential</p>
                  <h4 className="font-display font-bold text-xl">Forensic Tracing Report Exhibit A</h4>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="py-4 my-4 border-y border-gray-100">
                    <p className="font-mono text-xs text-brand-purple mb-2">TxHash: 0x8f2a...9c11</p>
                    <p className="font-mono text-xs text-brand-purple mb-2">Target KYC Exchange: BINANCE (Cayman Islands)</p>
                    <p className="font-mono text-xs text-red-500">Action: IMMEDIATE FREEZE REQUESTED</p>
                  </div>
                  <div className="h-10 bg-gray-900 rounded-lg flex items-center justify-center mt-6">
                    <span className="text-white text-sm font-bold flex items-center gap-2"><Lock size={16} /> Subpoena Packet Generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Typical Scenarios */}
      <section className="py-24 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Cases We Handle</h2>
            <p className="text-lg text-gray-400">Our infrastructure is built to tackle the most complex forms of digital theft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Phishing & Social Engineering', 'Smart Contract Exploits', 'Exchange Hacks & Insolvency', 'Lost Keys & Seed Phrases', 'Insider Theft & Embezzlement', 'Rug Pulls & Scam Tokens', 'SIM Swapping', 'Ransomware Payments'].map((caseType, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer">
                <CheckCircle2 className="text-brand-green mb-4" size={24} />
                <h4 className="font-bold">{caseType}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Viability Checklist */}
      <section className="py-24 bg-brand-purple-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 text-center">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Is your case viable?</h2>
            <p className="text-brand-text-gray mb-8">Before you pay for a full investigation, we conduct a free triage to ensure a realistic path to recovery exists.</p>
            
            <div className="text-left space-y-4 bg-gray-50 p-6 rounded-2xl mb-8">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></div>
                <span className="text-brand-dark font-medium">Do you have the exact transaction hash of the theft?</span>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></div>
                <span className="text-brand-dark font-medium">Did the theft occur within the last 36 months?</span>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></div>
                <span className="text-brand-dark font-medium">Is the total value lost greater than $50,000 USD?</span>
              </div>
            </div>

            <button className="bg-brand-purple text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-2 mx-auto w-full md:w-auto">
              Request Free Triage <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-brand-dark">{faq.q}</span>
                  <ChevronDown className={`transform transition-transform ${openFaq === i ? 'rotate-180 text-brand-purple' : 'text-gray-400'}`} size={20} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 bg-gray-50 text-brand-text-gray border-t border-gray-100">
                    <p className="pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 bg-gray-50 border-t border-gray-200 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Stop waiting. Start recovering.</h2>
          <p className="text-brand-text-gray mb-8">The longer you wait, the further the assets move. Contact us immediately to initiate tracing.</p>
          <button className="bg-brand-dark text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-black transition-all">
            Contact Investigation Team
          </button>
        </div>
      </section>
    </div>
  );
}
