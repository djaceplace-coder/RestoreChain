const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

const headerTarget = `          <p className="text-gray-500 text-sm font-mono">
            {user.email} • ID: {id} • Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>`;

const newHeaderTarget = `          <p className="text-gray-500 text-sm font-mono mb-3">
            {user.email} • ID: {id} • Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>
          <button 
            onClick={() => {
              sessionStorage.setItem('impersonated_user_id', user.id);
              sessionStorage.setItem('impersonated_user_email', user.email);
              window.location.href = '#/dashboard';
              window.location.reload();
            }}
            className="px-4 py-2 bg-brand-purple text-white font-bold rounded-xl text-sm hover:bg-purple-700 transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Eye size={16} /> Impersonate (View Dashboard)
          </button>
        </div>`;

if(content.includes(headerTarget) && !content.includes('impersonated_user_id')) {
  content = content.replace(headerTarget, newHeaderTarget);
  // add Eye icon if not imported
  if(!content.includes('Eye,')) {
    content = content.replace(/import \{ /, 'import { Eye, ');
  }
  fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
  console.log('Added Impersonate button to AdminUserDetail');
} else {
  console.log('Header target not found or already patched.');
}
