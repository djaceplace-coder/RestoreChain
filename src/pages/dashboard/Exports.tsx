import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

export default function Exports() {
  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Data Exports</h1>
        <p className="text-brand-text-gray">Download your raw data for external accounting tools.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand-purple transition-colors">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <FileSpreadsheet size={24} />
          </div>
          <h3 className="font-bold text-brand-dark text-lg mb-2">Universal CSV</h3>
          <p className="text-sm text-gray-500 mb-6">A complete dump of all normalized transactions across all your connected wallets and exchanges.</p>
          <button className="w-full py-3 bg-gray-50 text-brand-dark font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Download size={18} /> Download CSV
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand-purple transition-colors">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-brand-dark text-lg mb-2">Accountant Summary</h3>
          <p className="text-sm text-gray-500 mb-6">A high-level PDF overview of ending balances, realized gains, and total taxable income.</p>
          <button className="w-full py-3 bg-gray-50 text-brand-dark font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
