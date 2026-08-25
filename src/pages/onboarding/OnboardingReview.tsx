import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

export default function OnboardingReview() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setScanning(false), 500);
            return 100;
          }
          return p + Math.floor(Math.random() * 15) + 5;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  if (scanning) {
    return (
      <div className="p-8 md:p-12 text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="text-brand-purple animate-spin mb-6" />
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Scanning your ledger...</h2>
        <p className="text-brand-text-gray text-lg max-w-md mx-auto mb-10">
          We are analyzing your imported transactions for missing cost bases, orphaned transfers, and unclassified DeFi events.
        </p>
        
        <div className="w-full max-w-md bg-gray-100 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-purple transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm font-bold text-brand-purple mt-4">{Math.min(progress, 100)}% Complete</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 animate-fade-in flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <div className="text-4xl font-display font-bold text-green-600">92%</div>
      </div>
      
      <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Scan Complete</h2>
      <p className="text-brand-text-gray text-lg max-w-md mx-auto mb-8">
        Your initial reconciliation score is 92%. We found a few gaps in your transaction history that need your attention.
      </p>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 text-left mb-10 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-brand-dark font-bold">
            <CheckCircle className="text-green-500" size={18} />
            Transactions Synced
          </div>
          <span className="font-bold">1,402</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-dark font-bold">
            <AlertTriangle className="text-orange-500" size={18} />
            Items Needing Review
          </div>
          <span className="font-bold text-orange-600">3</span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/dashboard/reconciliation')}
        className="flex items-center gap-2 px-10 py-4 bg-brand-dark text-white rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg transform hover:-translate-y-0.5"
      >
        Fix Issues in Dashboard <ArrowRight size={20} />
      </button>
    </div>
  );
}
