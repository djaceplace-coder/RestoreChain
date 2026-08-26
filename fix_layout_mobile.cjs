const fs = require('fs');

let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Fix search bar on mobile (make it hidden or smaller on very small screens, or just proper flex)
layout = layout.replace(
  '<div className="flex-1 max-w-xl">',
  '<div className="flex-1 max-w-xl hidden sm:block">' // Hide search on mobile header to save space for the brand/profile, or just flex correctly
);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
