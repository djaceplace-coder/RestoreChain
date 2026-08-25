const fs = require('fs');
const file = 'src/pages/admin/AdminOverview.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix variable collision by renaming the hardcoded stats array
code = code.replace("const stats = [", "const staticStats = [");
code = code.replace("stats.map((stat, index)", "staticStats.map((stat, index)");

fs.writeFileSync(file, code);
