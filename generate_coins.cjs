const fs = require('fs');
const symbols = ["BTC","ETH","USDT","BNB","SOL","USDC","XRP","ADA","AVAX","DOGE","DOT","TRX","LINK","TON","MATIC","SHIB","LTC","BCH","UNI","ATOM","XLM","NEAR","APT","LDO","ICP","FIL","HBAR","VET","OP","MNT","CRO","INJ","RNDR","QNT","ARB","GRT","MKR","STX","ALGO","AAVE","SNX","THETA","FTM","SAND","EOS","MANA","EGLD","XTZ","AXS","CHZ","FLOW","KAVA","MINA","NEO","CRV","GALA","COMP","KLAY","FXS","GMX","DYDX","LUNC","ZIL","DASH","IOTA","CAKE","TWT","XDC","ZEC","ENJ","1INCH","BAT","ROSE","LRC","RVN","KSM","YFI","BAL","SXP","BAND","OCEAN","ANKR","SRM","RAY","AUDIO","C98","CELO","ENS","GTC","PERP","REN","REQ","RSR","STORJ","SUSHI","UMA","WAXP","ZRX","OMG","ICX","BTT"];

const names = {"BTC":"Bitcoin","ETH":"Ethereum","USDT":"Tether","BNB":"BNB","SOL":"Solana","USDC":"USD Coin","XRP":"XRP","ADA":"Cardano","AVAX":"Avalanche","DOGE":"Dogecoin","DOT":"Polkadot","TRX":"TRON","LINK":"Chainlink","TON":"Toncoin","MATIC":"Polygon","SHIB":"Shiba Inu","LTC":"Litecoin","BCH":"Bitcoin Cash","UNI":"Uniswap","ATOM":"Cosmos","XLM":"Stellar","NEAR":"NEAR Protocol","APT":"Aptos","LDO":"Lido DAO","ICP":"Internet Computer","FIL":"Filecoin","HBAR":"Hedera","VET":"VeChain","OP":"Optimism","MNT":"Mantle","CRO":"Cronos","INJ":"Injective","RNDR":"Render","QNT":"Quant","ARB":"Arbitrum","GRT":"The Graph","MKR":"Maker","STX":"Stacks","ALGO":"Algorand","AAVE":"Aave","SNX":"Synthetix","THETA":"Theta Network","FTM":"Fantom","SAND":"The Sandbox","EOS":"EOS","MANA":"Decentraland","EGLD":"MultiversX","XTZ":"Tezos","AXS":"Axie Infinity","CHZ":"Chiliz","FLOW":"Flow","KAVA":"Kava","MINA":"Mina","NEO":"NEO","CRV":"Curve DAO Token","GALA":"Gala","COMP":"Compound","KLAY":"Klaytn","FXS":"Frax Share","GMX":"GMX","DYDX":"dYdX","LUNC":"Terra Classic","ZIL":"Zilliqa","DASH":"Dash","IOTA":"IOTA","CAKE":"PancakeSwap","TWT":"Trust Wallet Token","XDC":"XDC Network","ZEC":"Zcash","ENJ":"Enjin Coin","1INCH":"1inch Network","BAT":"Basic Attention Token","ROSE":"Oasis Network","LRC":"Loopring","RVN":"Ravencoin","KSM":"Kusama","YFI":"yearn.finance","BAL":"Balancer","SXP":"SXP","BAND":"Band Protocol","OCEAN":"Ocean Protocol","ANKR":"Ankr","SRM":"Serum","RAY":"Raydium","AUDIO":"Audius","C98":"Coin98","CELO":"Celo","ENS":"Ethereum Name Service","GTC":"Gitcoin","PERP":"Perpetual Protocol","REN":"Ren","REQ":"Request","RSR":"Reserve Rights","STORJ":"Storj","SUSHI":"SushiSwap","UMA":"UMA","WAXP":"WAX","ZRX":"0x","OMG":"OMG Network","ICX":"ICON","BTT":"BitTorrent"};

const coins = symbols.map(sym => ({
  id: names[sym].toLowerCase().replace(/\s+/g, '-'),
  symbol: sym,
  name: names[sym],
  type: (sym === 'USDT' || sym === 'USDC') ? 'Stablecoin' : (['BTC','ETH','SOL','ADA','AVAX','DOT','TRX','TON','MATIC','NEAR','APT','ICP','FIL','HBAR','VET','ALGO','FTM','EOS','EGLD','XTZ','FLOW','KAVA','MINA','NEO','ZIL','DASH','IOTA','ZEC','ROSE','RVN','KSM','CELO','ICX'].includes(sym) ? 'Layer 1' : 'Token'),
  network: ['BTC','BCH','LTC','DOGE','DASH','ZEC','RVN'].includes(sym) ? sym : (['SOL','RAY','SRM'].includes(sym) ? 'Solana' : 'Ethereum'),
  price: +(Math.random() * (sym === 'BTC' ? 84000 : sym === 'ETH' ? 4500 : 100)).toFixed(2),
  change24h: +(Math.random() * 20 - 10).toFixed(2),
  marketCap: +(Math.random() * 10000000000 + 100000000).toFixed(0)
}));

const fileContent = `export interface Coin {\n  id: string;\n  symbol: string;\n  name: string;\n  type: string;\n  network: string;\n  price: number;\n  change24h: number;\n  marketCap: number;\n}\n\nexport const COINS: Coin[] = ${JSON.stringify(coins, null, 2)};\n`;
fs.writeFileSync('src/data/coins.ts', fileContent);
