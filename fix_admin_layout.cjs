const fs = require('fs');

let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

// Add useRef for the main scroll area and support thread count
if (!code.includes('useRef')) {
  code = code.replace('import React, { useState, useEffect }', 'import React, { useState, useEffect, useRef }');
}

// Ensure support thread count state
if (!code.includes('supportQueueCount')) {
  const hookStart = '  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);';
  code = code.replace(hookStart, `  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [supportQueueCount, setSupportQueueCount] = useState(0);
  const mainRef = useRef<HTMLElement>(null);`);
}

// Handle scroll logic + fetch thread count
if (!code.includes('mainRef.current?.scrollTo')) {
  code = code.replace('    checkAdmin();\n  }, []);', `    checkAdmin();
    
    // Fetch unique users in support
    const fetchSupportCount = async () => {
      const { data } = await supabase.from('support_messages').select('user_id');
      if (data) {
        const unique = new Set(data.map(d => d.user_id));
        setSupportQueueCount(unique.size);
      }
    };
    fetchSupportCount();
    
    const channel = supabase.channel('layout_support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, fetchSupportCount)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);`);
}

// Replace the static 12 badge
code = code.replace(
  '<span className="ml-auto bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">12</span>',
  `{supportQueueCount > 0 && <span className="ml-auto bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{supportQueueCount}</span>}`
);

// Add the ref to <main>
code = code.replace('<main className="flex-1 overflow-y-auto">', '<main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth">');

fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
