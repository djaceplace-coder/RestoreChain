import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-sm mb-4">
            <ShieldCheck size={16} /> Data Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6">Privacy Policy</h1>
          <p className="text-xl text-brand-text-gray max-w-2xl mx-auto">
            Your privacy and the security of your digital assets are our absolute priority. Learn how we handle, protect, and process your data.
          </p>
          <p className="text-sm text-gray-400 mt-6 font-medium">Last Updated: August 24, 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <Lock className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">End-to-End Encryption</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">All case data and communications are encrypted at rest and in transit using military-grade protocols.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <Eye className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">Strict Confidentiality</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">Your identity and wallet addresses are never published or shared publicly under any circumstances.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <Database className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">Minimal Data Retention</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">We only retain the data strictly necessary for the forensic investigation and legal compliance.</p>
          </div>
        </div>

        <div className="prose prose-lg text-brand-text-gray max-w-none space-y-8 animate-fade-in">
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us when utilizing our forensic and recovery services. This includes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-brand-purple">
              <li><strong>Personal Identifiers:</strong> Name, email address, and phone number.</li>
              <li><strong>Asset Data:</strong> Transaction hashes, wallet addresses, exchange identifiers, and the specifics of the lost or compromised assets.</li>
              <li><strong>Contextual Evidence:</strong> Any screenshots, communications, or documents you upload to assist in the investigation.</li>
              <li><strong>Technical Data:</strong> IP addresses, browser types, and session information collected automatically when you use our platform to ensure security and prevent fraudulent submissions.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">2. How We Use Your Information</h2>
            <p>The primary purpose of data collection is to facilitate the recovery of your digital assets. Specifically, we use your data to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-brand-purple">
              <li>Conduct deep blockchain forensic analysis and trace the flow of funds.</li>
              <li>Verify your identity and ownership of the claimed assets.</li>
              <li>Communicate updates regarding your case status.</li>
              <li>Generate legal affidavits and investigative reports required for asset freezing.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">3. Data Security Infrastructure</h2>
            <p>Security is the foundation of RestoreChain. Our infrastructure is designed to protect highly sensitive financial and personal data:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-brand-purple">
              <li><strong>SOC 2 Type II Compliance:</strong> Our data centers and operational practices undergo regular independent audits.</li>
              <li><strong>Access Controls:</strong> Case data is restricted using principle-of-least-privilege access controls. Only the specific investigators assigned to your case can view the evidence.</li>
              <li><strong>Anonymization:</strong> When cross-referencing global threat databases, your specific wallet addresses are hashed to prevent exposure.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">4. Sharing with Law Enforcement</h2>
            <p>In many recovery scenarios, collaboration with legal authorities is necessary to freeze funds at centralized exchanges. We may share specific, relevant investigative data with appropriate law enforcement agencies (e.g., DOJ, FBI, Europol) or our partnered legal counsel. We only initiate this sharing with your explicit consent or when legally compelled by a valid subpoena.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">5. Your Data Rights</h2>
            <p>Depending on your jurisdiction (such as under the GDPR or CCPA), you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-brand-purple">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data (subject to legal data retention requirements related to financial fraud investigations).</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200 mt-12">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Contact Our Privacy Team</h2>
            <p className="mb-6">If you have any questions about this Privacy Policy, please contact our Data Protection Officer.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors">
              Contact Privacy Team
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
