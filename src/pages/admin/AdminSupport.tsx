import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search, Loader2, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminSupport() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThreads = async () => {
    const { data: tickets } = await supabase.from('support_tickets').select('id, user_id, subject, created_at, status, profiles(email)').neq('status', 'closed');
    if (tickets) {
      // Get the latest message for each ticket to sort them properly
      const { data: messages } = await supabase.from('support_messages').select('ticket_id, created_at').order('created_at', { ascending: false });
      
      const latestMsgMap = {};
      if (messages) {
         messages.forEach(m => {
            if (!latestMsgMap[m.ticket_id]) latestMsgMap[m.ticket_id] = m.created_at;
         });
      }

      let formattedThreads = tickets.map(t => ({
        ticket_id: t.id,
        user_id: t.user_id,
        email: (t.profiles as any)?.email || 'Unknown',
        subject: t.subject,
        status: t.status,
        latest_time: latestMsgMap[t.id] || t.created_at
      }));
      
      // Sort by latest message time
      formattedThreads.sort((a, b) => new Date(b.latest_time).getTime() - new Date(a.latest_time).getTime());
      
      setThreads(formattedThreads);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchThreads();
    const channel = supabase.channel('admin_support_threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchThreads)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, fetchThreads)
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
        .eq('ticket_id', activeUser.ticket_id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMsgs();

    const channel = supabase.channel('admin_active_thread')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${activeUser.ticket_id}` }, fetchMsgs)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeUser]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeUser) return;
    
    const text = reply;
    setReply('');
    setIsSending(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Optimistic UI
    const optimisticMsg = {
      id: 'temp-' + Date.now(),
      ticket_id: activeUser.ticket_id,
      sender_id: user?.id,
      message: `__ADMIN__${text}`,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    
    await supabase.from('support_messages').insert({
      ticket_id: activeUser.ticket_id,
      sender_id: user?.id,
      message: `__ADMIN__${text}`
    });
    
    // Add notification for the user
    await supabase.from('notifications').insert({
      user_id: activeUser.user_id,
      type: 'system',
      title: 'Support Update',
      message: 'You have a new reply from support.',
      is_read: false
    });
    
    setIsSending(false);
  };
  
  const deleteChat = async () => {
    if (!activeUser) return;
    const confirmDelete = window.confirm('Are you sure you want to completely delete this chat session?');
    if (!confirmDelete) return;
    
    await supabase.from('support_tickets').update({ status: 'closed' }).eq('id', activeUser.ticket_id);
    setActiveUser(null);
    fetchThreads();
  };

  const resolveChat = async () => {
    if (!activeUser) return;
    await supabase.from('support_tickets').update({ status: 'resolved' }).eq('id', activeUser.ticket_id);
    fetchThreads();
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Queue</h1>
          <p className="text-gray-500">Manage user inquiries and chat sessions.</p>
        </div>
        <button 
          onClick={async () => {
            const confirm = window.confirm('Mark all open tickets as read?');
            if (confirm) {
               await supabase.from('support_tickets').update({ status: 'in_progress' }).eq('status', 'open');
               fetchThreads();
            }
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors text-sm"
        >
          Mark All as Read
        </button>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Ticket List */}
        <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hidden sm:flex">
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
                key={t.ticket_id} 
                onClick={async () => {
                  setActiveUser(t);
                  if (t.status === 'open') {
                    await supabase.from('support_tickets').update({ status: 'in_progress' }).eq('id', t.ticket_id);
                    fetchThreads();
                  }
                }}
                className={`p-4 cursor-pointer transition-colors ${activeUser?.ticket_id === t.ticket_id ? 'bg-red-50 border-l-4 border-red-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-brand-dark truncate">{t.email}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === 'open' ? 'bg-red-100 text-red-700' : t.status === 'resolved' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}`}>
                    {t.status}
                  </span>
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
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-2">
                <p className="font-bold text-brand-dark">{activeUser.email} <span className="text-gray-400 font-normal ml-2">({activeUser.status})</span></p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={resolveChat}
                    className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <CheckCircle size={14} /> Close Chat
                  </button>
                  <button 
                    onClick={deleteChat}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">
                {messages.map(msg => {
                   const isAdmin = msg.message.startsWith('__ADMIN__');
                   const text = isAdmin ? msg.message.replace('__ADMIN__', '') : msg.message;

                   return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <div className={`p-4 rounded-2xl ${
                        isAdmin 
                           ? 'bg-red-600 text-white rounded-tr-sm' 
                           : 'bg-gray-100 text-brand-dark rounded-tl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{text}</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {isAdmin ? '(You)' : ''}
                      </span>
                    </div>
                  );
                })}
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
                  <button type="submit" disabled={!reply.trim() || isSending} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium">
              <MessageSquare size={48} className="mb-4 text-gray-200" />
              <p>Select a thread to view messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
