import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckCircle, Loader2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Support() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    init();
  }, []);

  const loadTickets = async (userId: string) => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'closed');
    
    if (data) {
      // Get the latest message for each ticket to sort them properly
      const { data: messages } = await supabase.from('support_messages').select('ticket_id, created_at').order('created_at', { ascending: false });
      
      const latestMsgMap = {};
      if (messages) {
         messages.forEach(m => {
            if (!latestMsgMap[m.ticket_id]) latestMsgMap[m.ticket_id] = m.created_at;
         });
      }

      let formattedTickets = data.map(t => ({
        ...t,
        latest_time: latestMsgMap[t.id] || t.created_at
      }));
      
      // Sort by latest message time
      formattedTickets.sort((a, b) => new Date(b.latest_time).getTime() - new Date(a.latest_time).getTime());

      setTickets(formattedTickets);
      if (formattedTickets.length > 0 && !ticket) {
        setTicket(formattedTickets[0]);
      } else if (formattedTickets.length === 0) {
        setTicket(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    loadTickets(user.id);

    const channel = supabase.channel('support_tickets_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
         loadTickets(user.id);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, () => {
         loadTickets(user.id);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    if (!ticket) {
      setMessages([]);
      return;
    }
    const loadMsgs = async () => {
      const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    loadMsgs();

    const channel = supabase.channel('support_msgs_' + ticket.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${ticket.id}` }, loadMsgs)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [ticket]);

  const createNewChat = async () => {
    if (!user) return;
    const { data: newTicket } = await supabase.from('support_tickets').insert({ user_id: user.id, subject: 'Support Chat' }).select().single();
    if (newTicket) {
      setTicket(newTicket);
      loadTickets(user.id);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !ticket) return;
    
    const text = message;
    setMessage('');
    setIsSending(true);
    
    // Optimistic UI
    const optimisticMsg = {
      id: 'temp-' + Date.now(),
      ticket_id: ticket.id,
      sender_id: user.id,
      message: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    
    // If ticket was resolved, reopen it
    if (ticket.status === 'resolved') {
      await supabase.from('support_tickets').update({ status: 'open' }).eq('id', ticket.id);
    }
    
    await supabase.from('support_messages').insert({
      ticket_id: ticket.id,
      sender_id: user.id,
      message: text
    });
    
    setIsSending(false);
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Center</h1>
        <p className="text-brand-text-gray">Chat securely with our specialists.</p>
      </header>
      
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Ticket List Sidebar */}
        <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden hidden md:flex">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-brand-dark">Your Chats</h2>
            <button onClick={createNewChat} className="p-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-purple" /></div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No chat sessions.</div>
            ) : (
              tickets.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setTicket(t)}
                  className={`p-4 cursor-pointer transition-colors ${ticket?.id === t.id ? 'bg-purple-50 border-l-4 border-brand-purple' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-brand-dark truncate">{t.subject || 'Support Chat'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          {ticket ? (
            <>
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark">Support Team</p>
                    <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                      {ticket.status === 'resolved' ? 'Resolved (Reply to reopen)' : 'Online'}
                    </p>
                  </div>
                </div>
                {/* Mobile new chat button */}
                <button onClick={createNewChat} className="md:hidden p-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">
                {messages.length === 0 ? (
                  <div className="text-center my-auto text-gray-400 font-medium">Send a message to start the conversation.</div>
                ) : (
                  messages.map(msg => {
                    const isAdmin = msg.message.startsWith('__ADMIN__');
                    const text = isAdmin ? msg.message.replace('__ADMIN__', '') : msg.message;
                    
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[80%] ${!isAdmin ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        <div className={`p-4 rounded-2xl ${
                          !isAdmin 
                             ? 'bg-brand-purple text-white rounded-tr-sm' 
                             : 'bg-gray-100 text-brand-dark rounded-tl-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{text}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {!isAdmin && <CheckCircle size={10} className="text-green-500" />}
                        </span>
                      </div>
                    );
                  })
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
                  <button type="submit" disabled={!message.trim() || isSending} className="p-3 bg-brand-dark text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50">
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <MessageSquare size={48} className="mb-4 text-gray-200" />
              <h3 className="font-bold text-gray-600 mb-2">No Active Chat</h3>
              <p className="text-sm mb-6">Start a new conversation with our support team.</p>
              <button onClick={createNewChat} className="px-6 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                Start New Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
