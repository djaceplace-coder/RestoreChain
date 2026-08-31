const fs = require('fs');

let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const oldBlock = `  const impersonatedEmail = sessionStorage.getItem('impersonated_user_email');
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {impersonatedEmail && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-4 z-50 shrink-0">
          <span>You are currently impersonating: {impersonatedEmail}</span>
          <button 
            onClick={() => {
              sessionStorage.removeItem('impersonated_user_id');
              sessionStorage.removeItem('impersonated_user_email');
              window.location.href = '#/admin/users';
              window.location.reload();
            }}
            className="px-3 py-1 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            End Impersonation
          </button>
        </div>
      )}`;

const newBlock = `  return (
    <div className="flex flex-col h-screen overflow-hidden">`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
console.log("Updated DashboardLayout.tsx");
