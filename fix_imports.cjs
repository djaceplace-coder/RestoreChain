const fs = require('fs');

// Fix AuthProvider import paths
const portfolioPath = 'src/pages/dashboard/Portfolio.tsx';
let portfolioCode = fs.readFileSync(portfolioPath, 'utf8');
portfolioCode = portfolioCode.replace('../../components/AuthProvider', '../../contexts/AuthContext');
fs.writeFileSync(portfolioPath, portfolioCode);

const txPath = 'src/pages/dashboard/Transactions.tsx';
let txCode = fs.readFileSync(txPath, 'utf8');
txCode = txCode.replace('../../components/AuthProvider', '../../contexts/AuthContext');
fs.writeFileSync(txPath, txCode);
