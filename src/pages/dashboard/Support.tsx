import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, Clock } from 'lucide-react';

export default function Support() {
  const [message, setMessage] = useState('');
  
  const messages = [
    { id: 1, sender: 'agent', text: 'Hello! I am a RestoreChain support specialist. How can I assist you with your ledger today?', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'I am seeing an orphaned transfer from Kraken on Oct 19th that I cannot resolve.', time: '10:02 AM' },
    { id: 3, sender: 'agent', text: 'I see that item (RC-1052). Let me check the on-chain data for that specific block. One moment.', time: '10:05 AM' },
  ];

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Center</h1>
        <p className="text-brand-text-gray">Chat securely with our reconciliation specialists.</p>
      </header>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="font-bold text-brand-dark">Active Ticket: #8492</p>
              <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Agent Online
              </p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors">
            Close Ticket
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">Today</span>
          </div>
          
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <div className={`p-4 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-brand-purple text-white rounded-tr-sm' 
                  : 'bg-gray-100 text-brand-dark rounded-tl-sm'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                {msg.time} {msg.sender === 'user' && <CheckCircle size={10} className="text-green-500" />}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <button className="p-3 text-gray-400 hover:text-brand-purple hover:bg-purple-50 rounded-xl transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
            <button className="p-3 bg-brand-dark text-white rounded-xl hover:bg-black transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick helper
const CheckCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
)
