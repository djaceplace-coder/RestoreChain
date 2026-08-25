import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Search, CheckCircle } from 'lucide-react';

export default function OnboardingConnect() {
  const navigate = useNavigate();
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);

  const mockConnect = () => {
    setConnectedCount(c => c + 1);
  };

  if (showSkipWarning) {
    return (
      <div className="p-8 md:p-12 text-center animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">First, connect your crypto</h2>
        <p className="text-brand-text-gray text-lg max-w-md mx-auto mb-10">
          We need at least one wallet or exchange to generate your portfolio value, performance insights, and tax reports.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
          <button 
            onClick={() => setShowSkipWarning(false)}
            className="w-full px-8 py-4 bg-brand-purple text-white rounded-xl font-bold text-lg hover:bg-brand-purple/90 transition-colors shadow-lg"
          >
            Connect crypto
          </button>
          <button 
            onClick={() => navigate('/onboarding/review')}
            className="w-full px-8 py-4 bg-transparent text-gray-400 rounded-xl font-bold hover:text-brand-dark hover:bg-gray-50 transition-colors"
          >
            Skip (Not recommended)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 animate-fade-in flex flex-col h-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-3">Link your accounts</h2>
        <p className="text-brand-text-gray text-lg">Connect your exchanges and wallets to import your transaction history. We only request read access.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-8 pr-2">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={mockConnect} className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-brand-purple hover:bg-purple-50 transition-colors group relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">C</div>
            <span className="font-bold text-brand-dark group-hover:text-brand-purple">Connect to Coinbase</span>
          </button>
          <button onClick={mockConnect} className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-brand-purple hover:bg-purple-50 transition-colors group relative">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">K</div>
            <span className="font-bold text-brand-dark group-hover:text-brand-purple">Connect to Kraken</span>
          </button>
        </div>

        <div className="space-y-3">
          <button onClick={mockConnect} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <Search size={20} />
              </div>
              <span className="font-bold text-brand-dark">Search 300+ Exchanges</span>
            </div>
            <Plus className="text-gray-400" />
          </button>
          <button onClick={mockConnect} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <Search size={20} />
              </div>
              <span className="font-bold text-brand-dark">Search 10,000+ Wallets</span>
            </div>
            <Plus className="text-gray-400" />
          </button>
        </div>

        {connectedCount > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="text-green-500 shrink-0" />
            <p className="text-green-800 font-bold text-sm">Successfully connected {connectedCount} account{connectedCount > 1 ? 's' : ''}.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
        <button 
          onClick={() => connectedCount > 0 ? navigate('/onboarding/review') : setShowSkipWarning(true)}
          className="text-gray-400 font-bold hover:text-brand-dark transition-colors"
        >
          Skip
        </button>
        <button 
          onClick={() => connectedCount > 0 ? navigate('/onboarding/review') : setShowSkipWarning(true)}
          className={`px-8 py-3 rounded-xl font-bold transition-all ${
            connectedCount > 0 
              ? 'bg-brand-dark text-white hover:bg-black shadow-lg' 
              : 'bg-brand-purple text-white hover:bg-brand-purple/90 shadow-lg'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
