const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

layout = layout.replace(
  `const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();\n        if (data?.role === 'admin') {\n          setIsAdmin(true);\n        }`,
  `const { data } = await supabase.from('profiles').select('role, kyc_status').eq('id', user.id).single();\n        if (data?.role === 'admin') {\n          setIsAdmin(true);\n        }\n        if (data?.kyc_status) {\n          setKycStatus(data.kyc_status);\n        }`
);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
