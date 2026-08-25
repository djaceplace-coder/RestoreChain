const fs = require('fs');

const code = `
import React, { useState, useEffect } from 'react';
import { Bell, Check, ShieldAlert, FileText, ArrowRightLeft, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setNotifications(data);
      setLoading(false);
    };

    fetchNotifications();

    const channel = supabase.channel('user_notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const toggleExpand = async (id: string, currentlyRead: boolean) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!currentlyRead) {
        // Mark as read in db
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      }
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Notifications</h1>
          <p className="text-brand-text-gray">System alerts, updates, and messages.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-brand-purple hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          <Check size={16} /> Mark all read
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Bell className="mx-auto mb-4 opacity-50" size={32} />
              <p>You have no notifications.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={\`transition-colors \${notif.read ? 'bg-white' : 'bg-brand-purple/5'}\`}
              >
                <div 
                  className="p-6 flex gap-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(notif.id, notif.read)}
                >
                  <div className={\`p-3 rounded-xl shrink-0 h-fit \${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-brand-purple/10 text-brand-purple'}\`}>
                    <Info size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={\`font-bold \${notif.read ? 'text-gray-700' : 'text-brand-dark'}\`}>{notif.title}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                        {expandedId === notif.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>
                    </div>
                    {/* Truncated preview when collapsed */}
                    {expandedId !== notif.id && (
                      <p className="text-sm text-gray-600 line-clamp-1">{notif.body}</p>
                    )}
                    
                    {/* Full content when expanded */}
                    {expandedId === notif.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{notif.body}</p>
                      </div>
                    )}
                  </div>
                  
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-brand-purple mt-2 shrink-0"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/pages/dashboard/Notifications.tsx', code);
