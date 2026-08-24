import React from 'react';
import { Activity, ShieldCheck, FileText, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 1200 },
  { name: 'Mar', value: 800 },
  { name: 'Apr', value: 2500 },
  { name: 'May', value: 1800 },
  { name: 'Jun', value: 3400 },
  { name: 'Jul', value: 4200 },
];

export default function Overview() {
  return (
    <div className="animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">Welcome back, Jane</h1>
          <p className="text-brand-text-gray mt-1">Here is the status of your recovery operations.</p>
        </div>
        <Link to="/dashboard/new-case" className="flex items-center justify-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all hover:scale-[1.02] shadow-lg whitespace-nowrap">
          <Activity size={20} />
          Start New Case
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium">Active Cases</h3>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Activity size={20} /></div>
          </div>
          <p className="text-4xl font-display font-bold text-brand-dark">1</p>
          <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
            <TrendingUp size={16} /> +1 this month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium">Recovered Funds</h3>
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><ShieldCheck size={20} /></div>
          </div>
          <p className="text-4xl font-display font-bold text-brand-dark">$0.00</p>
          <p className="text-sm text-brand-text-gray mt-2 font-medium">Pending initial review</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium">Action Required</h3>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl"><FileText size={20} /></div>
          </div>
          <p className="text-4xl font-display font-bold text-brand-dark">1</p>
          <p className="text-sm text-orange-600 mt-2 font-medium bg-orange-50 px-2 py-1 rounded-lg inline-block">Identity verification</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-xl font-bold font-display text-brand-dark mb-6">Recovery Projection</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Cases sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-brand-dark">Recent Cases</h2>
            <Link to="/dashboard/cases" className="text-sm font-bold text-brand-purple hover:underline">View all</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="group block p-4 rounded-xl border border-gray-100 hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-brand-dark">RC-2026-8942A</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Investigation
                </span>
              </div>
              <p className="text-sm text-brand-text-gray mb-3">4.2 ETH • Suspicious transfer</p>
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Aug 23, 2026</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-purple transition-colors" />
              </div>
            </div>
            
            <div className="block p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
              No other recent cases found.
            </div>
          </div>
          
          <Link to="/dashboard/new-case" className="mt-6 w-full py-3 border border-gray-200 text-brand-dark font-bold rounded-xl text-center hover:bg-gray-50 transition-colors">
            Start New Case
          </Link>
        </div>

      </div>
    </div>
  );
}
