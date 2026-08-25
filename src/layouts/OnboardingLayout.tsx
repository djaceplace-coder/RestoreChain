import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import OnboardingGoals from '../pages/onboarding/OnboardingGoals';
import OnboardingConnect from '../pages/onboarding/OnboardingConnect';
import OnboardingReview from '../pages/onboarding/OnboardingReview';

export default function OnboardingLayout() {
  const location = useLocation();
  
  const getStepNumber = () => {
    if (location.pathname.includes('/goals')) return 1;
    if (location.pathname.includes('/connect')) return 2;
    if (location.pathname.includes('/review')) return 3;
    return 1;
  };
  
  const currentStep = getStepNumber();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-brand-dark">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-xl shadow-md">
            R
          </div>
          <span className="font-display font-bold tracking-tight text-brand-dark hidden sm:block">RestoreChain</span>
        </Link>
        
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                currentStep >= step 
                  ? 'bg-brand-purple text-white ring-4 ring-purple-50' 
                  : 'bg-white border-2 border-gray-200 text-gray-400'
              }`}>
                {step}
              </div>
              {step !== 3 && (
                <div className={`w-8 h-1 mx-1 rounded-full ${currentStep > step ? 'bg-brand-purple' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="w-[120px] text-right">
          <button className="text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors">Save & Exit</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden relative">
          <Routes>
            <Route path="/goals" element={<OnboardingGoals />} />
            <Route path="/connect" element={<OnboardingConnect />} />
            <Route path="/review" element={<OnboardingReview />} />
            {/* Fallback to step 1 */}
            <Route path="*" element={<OnboardingGoals />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
