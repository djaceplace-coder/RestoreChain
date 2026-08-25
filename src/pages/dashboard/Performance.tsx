import React from 'react';
import { TrendingUp, ArrowUpRight, Download } from 'lucide-react';

export default function Performance() {
  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Portfolio Performance</h1>
          <p className="text-brand-text-gray">Historical tracking and yield analysis.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-brand-dark font-bold rounded-xl hover:bg-gray-50 transition-colors">
          <Download size={18} /> Export Data
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm md:col-span-2">
           <h3 className="font-bold text-brand-dark mb-6 text-lg">Value Over Time</h3>
           {/* Mock Chart Area */}
           <div className="h-64 w-full bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden flex items-end">
             {/* Fake SVG Line */}
             <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0 100 L 10 90 L 20 85 L 30 95 L 40 70 L 50 60 L 60 75 L 70 40 L 80 50 L 90 20 L 100 10" fill="none" stroke="#6C5CE7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
               <path d="M0 100 L 10 90 L 20 85 L 30 95 L 40 70 L 50 60 L 60 75 L 70 40 L 80 50 L 90 20 L 100 10 L 100 100 Z" fill="url(#gradient)" opacity="0.2" stroke="none" />
               <defs>
                 <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#6C5CE7" />
                   <stop offset="100%" stopColor="transparent" />
                 </linearGradient>
               </defs>
             </svg>
           </div>
           <div className="flex justify-between mt-4 text-xs font-bold text-gray-400">
             <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
           </div>
         </div>
         
         <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Return</p>
             <p className="text-3xl font-display font-bold text-green-500 flex items-center gap-2">
               +42.5% <ArrowUpRight size={24} />
             </p>
             <p className="text-sm font-bold text-brand-dark mt-2">+$14,250.00 All Time</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Best Performer</p>
             <div className="flex items-center gap-3 mt-3">
               <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">B</div>
               <div>
                 <p className="font-bold text-brand-dark">Bitcoin (BTC)</p>
                 <p className="text-sm font-bold text-green-500">+124.5% YTD</p>
               </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
