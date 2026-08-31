const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');
const oldLoading = `  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-brand-purple" size={32} />
        <span className="text-sm font-bold text-gray-500">Loading user profile...</span>
      </div>
    );
  }`;

const newLoading = `  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-brand-purple" size={32} />
        <span className="text-sm font-bold text-gray-500">Loading user profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4">
        <ShieldAlert className="text-red-500" size={48} />
        <h2 className="text-xl font-bold">User Not Found or Access Blocked</h2>
        <p className="text-gray-500 max-w-md text-center">
          The requested user profile could not be loaded. This typically happens if the user was deleted, if their profile record is missing, or if database security rules blocked access.
        </p>
        <Link to="/admin/users" className="px-6 py-2 bg-brand-dark text-white rounded-xl font-bold mt-4 hover:bg-black transition-colors">
          Return to Users List
        </Link>
      </div>
    );
  }`;
content = content.replace(oldLoading, newLoading);
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("Updated");
