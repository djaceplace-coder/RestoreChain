import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Scale, CheckCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-sm mb-4">
            <FileText size={16} /> Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6">Terms of Service</h1>
          <p className="text-xl text-brand-text-gray max-w-2xl mx-auto">
            These terms govern your use of the RestoreChain platform and our forensic investigation services.
          </p>
          <p className="text-sm text-gray-400 mt-6 font-medium">Last Updated: August 24, 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <Scale className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">Technical Service</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">We provide highly specialized blockchain forensics. We are not a law firm and do not provide legal advice.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <AlertTriangle className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">No Guarantees</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">Due to the decentralized nature of crypto, we cannot guarantee 100% recovery of lost or stolen assets.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <CheckCircle className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">Contingency Based</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">In many cases, our fees are purely contingent upon the successful recovery and return of your digital assets.</p>
          </div>
        </div>

        <div className="prose prose-lg text-brand-text-gray max-w-none space-y-8 animate-fade-in">
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">1. Agreement to Terms</h2>
            <p>By accessing or using the RestoreChain platform, client portal, or engaging our forensic investigation services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service. These Terms apply to all visitors, users, and others who access or use the Service.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">2. Scope of Service</h2>
            <p>RestoreChain provides proprietary blockchain forensic analysis, transaction tracing, and technical advisory services for digital asset recovery. Our services include:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-brand-purple">
              <li>On-chain footprint analysis and de-anonymization techniques.</li>
              <li>Compiling actionable intelligence reports for law enforcement.</li>
              <li>Liaising with compliance teams at centralized exchanges to freeze stolen assets.</li>
            </ul>
            <p className="mt-4"><strong>Disclaimer:</strong> RestoreChain is a technical investigation firm, not a law firm. We do not provide legal representation, legal advice, or financial advisory services.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">3. No Guarantee of Recovery</h2>
            <p>While we employ state-of-the-art tools and methodologies, the decentralized, pseudonymous, and immutable nature of blockchain networks means we cannot guarantee the successful recovery of stolen or lost assets. Recovery is contingent upon numerous factors entirely outside of our control, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-brand-purple">
              <li>The attacker's operational security and laundering methodology.</li>
              <li>The cooperation and responsiveness of centralized exchanges.</li>
              <li>The jurisdiction and resources of involved law enforcement agencies.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">4. Fee Structure & Contingency</h2>
            <p>If you engage RestoreChain on a contingency basis ("No Recovery, No Fee"), our recovery fee is only triggered upon the successful return of assets to your direct control or to a designated, mutually agreed-upon multi-sig escrow wallet. The specific percentage fee and any applicable upfront investigation costs will be explicitly detailed in a separate Retainer Agreement before any work commences.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">5. User Responsibilities</h2>
            <p>To facilitate an effective investigation, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-brand-purple">
              <li>Provide accurate, truthful, and complete information regarding the incident.</li>
              <li>Not interfere with the investigation or attempt parallel recovery actions without our knowledge, which may jeopardize freezing efforts.</li>
              <li>Maintain the confidentiality of your client portal credentials.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">6. Limitation of Liability</h2>
            <p>In no event shall RestoreChain, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </section>

          <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200 mt-12">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Questions about our Terms?</h2>
            <p className="mb-6">If you have any questions or concerns about these terms of service, please contact our legal team.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors">
              Contact Legal Team
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
