const fs = require('fs');

// 1. AdminLayout Responsive Nav
let layout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');
layout = layout.replace(
  '<div className="flex-1 max-w-xl">',
  '<div className="flex-1 max-w-xl hidden sm:block">'
);
layout = layout.replace(
  '<div className="p-6 lg:p-10 max-w-7xl mx-auto">',
  '<div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto">'
);
fs.writeFileSync('src/layouts/AdminLayout.tsx', layout);

// 2. AdminKYC Responsive
let kyc = fs.readFileSync('src/pages/admin/AdminKYC.tsx', 'utf8');
kyc = kyc.replace(
  '<div className="flex items-center justify-between">',
  '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">'
);
kyc = kyc.replace(
  '<div className="flex flex-col items-end gap-3">',
  '<div className="flex flex-col sm:items-end gap-3">'
);
fs.writeFileSync('src/pages/admin/AdminKYC.tsx', kyc);

// 3. AdminUsers Responsive
let users = fs.readFileSync('src/pages/admin/AdminUsers.tsx', 'utf8');
users = users.replace(
  '<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">',
  '<div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">'
);
fs.writeFileSync('src/pages/admin/AdminUsers.tsx', users);

// 4. AdminUserDetail Responsive
let userDetail = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');
userDetail = userDetail.replace(
  '<header className="mb-8 flex items-center justify-between">',
  '<header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">'
);
userDetail = userDetail.replace(
  '<div className="flex gap-4">',
  '<div className="flex flex-wrap gap-4">'
);
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', userDetail);

console.log("Admin mobile fixes applied");
