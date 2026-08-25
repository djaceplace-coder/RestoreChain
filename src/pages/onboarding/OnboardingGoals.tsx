import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Activity, TrendingDown, TrendingUp, HelpCircle, BarChart2 } from 'lucide-react';

export default function OnboardingGoals() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const goals = [
    { id: 'taxes', label: 'File my crypto taxes', icon: FileText },
    { id: 'track', label: 'Track my portfolio', icon: Activity },
    { id: 'reduce', label: 'Reduce my tax bill', icon: TrendingDown },
    { id: 'understand', label: 'Understand performance', icon: TrendingUp },
    { id: 'overpaying', label: "Learn if I'm overpaying", icon: HelpCircle },
    { id: 'insights', label: 'Get portfolio insights', icon: BarChart2 },
  ];

  const toggleGoal = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="p-8 md:p-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-3">What brings you here?</h2>
        <p className="text-brand-text-gray text-lg">Select your primary goals so we can personalize your RestoreChain experience.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {goals.map(goal => {
          const isSelected = selected.includes(goal.id);
          const Icon = goal.icon;
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 flex items-center gap-4 rounded-2xl border-2 transition-all ${
                isSelected 
                  ? 'border-brand-purple bg-purple-50 text-brand-purple' 
                  : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className={`p-2 rounded-xl ${isSelected ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-500'}`}>
                <Icon size={20} />
              </div>
              <span className="font-bold text-left">{goal.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => navigate('/onboarding/connect')}
          disabled={selected.length === 0}
          className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
            selected.length > 0
              ? 'bg-brand-dark text-white hover:bg-black shadow-lg shadow-black/20 transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
