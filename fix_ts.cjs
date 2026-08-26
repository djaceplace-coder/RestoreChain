const fs = require('fs');
let support = fs.readFileSync('src/pages/dashboard/Support.tsx', 'utf8');

support = support.replace(
  `         if (payload.new && payload.new.ticket_id) {`,
  `         const newPayload = payload.new as any;\n         if (newPayload && newPayload.ticket_id) {`
);

support = support.replace(
  `           const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', payload.new.ticket_id).order('created_at', { ascending: true });`,
  `           const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', newPayload.ticket_id).order('created_at', { ascending: true });`
);

fs.writeFileSync('src/pages/dashboard/Support.tsx', support);
console.log('Fixed TS Error');
