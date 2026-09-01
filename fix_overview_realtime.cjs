const fs = require('fs');
let file = fs.readFileSync('src/pages/dashboard/Overview.tsx', 'utf8');

const regex = /    fetchUser\(\);\n  \}, \[\]\);/;

const replacement = `    fetchUser();

    let channel: any = null;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        channel = supabase.channel('overview_changes-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: \`id=eq.\${user.id}\` }, fetchUser)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolios', filter: \`user_id=eq.\${user.id}\` }, fetchUser)
          .subscribe();
      }
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);`;

file = file.replace(regex, replacement);
fs.writeFileSync('src/pages/dashboard/Overview.tsx', file);
console.log('Fixed Overview Realtime');
