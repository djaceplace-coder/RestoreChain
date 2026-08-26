const fs = require('fs');
const coins100 = JSON.parse(fs.readFileSync('coins_100.json', 'utf8'));

// Format to match the Coin interface
const newCoins = coins100.map(c => ({
  id: c.id.toLowerCase(),
  symbol: c.symbol,
  name: c.name,
  type: "Crypto",
  network: c.symbol,
  price: Number(c.price),
  change24h: Number(c.change24h),
  marketCap: Math.floor(Math.random() * 1000000000)
}));

const fileContent = `export interface Coin {
  id: string;
  symbol: string;
  name: string;
  type: string;
  network: string;
  price: number;
  change24h: number;
  marketCap: number;
}

export const COINS: Coin[] = ${JSON.stringify(newCoins, null, 2)};
`;

fs.writeFileSync('src/data/coins.ts', fileContent);
console.log('src/data/coins.ts updated');
