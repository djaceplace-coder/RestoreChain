const fs = require('fs');

let support = fs.readFileSync('src/pages/dashboard/Support.tsx', 'utf8');

// 1. Add useRef for auto-scrolling
if (!support.includes('useRef')) {
  support = support.replace(
    `import React, { useState, useEffect } from 'react';`,
    `import React, { useState, useEffect, useRef } from 'react';`
  );
}

// Add scrollRef inside component
support = support.replace(
  `const [loading, setLoading] = useState(true);`,
  `const [loading, setLoading] = useState(true);\n  const [isSending, setIsSending] = useState(false);\n  const scrollRef = useRef<HTMLDivElement>(null);\n\n  const scrollToBottom = () => {\n    if (scrollRef.current) {\n      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;\n    }\n  };\n\n  useEffect(() => {\n    scrollToBottom();\n  }, [messages]);`
);

// 2. Modify sendMessage to have optimistic UI
const oldSend = `  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !ticket) return;
    
    const text = message;
    setMessage('');
    
    // If ticket was resolved, reopen it
    if (ticket.status === 'resolved') {
      await supabase.from('support_tickets').update({ status: 'open' }).eq('id', ticket.id);
    }
    
    await supabase.from('support_messages').insert({
      ticket_id: ticket.id,
      sender_id: user.id,
      message: text
    });
  };`;

const newSend = `  const sendMessage = async (e: React.FormEvent) => {
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
  };`;

support = support.replace(oldSend, newSend);

// 3. Add scrollRef to the messages container
support = support.replace(
  `<div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">`,
  `<div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">`
);

// 4. Update the send button to show spinner
support = support.replace(
  `<button type="submit" disabled={!message.trim()} className="p-3 bg-brand-dark text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50">
                    <Send size={20} />
                  </button>`,
  `<button type="submit" disabled={!message.trim() || isSending} className="p-3 bg-brand-dark text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50">
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>`
);

fs.writeFileSync('src/pages/dashboard/Support.tsx', support);
console.log('Updated Support.tsx');
