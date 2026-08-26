import React from 'react';
import { Shield, AlertTriangle, Key, Smartphone, Wifi, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Guide() {
  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero */}
      <section className="py-24 bg-brand-dark text-white text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <Shield className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">Security & OpSec Guide</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Essential operational security protocols to protect your digital assets from phishing, social engineering, and smart contract exploits.</p>
        </div>
      </section>

      {/* 2. Emergency Action Plan */}
      <section className="py-16 bg-red-50 border-b border-red-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 text-red-600">
            <AlertTriangle size={32} />
            <h2 className="text-3xl font-bold">Just got hacked? Do this immediately:</h2>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100">
            <ul className="space-y-4">
              <li className="flex gap-4"><span className="font-bold text-red-600">1.</span> <span className="text-brand-dark"><strong>Revoke Allowances:</strong> Use Revoke.cash or Etherscan to revoke unlimited token approvals immediately.</span></li>
              <li className="flex gap-4"><span className="font-bold text-red-600">2.</span> <span className="text-brand-dark"><strong>Move Remaining Funds:</strong> Send any uncompromised assets to a brand new hardware wallet or a centralized exchange.</span></li>
              <li className="flex gap-4"><span className="font-bold text-red-600">3.</span> <span className="text-brand-dark"><strong>Do NOT Delete Evidence:</strong> Do not delete browser histories, emails, or telegram chats with the attacker.</span></li>
              <li className="flex gap-4"><span className="font-bold text-red-600">4.</span> <span className="text-brand-dark"><strong>Contact Tracefield:</strong> Submit the malicious transaction hash to our triage team to begin tracking.</span></li>
            </ul>
            <div className="mt-8">
              <Link to="/signup" className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">Start Emergency Trace</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Best Practices */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-12 text-center">Fundamental OpSec Rules</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <Key className="text-brand-purple mb-4" size={32} />
              <h3 className="text-xl font-bold text-brand-dark mb-3">Cold Storage Sovereignty</h3>
              <p className="text-brand-text-gray text-sm mb-4">Never store seed phrases digitally. Not in a password manager, not in an encrypted note, and never take a photo of it. Engrave it on steel or keep it in a secure physical vault.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <Smartphone className="text-brand-purple mb-4" size={32} />
              <h3 className="text-xl font-bold text-brand-dark mb-3">Hardware Keys (FIDO2)</h3>
              <p className="text-brand-text-gray text-sm mb-4">SMS 2FA is highly vulnerable to SIM swap attacks. Use YubiKeys or Google Titan hardware keys for all exchange and email accounts.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <Wifi className="text-brand-purple mb-4" size={32} />
              <h3 className="text-xl font-bold text-brand-dark mb-3">Compartmentalization</h3>
              <p className="text-brand-text-gray text-sm mb-4">Separate your web3 activities. Have a "Vault" hardware wallet that never interacts with smart contracts, and a small "Burner" software wallet for minting or trading.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <Shield className="text-brand-purple mb-4" size={32} />
              <h3 className="text-xl font-bold text-brand-dark mb-3">Blind Signing Dangers</h3>
              <p className="text-brand-text-gray text-sm mb-4">Never sign a transaction you cannot read. Attackers use `eth_sign` and complex hex data to trick you into transferring ownership of your assets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 bg-brand-purple-bg text-center border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Need a professional security audit?</h2>
          <p className="text-lg text-brand-text-gray mb-8">We provide bespoke security setups for high-net-worth individuals and family offices.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-purple/90 transition-all shadow-lg">
            Contact Security Team <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
