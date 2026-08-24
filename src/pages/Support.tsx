import React from 'react';
import { LifeBuoy, AlertTriangle, FileText, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Support() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="py-24 bg-brand-dark text-white text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <LifeBuoy className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl font-display font-bold mb-6">Support & Emergency Contact</h1>
          <p className="text-xl text-gray-400">Our analysts are available 24/7 for active incident response.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col">
              <AlertTriangle className="text-red-500 mb-6" size={32} />
              <h3 className="text-2xl font-bold text-brand-dark mb-4">Report an Active Theft</h3>
              <p className="text-brand-text-gray mb-8 flex-1">If funds have been stolen within the last 72 hours, time is critical. Submit your transaction hash immediately.</p>
              <Link to="/signup" className="w-full text-center bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors">Emergency Intake Form</Link>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col">
              <Mail className="text-brand-purple mb-6" size={32} />
              <h3 className="text-2xl font-bold text-brand-dark mb-4">General Inquiries</h3>
              <p className="text-brand-text-gray mb-8 flex-1">For law enforcement partnerships, API access, or media requests, contact our corporate team.</p>
              <Link to="/contact" className="w-full text-center bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-black transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center border-t border-gray-100">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">PGP Key / Secure Comms</h2>
        <p className="text-brand-text-gray mb-8 max-w-2xl mx-auto">For highly sensitive intelligence sharing, we support encrypted channels. Please initiate contact via the standard portal to establish a secure line.</p>
        <Link to="/signup" className="text-brand-purple font-bold hover:underline flex justify-center items-center gap-2">Proceed to Portal <ArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
