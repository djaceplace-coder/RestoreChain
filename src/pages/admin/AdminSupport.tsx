
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminSupport() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');

  const fetchThreads = async () => {
    // A simple way to get unique users who have sent a message
    const { data: msgs } = await supabase.from('support_messages').select('user_id, profiles(email), created_at').order('created_at', { ascending: false });
    if (msgs) {
      // Group by user_id
      const map = new Map();
      msgs.forEach(m => {
        if (!map.has(m.user_id)) {
          map.set(m.user_id, {
            user_id: m.user_id,
            email: (m.profiles as any)?.email || 'Unknown',
            latest_time: m.created_at
          });
        }
      });
      setThreads(Array.from(map.values()));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();
    const channel = supabase.channel('admin_support_threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, fetchThreads)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!activeUser) {
      setMessages([]);
      return;
    }
    const fetchMsgs = async () => {
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', activeUser.user_id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMsgs();

    const channel = supabase.channel('admin_active_thread')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages', filter: `user_id=eq.${activeUser.user_id}` }, fetchMsgs)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeUser]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeUser) return;
    
    const text = reply;
    setReply('');
    
    await supabase.from('support_messages').insert({
      user_id: activeUser.user_id,
      sender: 'agent',
      message: text
    });
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Queue</h1>
        <p className="text-gray-500">Manage user inquiries.</p>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Ticket List */}
        <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-brand-dark">Active Threads</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-red-500" /></div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No support threads found.</div>
            ) : threads.map(t => (
              <div 
                key={t.user_id} 
                onClick={() => setActiveUser(t)}
                className={`p-4 cursor-pointer transition-colors ${activeUser?.user_id === t.user_id ? 'bg-red-50 border-l-4 border-red-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-brand-dark truncate">{t.email}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(t.latest_time).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          {activeUser ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <p className="font-bold text-brand-dark">{activeUser.email}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'agent' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className={`p-4 rounded-2xl ${
                      msg.sender === 'agent' 
                        ? 'bg-red-600 text-white rounded-tr-sm' 
                        : 'bg-gray-100 text-brand-dark rounded-tl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({msg.sender})
                    </span>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center text-gray-400 mt-10">No messages yet.</p>}
              </div>
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={sendReply} className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply to user..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                  <button type="submit" disabled={!reply.trim()} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
              Select a thread to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
