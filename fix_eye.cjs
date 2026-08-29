const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

content = content.replace(/import \{ Eye, useParams, Link \} from 'react-router-dom';/, "import { useParams, Link } from 'react-router-dom';");

if (!content.includes('import { Eye')) {
  // Try to find lucide-react import
  content = content.replace(/import \{\n  ArrowLeft,/, "import {\n  Eye,\n  ArrowLeft,");
  
  if (!content.includes('Eye,')) {
    // Single line case
    content = content.replace(/import \{ (.*) \} from 'lucide-react';/, "import { Eye, $1 } from 'lucide-react';");
  }
}

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
