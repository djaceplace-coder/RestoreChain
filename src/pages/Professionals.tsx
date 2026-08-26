import React from 'react';
import { Shield, Scale, FileText, CheckCircle2, Lock, ArrowRight, Briefcase, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Professionals() {
  const features = [
    { title: "Forensic Affidavits", desc: "Court-admissible reports mapping complex cross-chain flow of funds.", icon: FileText },
    { title: "Expert Witness Testimony", desc: "Our lead investigators are available for deposition and trial testimony.", icon: Briefcase },
    { title: "Subpoena Packets", desc: "Pre-drafted technical packets for serving Tier-1 exchanges.", icon: Scale },
    { title: "Secure Chain of Custody", desc: "Cryptographically verified audit trails for all seized digital assets.", icon: Lock }
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero */}
      <section className="py-24 bg-brand-dark text-white text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <Landmark className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">For Law Enforcement & Counsel</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Equipping cybercrime units, prosecutors, and litigation partners with irrefutable on-chain evidence and technical seizure capabilities.</p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/signup" className="bg-brand-purple text-white px-8 py-4 rounded-full font-bold hover:bg-brand-purple/90 transition-colors">Request Partner Portal Access</Link>
          </div>
        </div>
      </section>

      {/* 2. Core Capabilities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-brand-dark">Litigation & Recovery Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all">
                <f.icon className="text-brand-purple mb-6" size={32} />
                <h3 className="text-xl font-bold font-display text-brand-dark mb-3">{f.title}</h3>
                <p className="text-brand-text-gray text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Chain of Custody */}
      <section className="py-20 bg-brand-purple-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Cryptographic Chain of Custody</h2>
            <p className="text-lg text-brand-text-gray mb-6">Digital assets require specialized handling to maintain evidentiary integrity. We provide secure multi-sig escrow and cold-storage seizure execution that meets stringent federal guidelines.</p>
            <ul className="space-y-4">
              {['FIPS 140-2 Level 3 Hardware Security', 'Multi-signature quorum authorization', 'Geographically distributed key shards'].map((item, i) => (
                <li key={i} className="flex items-center gap-3"><CheckCircle2 className="text-brand-purple" size={20} /> <span className="font-medium text-brand-dark">{item}</span></li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
             <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Seizure Wallet (Escrow)</p>
                  <p className="font-mono text-sm">bc1q...x9la (Multisig 2-of-3)</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-green-700 font-bold text-sm flex items-center justify-between">
                  <span>Cryptographic Proof of Control</span>
                  <CheckCircle2 size={16} />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Jurisdictions */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-10">Global Reach, Local Compliance</h2>
          <p className="text-brand-text-gray mb-10">We have successfully coordinated asset freezes alongside local counsel in over 40 jurisdictions, including:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['United States (DOJ/FBI)', 'United Kingdom (NCA)', 'European Union (Europol)', 'Singapore', 'Cayman Islands', 'BVI', 'UAE', 'Australia (AFP)'].map((j, i) => (
              <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold text-brand-dark">{j}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Subpoena Packet Generator (Mock UI) */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Automated Subpoena Drafting</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">Partners gain access to our proprietary portal to instantly generate technical DOJ-compliant KYC subpoenas for specific transaction hashes.</p>
          <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 max-w-2xl mx-auto text-left">
             <p className="text-brand-purple-light text-xs font-bold uppercase mb-4">Portal Preview</p>
             <div className="h-10 bg-gray-700 rounded mb-4"></div>
             <div className="h-10 bg-gray-700 rounded mb-4"></div>
             <div className="h-12 bg-brand-purple rounded flex items-center justify-center font-bold">Generate Legal Packet (.docx)</div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 bg-gray-50">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-brand-dark text-center mb-12">Trusted by the best</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <p className="text-brand-text-gray mb-6">"Tracefield's technical affidavits were the cornerstone of our civil forfeiture action. They translated complex mixer activity into clear evidence for the judge."</p>
                <p className="font-bold text-brand-dark">Partner, AmLaw 100 Firm</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <p className="text-brand-text-gray mb-6">"Their tracing engine identified the KYC chokepoint 3 weeks faster than our internal tools. The funds were frozen with 48 hours to spare."</p>
                <p className="font-bold text-brand-dark">Cybercrime Task Force Lead</p>
              </div>
            </div>
         </div>
      </section>
      
      {/* 7. Certifications */}
      <section className="py-16 text-center border-t border-gray-100">
         <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Security & Compliance</p>
         <div className="flex justify-center gap-8 text-gray-400 font-display font-bold text-xl">
           <span>SOC 2 Type II</span>
           <span>ISO 27001</span>
           <span>Chainalysis Certified</span>
           <span>TRM Partner</span>
         </div>
      </section>

      {/* 8. CTA */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-brand-dark mb-6">Partner with Tracefield</h2>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-dark text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-black transition-all">
            Contact Partner Relations <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
