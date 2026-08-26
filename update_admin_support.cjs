const fs = require('fs');

let adminSupport = fs.readFileSync('src/pages/admin/AdminSupport.tsx', 'utf8');

if (!adminSupport.includes('useRef')) {
  adminSupport = adminSupport.replace(
    `import React, { useState, useEffect } from 'react';`,
    `import React, { useState, useEffect, useRef } from 'react';`
  );
}

adminSupport = adminSupport.replace(
  `const [reply, setReply] = useState('');`,
  `const [reply, setReply] = useState('');\n  const [isSending, setIsSending] = useState(false);\n  const scrollRef = useRef<HTMLDivElement>(null);\n\n  const scrollToBottom = () => {\n    if (scrollRef.current) {\n      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;\n    }\n  };\n\n  useEffect(() => {\n    scrollToBottom();\n  }, [messages]);`
);

const oldSend = `  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeUser) return;
    
    const text = reply;
    setReply('');
    
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('support_messages').insert({
      ticket_id: activeUser.ticket_id,
      sender_id: user?.id,
      message: \`__ADMIN__\${text}\`
    });
  };`;

const newSend = `  const sendReply = async (e: React.FormEvent) => {
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
      message: \`__ADMIN__\${text}\`,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    
    await supabase.from('support_messages').insert({
      ticket_id: activeUser.ticket_id,
      sender_id: user?.id,
      message: \`__ADMIN__\${text}\`
    });
    
    setIsSending(false);
  };`;

adminSupport = adminSupport.replace(oldSend, newSend);

adminSupport = adminSupport.replace(
  `<div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">`,
  `<div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">`
);

adminSupport = adminSupport.replace(
  `<button type="submit" disabled={!reply.trim()} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                    <Send size={20} />
                  </button>`,
  `<button type="submit" disabled={!reply.trim() || isSending} className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>`
);

fs.writeFileSync('src/pages/admin/AdminSupport.tsx', adminSupport);
console.log('Updated AdminSupport.tsx');
