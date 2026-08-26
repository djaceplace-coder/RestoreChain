const fs = require('fs');

const symbols = ['BTC','ETH','USDT','BNB','SOL','USDC','XRP','ADA','AVAX','DOGE','TRX','DOT','LINK','MATIC','TON','SHIB','LTC','BCH','DAI','UNI','ATOM','XLM','OKB','LEO','XMR','ETC','ICP','FIL','KAS','LDO','APT','NEAR','VET','OP','ARB','MNT','MKR','INJ','QNT','GRT','AAVE','STX','BSV','ALGO','SNX','EGLD','THETA','RNDR','IMX','AXS','SAND','EOS','XTZ','FTM','MANA','APE','NEO','KAVA','RUNE','FLOW','CHZ','MINA','FXS','GALA','ZEC','IOTA','CRV','KLAY','XEC','BTT','CAKE','PAXG','TUSD','COMP','HT','DASH','ZIL','CFX','1INCH','ENJ','BAT','LRC','QTUM','NEXO','ROSE','RVN','KSM','MASK','GMX','LPT','TWT','BAL','ENS','GLM','YFI','SXP','ILV','BAND','OCEAN'];
let idCounter = 1;
const coins = symbols.map(sym => {
  // generate a semi-random price and change
  const isBTC = sym === 'BTC';
  const isETH = sym === 'ETH';
  
  let basePrice = 1;
  if (isBTC) basePrice = 64000;
  else if (isETH) basePrice = 3400;
  else if (['USDT','USDC','DAI'].includes(sym)) basePrice = 1;
  else basePrice = Math.random() * 100;
  
  return {
    id: String(idCounter++),
    name: sym === 'BTC' ? 'Bitcoin' : sym === 'ETH' ? 'Ethereum' : sym + ' Coin',
    symbol: sym,
    price: basePrice,
    change24h: (Math.random() * 10 - 5).toFixed(2)
  };
});

fs.writeFileSync('coins_100.json', JSON.stringify(coins, null, 2));
