const fs = require('fs');

let adminSupport = fs.readFileSync('src/pages/admin/AdminSupport.tsx', 'utf8');

const oldHeader = `<header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Queue</h1>
          <p className="text-gray-500">Manage user inquiries and chat sessions.</p>
        </div>
      </header>`;

const newHeader = `<header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Support Queue</h1>
          <p className="text-gray-500">Manage user inquiries and chat sessions.</p>
        </div>
        <button 
          onClick={async () => {
            const confirm = window.confirm('Mark all open tickets as read?');
            if (confirm) {
               await supabase.from('support_tickets').update({ status: 'in_progress' }).eq('status', 'open');
               fetchThreads();
            }
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors text-sm"
        >
          Mark All as Read
        </button>
      </header>`;

adminSupport = adminSupport.replace(oldHeader, newHeader);

fs.writeFileSync('src/pages/admin/AdminSupport.tsx', adminSupport);
console.log('Added Mark All Read');
