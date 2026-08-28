import os
import re

path = 'src/pages/dashboard/Swap.tsx'
with open(path, 'r') as f:
    content = f.read()

# Make SWAP_TOKENS use state or a memoized version that includes Fiat
# Actually, the easiest is to just add it inside the component

tokens_decl = """  const fiatToken = {
    id: 'fiat',
    symbol: userProfile?.preferred_currency || 'USD',
    name: 'Fiat Wallet',
    price: 1.00,
    change24h: 0,
    changeUsd: 0,
    iconBg: 'bg-green-600',
    network: 'Bank'
  };
  
  const availableTokens = [fiatToken, ...SWAP_TOKENS];"""

content = re.sub(r'const \[payToken, setPayToken\] = useState\(SWAP_TOKENS\[4\]\);', tokens_decl + '\n  const [payToken, setPayToken] = useState(SWAP_TOKENS[0]); // BTC\n  const [receiveToken, setReceiveToken] = useState(fiatToken);', content)

# update token search reference from SWAP_TOKENS to availableTokens
content = content.replace("SWAP_TOKENS.filter", "availableTokens.filter")

# Wait, the modal might map over SWAP_TOKENS
content = content.replace("SWAP_TOKENS.map", "availableTokens.map")

with open(path, 'w') as f:
    f.write(content)
