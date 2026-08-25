import React, { useState } from 'react';
import { Receipt, Download, AlertTriangle } from 'lucide-react';

export default function Taxes() {
  const [year, setYear] = useState('2026');

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Tax Reports</h1>
          <p className="text-brand-text-gray">View your estimated liabilities and generate tax documents.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          {['2026', '2025', '2024'].map(y => (
            <button 
              key={y}
              onClick={() => setYear(y)}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${
                year === y ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500 hover:text-brand-dark'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-8 flex gap-3">
        <AlertTriangle className="text-orange-500 shrink-0" />
        <p className="text-sm text-orange-800 font-bold">
          Your ledger is currently at 92% reconciliation. We recommend resolving the 3 outstanding items before generating final tax forms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-brand-dark mb-6">Capital Gains Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Short-Term Capital Gains</span>
              <span className="font-bold text-red-500">+$4,250.00</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Long-Term Capital Gains</span>
              <span className="font-bold text-green-500">-$1,200.00</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-brand-dark text-lg">Net Capital Gains</span>
              <span className="font-bold text-brand-dark text-lg">+$3,050.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-brand-dark mb-6">Income Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Staking & Mining</span>
              <span className="font-bold text-brand-dark">+$840.50</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Airdrops</span>
              <span className="font-bold text-brand-dark">+$120.00</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-brand-dark text-lg">Total Taxable Income</span>
              <span className="font-bold text-brand-dark text-lg">+$960.50</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-brand-dark mb-4">Generate Forms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: 'IRS Form 8949', desc: 'PDF Format' },
          { name: 'TurboTax Online', desc: 'CSV Export' },
          { name: 'Full Transaction History', desc: 'CSV Export' },
        ].map((doc, i) => (
          <button key={i} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-brand-purple hover:bg-purple-50 transition-colors group">
            <Download size={24} className="text-gray-400 group-hover:text-brand-purple mb-3" />
            <span className="font-bold text-brand-dark">{doc.name}</span>
            <span className="text-xs text-gray-500 mt-1">{doc.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
