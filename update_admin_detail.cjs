const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// Replace impersonate with delete button
const impersonateBtn = `<button 
            onClick={() => {
              sessionStorage.setItem('impersonated_user_id', user.id);
              sessionStorage.setItem('impersonated_user_email', user.email);
              window.location.href = '#/dashboard';
              window.location.reload();
            }}
            className="px-4 py-2 bg-brand-purple text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Eye size={16} /> Impersonate (View Dashboard)
          </button>`;

const deleteBtn = `<button 
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl text-sm hover:bg-red-600 hover:text-white transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Account
          </button>`;

content = content.replace(impersonateBtn, deleteBtn);

// Add handleDeleteUser function
const targetCode = `  const resolveReconIssue = async (issueId: string) => {`;
const deleteFunc = `  const handleDeleteUser = async () => {
    if (!window.confirm("Are you SURE you want to completely delete this user and all associated data? This cannot be undone.")) return;
    
    // First, clear portfolios/wallets/txs if necessary (cascade handles most, but safe to delete from profile)
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert("Failed to delete user: " + error.message);
    } else {
      alert("User account successfully deleted.");
      window.location.href = '#/admin/users';
    }
  };

  const resolveReconIssue = async (issueId: string) => {`;

content = content.replace(targetCode, deleteFunc);

// Check if Trash2 is imported
if (!content.includes('Trash2')) {
  content = content.replace('Eye, ', 'Eye, Trash2, ');
  // or fallback if Eye isn't there
}

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("Updated AdminUserDetail.tsx");
