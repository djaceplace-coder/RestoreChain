const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminCreateUserModal.tsx', 'utf8');

const oldTx = `await supabase.from('transactions').insert({
          user_id: userId,
          type: 'deposit',
          amount: \`+\${Number(initialBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}\`,
          value_usd: Number(initialBalance),
          asset: 'USD',
          status: 'completed',
        });`;

const newTx = `await supabase.from('transactions').insert({
          user_id: userId,
          type: 'Deposit',
          amount: Number(initialBalance),
          value_usd: Number(initialBalance),
          asset: 'USD',
          status: 'Completed',
        });`;

content = content.replace(oldTx, newTx);

fs.writeFileSync('src/pages/admin/AdminCreateUserModal.tsx', content);
console.log("AdminCreateUserModal fixed.");
