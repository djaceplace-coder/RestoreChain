const fs = require('fs');

const portfolioPath = 'src/pages/dashboard/Portfolio.tsx';
let portfolioCode = fs.readFileSync(portfolioPath, 'utf8');
portfolioCode = portfolioCode.replace(/import \{ useAuth \} from '..\/..\/contexts\/AuthContext';\n/, '');
portfolioCode = portfolioCode.replace('const { user } = useAuth();', '');
portfolioCode = portfolioCode.replace('const [loading, setLoading] = useState(true);', 'const [user, setUser] = useState<any>(null);\n  const [loading, setLoading] = useState(true);');
portfolioCode = portfolioCode.replace('useEffect(() => {', 'useEffect(() => {\n    const init = async () => {\n      const { data } = await supabase.auth.getUser();\n      setUser(data?.user);\n    };\n    init();\n  }, []);\n\n  useEffect(() => {');
fs.writeFileSync(portfolioPath, portfolioCode);

const txPath = 'src/pages/dashboard/Transactions.tsx';
let txCode = fs.readFileSync(txPath, 'utf8');
txCode = txCode.replace(/import \{ useAuth \} from '..\/..\/contexts\/AuthContext';\n/, '');
txCode = txCode.replace('const { user } = useAuth();', '');
txCode = txCode.replace('const [loading, setLoading] = useState(true);', 'const [user, setUser] = useState<any>(null);\n  const [loading, setLoading] = useState(true);');
txCode = txCode.replace('useEffect(() => {', 'useEffect(() => {\n    const init = async () => {\n      const { data } = await supabase.auth.getUser();\n      setUser(data?.user);\n    };\n    init();\n  }, []);\n\n  useEffect(() => {');
fs.writeFileSync(txPath, txCode);
