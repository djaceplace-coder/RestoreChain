import React from 'react';
import { Shield, Key, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';

export default function AccountHealth() {
  const checks = [
    { name: 'Two-Factor Authentication', status: 'enabled', icon: Smartphone, description: 'Authenticator app configured.' },
    { name: 'API Key Expirations', status: 'warning', icon: Key, description: 'Kraken API key expires in 2 days.' },
    { name: 'Reconciliation Status', status: 'warning', icon: AlertTriangle, description: '3 items need your review.' },
    { name: 'Verified Email', status: 'enabled', icon: CheckCircle, description: 'Email address confirmed.' },
  ];

  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Account Health</h1>
        <p className="text-brand-text-gray">Security checks and connection statuses.</p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-orange-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-brand-dark">75</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-dark">Health Score: Fair</h2>
            <p className="text-sm text-gray-500">Address the warnings below to secure your account and data.</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {checks.map((check, i) => (
            <div key={i} className="p-6 flex items-start gap-4">
              <div className={`p-2 rounded-xl shrink-0 ${
                check.status === 'enabled' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                <check.icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-dark mb-1">{check.name}</h3>
                <p className="text-sm text-gray-500">{check.description}</p>
              </div>
              <div className="shrink-0">
                {check.status === 'warning' && (
                  <button className="px-4 py-2 bg-white border border-gray-200 text-brand-dark font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors">
                    Fix Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
