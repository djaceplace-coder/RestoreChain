const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

if (!code.includes('const [txDate, setTxDate]')) {
  code = code.replace(
    "const [messageBody, setMessageBody] = useState('An admin has initialized your account balance.');",
    "const [messageBody, setMessageBody] = useState('An admin has initialized your account balance.');\n  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);"
  );
  fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', code);
}
