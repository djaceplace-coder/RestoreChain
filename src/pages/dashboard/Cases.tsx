import React from 'react';
import { Search, Filter, FileText, ArrowRight } from 'lucide-react';

export default function Cases() {
  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">My Cases</h1>
        <p className="text-brand-text-gray">Manage and track your recovery operations.</p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search cases by ID or asset..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Filter size={16} />
            Filter Status
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Case ID</th>
                <th className="px-6 py-4 font-bold">Asset Type</th>
                <th className="px-6 py-4 font-bold">Amount Lost</th>
                <th className="px-6 py-4 font-bold">Date Submitted</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/80 transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-brand-dark block">RC-2026-8942A</span>
                      <span className="text-xs text-brand-text-gray">Phishing Scam</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">ETH</div>
                    <span className="font-medium text-brand-dark">Ethereum</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-brand-dark font-bold">4.2 ETH</span>
                </td>
                <td className="px-6 py-5 text-sm text-brand-text-gray">
                  Aug 23, 2026
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                    Investigation
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button className="flex items-center gap-1 text-sm font-bold text-brand-purple hover:text-brand-dark transition-colors">
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <span>Showing 1 to 1 of 1 results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 bg-white rounded-lg opacity-50 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded-lg opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
