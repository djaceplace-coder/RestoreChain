import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, Search, AlertCircle } from 'lucide-react';

export default function AdminSupport() {
  const [internalNote, setInternalNote] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Queue</h1>
          <p className="text-gray-500">Manage user inquiries and internal escalations.</p>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Ticket List */}
        <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {[
              { id: '#8492', user: 'Jane Doe', subject: 'Kraken Transfer Issue', time: '10:02 AM', active: true },
              { id: '#8491', user: 'Alex Smith', subject: 'Tax report generation failed', time: 'Yesterday', active: false },
              { id: '#8490', user: 'Sam Taylor', subject: 'Missing cost basis for NFT', time: 'Yesterday', active: false },
            ].map(t => (
              <div key={t.id} className={`p-4 cursor-pointer transition-colors ${t.active ? 'bg-red-50 border-l-4 border-red-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-brand-dark">{t.user}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{t.time}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{t.subject}</p>
                <p className="text-[10px] text-gray-400 mt-2">{t.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div>
              <p className="font-bold text-brand-dark flex items-center gap-2">
                Ticket #8492 - Jane Doe
              </p>
              <p className="text-xs text-gray-500">Kraken Transfer Issue</p>
            </div>
            <button className="px-4 py-2 text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              Resolve Ticket
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {/* Same mock messages as user side, plus internal note */}
             <div className="flex flex-col max-w-[80%] mr-auto items-start">
               <div className="p-4 rounded-2xl bg-gray-100 text-brand-dark rounded-tl-sm">
                 <p className="text-sm">Hello! I am a RestoreChain support specialist. How can I assist you with your ledger today?</p>
               </div>
               <span className="text-[10px] font-bold text-gray-400 mt-1">10:00 AM (Agent)</span>
             </div>

             <div className="flex flex-col max-w-[80%] ml-auto items-end">
               <div className="p-4 rounded-2xl bg-brand-dark text-white rounded-tr-sm">
                 <p className="text-sm">I am seeing an orphaned transfer from Kraken on Oct 19th that I cannot resolve.</p>
               </div>
               <span className="text-[10px] font-bold text-gray-400 mt-1">10:02 AM (User)</span>
             </div>

             <div className="flex flex-col max-w-[80%] mr-auto items-start">
               <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-tl-sm flex gap-2">
                 <AlertCircle size={16} className="shrink-0 mt-0.5 text-yellow-600" />
                 <div>
                   <p className="text-xs font-bold uppercase tracking-wider mb-1 text-yellow-600">Internal Note</p>
                   <p className="text-sm">Looks like the Kraken API key expired before the tx settled. I'll prompt her to reconnect.</p>
                 </div>
               </div>
               <span className="text-[10px] font-bold text-gray-400 mt-1">10:04 AM (You)</span>
             </div>
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-600 cursor-pointer hover:text-yellow-600 transition-colors">
                <input type="checkbox" checked={internalNote} onChange={() => setInternalNote(!internalNote)} className="accent-yellow-500 w-4 h-4" />
                Reply as Internal Note (hidden from user)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={internalNote ? "Type an internal note..." : "Reply to Jane..."}
                className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all ${
                  internalNote ? 'bg-yellow-50 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500' : 'bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500'
                }`}
              />
              <button className={`p-3 text-white rounded-xl transition-colors ${
                internalNote ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-600 hover:bg-red-700'
              }`}>
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
