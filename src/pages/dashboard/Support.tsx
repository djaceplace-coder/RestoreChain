
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Support() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    init();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMsgs = async () => {
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoading(false);
    };

    fetchMsgs();

    const channel = supabase.channel('support_changes-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages', filter: `user_id=eq.${user.id}` }, fetchMsgs)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;
    
    const text = message;
    setMessage('');
    
    await supabase.from('support_messages').insert({
      user_id: user.id,
      sender: 'user',
      message: text
    });
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Center</h1>
        <p className="text-brand-text-gray">Chat securely with our specialists.</p>
      </header>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="font-bold text-brand-dark">Active Ticket</p>
              <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {loading ? (
            <div className="flex justify-center my-auto"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>
          ) : messages.length === 0 ? (
            <div className="text-center my-auto text-gray-400 font-medium">Send a message to start a conversation.</div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-brand-purple text-white rounded-tr-sm' 
                    : 'bg-gray-100 text-brand-dark rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.sender === 'user' && <CheckCircle size={10} className="text-green-500" />}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
            <button type="submit" disabled={!message.trim()} className="p-3 bg-brand-dark text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
