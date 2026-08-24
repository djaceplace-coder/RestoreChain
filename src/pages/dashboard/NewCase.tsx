import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, UploadCloud, ShieldCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NewCase() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between relative mb-2">
            {/* Progress Bar Background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
            {/* Active Progress */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-purple rounded-full -z-10 transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  step >= i 
                    ? 'bg-brand-purple text-white ring-4 ring-purple-50' 
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500 mt-2 px-1">
            <span>Asset Details</span>
            <span>Incident Context</span>
            <span>Verification</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-8 sm:p-12 relative">
        
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">What was lost?</h1>
            <p className="text-brand-text-gray mb-8">Provide the specifics of the compromised assets.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Asset Type</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors appearance-none font-medium">
                  <option>Cryptocurrency (Bitcoin, Ethereum, etc.)</option>
                  <option>Fiat Currency (Wire Transfer, ACH)</option>
                  <option>NFTs or Digital Collectibles</option>
                  <option>Other Digital Assets</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Value (USD)</label>
                <input 
                  type="text" 
                  placeholder="e.g., $10,000" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Transaction ID or Hash (if applicable)</label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors font-medium"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button onClick={handleNext} className="flex items-center gap-2 px-8 py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Incident Context</h1>
            <p className="text-brand-text-gray mb-8">Tell us what happened so our forensic team can analyze the vector.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date of Incident</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors font-medium text-brand-dark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description of Events</label>
                <textarea 
                  rows={4}
                  placeholder="Please describe exactly how the loss occurred..." 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors font-medium resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Evidence (Screenshots, Emails)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <p className="font-bold text-brand-dark">Click to upload files</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-between">
              <button onClick={handlePrev} className="flex items-center gap-2 px-6 py-4 text-brand-text-gray font-bold rounded-xl hover:bg-gray-100 transition-colors">
                <ArrowLeft size={20} /> Back
              </button>
              <button onClick={handleNext} className="flex items-center gap-2 px-8 py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Verify & Submit</h1>
            <p className="text-brand-text-gray mb-8">Review our terms and submit your case for forensic analysis.</p>
            
            <div className="bg-brand-purple/5 border border-brand-purple/20 p-6 rounded-2xl mb-8 flex gap-4 text-brand-dark">
              <ShieldCheck size={24} className="text-brand-purple shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-1">Confidentiality Guarantee</h3>
                <p className="text-sm text-brand-text-gray leading-relaxed">All data submitted is end-to-end encrypted and strictly used by our certified investigators for asset recovery purposes.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-brand-purple" />
                <span className="text-sm font-medium text-gray-700">I confirm that all provided information is accurate to the best of my knowledge.</span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-brand-purple" />
                <span className="text-sm font-medium text-gray-700">I agree to the Terms of Service and authorize RestoreChain to begin initial forensic investigation.</span>
              </label>

              <div className="mt-10 flex justify-between">
                <button type="button" onClick={handlePrev} className="flex items-center gap-2 px-6 py-4 text-brand-text-gray font-bold rounded-xl hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={20} /> Back
                </button>
                <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-brand-purple/30">
                  Submit Case
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in text-center py-10">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-4xl font-display font-bold text-brand-dark mb-4">Case Submitted</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Your recovery request <strong className="text-brand-dark">RC-2026-9901B</strong> has been successfully submitted. Our investigators will review it shortly.</p>
            
            <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
              Return to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
