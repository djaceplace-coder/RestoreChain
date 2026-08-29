const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const returnTarget = `  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">`;

const impersonationBanner = `  const impersonatedEmail = sessionStorage.getItem('impersonated_user_email');
  
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
      )}
      <div className="flex flex-1 bg-gray-50 overflow-hidden font-sans">`;

if (content.includes(returnTarget)) {
  content = content.replace(returnTarget, impersonationBanner);
  
  // Close the extra flex container at the end
  content = content.replace(
/    <\/div>\n  \);\n\}/,
`      </div>
    </div>
  );
}`
  );

  fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
  console.log('patched DashboardLayout successfully');
}
