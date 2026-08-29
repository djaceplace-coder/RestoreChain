const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

const returnTarget = `  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-brand-dark overflow-hidden">`;

const impersonationBanner = `  const impersonatedEmail = sessionStorage.getItem('impersonated_user_email');
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-brand-dark overflow-hidden flex-col">
      {impersonatedEmail && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-4 z-50">
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
      <div className="flex flex-1 overflow-hidden">`;

if (content.includes(returnTarget)) {
  content = content.replace(returnTarget, impersonationBanner);
  
  // Also need to close the extra div wrapper around the flex container
  const endTarget = `    </div>
  );
}`;
  const newEndTarget = `      </div>
    </div>
  );
}`;
  content = content.replace(endTarget, newEndTarget);
  fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
  console.log('patched DashboardLayout');
} else {
  console.log('returnTarget not found in DashboardLayout');
}
