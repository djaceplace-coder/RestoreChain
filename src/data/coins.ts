export interface Coin {
  id: string;
  symbol: string;
  name: string;
  type: string;
  network: string;
  price: number;
  change24h: number;
  marketCap: number;
}

export const COINS: Coin[] = [
  {
    "id": "1",
    "symbol": "BTC",
    "name": "Bitcoin",
    "type": "Crypto",
    "network": "BTC",
    "price": 88500,
    "change24h": 2.45,
    "marketCap": 1750000000000
  },
  {
    "id": "2",
    "symbol": "ETH",
    "name": "Ethereum",
    "type": "Crypto",
    "network": "ETH",
    "price": 2720,
    "change24h": 1.85,
    "marketCap": 328000000000
  },
  {
    "id": "3",
    "symbol": "USDT",
    "name": "Tether USD",
    "type": "Stablecoin",
    "network": "USDT",
    "price": 1.00,
    "change24h": 0.01,
    "marketCap": 128000000000
  },
  {
    "id": "4",
    "symbol": "SOL",
    "name": "Solana",
    "type": "Crypto",
    "network": "SOL",
    "price": 182.50,
    "change24h": 4.12,
    "marketCap": 86000000000
  },
  {
    "id": "5",
    "symbol": "BNB",
    "name": "BNB",
    "type": "Crypto",
    "network": "BNB",
    "price": 595.20,
    "change24h": 1.15,
    "marketCap": 87000000000
  },
  {
    "id": "6",
    "symbol": "USDC",
    "name": "USD Coin",
    "type": "Stablecoin",
    "network": "USDC",
    "price": 1.00,
    "change24h": -0.01,
    "marketCap": 39000000000
  },
  {
    "id": "7",
    "symbol": "XRP",
    "name": "XRP",
    "type": "Crypto",
    "network": "XRP",
    "price": 2.42,
    "change24h": 3.85,
    "marketCap": 138000000000
  },
  {
    "id": "8",
    "symbol": "ADA",
    "name": "Cardano",
    "type": "Crypto",
    "network": "ADA",
    "price": 0.76,
    "change24h": 1.95,
    "marketCap": 27000000000
  },
  {
    "id": "9",
    "symbol": "DOGE",
    "name": "Dogecoin",
    "type": "Crypto",
    "network": "DOGE",
    "price": 0.265,
    "change24h": -1.20,
    "marketCap": 38500000000
  },
  {
    "id": "10",
    "symbol": "AVAX",
    "name": "Avalanche",
    "type": "Crypto",
    "network": "AVAX",
    "price": 26.40,
    "change24h": 2.10,
    "marketCap": 10800000000
  },
  {
    "id": "11",
    "symbol": "TRX",
    "name": "TRON",
    "type": "Crypto",
    "network": "TRX",
    "price": 0.235,
    "change24h": 0.45,
    "marketCap": 20200000000
  },
  {
    "id": "12",
    "symbol": "DOT",
    "name": "Polkadot",
    "type": "Crypto",
    "network": "DOT",
    "price": 4.85,
    "change24h": 1.30,
    "marketCap": 6900000000
  },
  {
    "id": "13",
    "symbol": "LINK",
    "name": "Chainlink",
    "type": "Crypto",
    "network": "LINK",
    "price": 18.20,
    "change24h": 3.40,
    "marketCap": 11200000000
  },
  {
    "id": "14",
    "symbol": "MATIC",
    "name": "Polygon (POL)",
    "type": "Crypto",
    "network": "POL",
    "price": 0.415,
    "change24h": 0.85,
    "marketCap": 3400000000
  },
  {
    "id": "15",
    "symbol": "TON",
    "name": "Toncoin",
    "type": "Crypto",
    "network": "TON",
    "price": 3.90,
    "change24h": -0.80,
    "marketCap": 9800000000
  },
  {
    "id": "16",
    "symbol": "SHIB",
    "name": "Shiba Inu",
    "type": "Crypto",
    "network": "SHIB",
    "price": 0.0000185,
    "change24h": 2.15,
    "marketCap": 10900000000
  },
  {
    "id": "17",
    "symbol": "LTC",
    "name": "Litecoin",
    "type": "Crypto",
    "network": "LTC",
    "price": 105.40,
    "change24h": 1.75,
    "marketCap": 7900000000
  },
  {
    "id": "18",
    "symbol": "BCH",
    "name": "Bitcoin Cash",
    "type": "Crypto",
    "network": "BCH",
    "price": 380.50,
    "change24h": 2.65,
    "marketCap": 7500000000
  },
  {
    "id": "19",
    "symbol": "DAI",
    "name": "Dai Stablecoin",
    "type": "Stablecoin",
    "network": "DAI",
    "price": 1.00,
    "change24h": 0.00,
    "marketCap": 5200000000
  },
  {
    "id": "20",
    "symbol": "UNI",
    "name": "Uniswap",
    "type": "Crypto",
    "network": "UNI",
    "price": 9.45,
    "change24h": -1.10,
    "marketCap": 5700000000
  },
  {
    "id": "21",
    "symbol": "ATOM",
    "name": "Cosmos",
    "type": "Crypto",
    "network": "ATOM",
    "price": 5.15,
    "change24h": 0.90,
    "marketCap": 2050000000
  },
  {
    "id": "22",
    "symbol": "XLM",
    "name": "Stellar",
    "type": "Crypto",
    "network": "XLM",
    "price": 0.32,
    "change24h": 4.10,
    "marketCap": 9500000000
  },
  {
    "id": "23",
    "symbol": "XMR",
    "name": "Monero",
    "type": "Crypto",
    "network": "XMR",
    "price": 185.00,
    "change24h": -0.50,
    "marketCap": 3400000000
  },
  {
    "id": "24",
    "symbol": "ICP",
    "name": "Internet Computer",
    "type": "Crypto",
    "network": "ICP",
    "price": 9.80,
    "change24h": 1.40,
    "marketCap": 4600000000
  },
  {
    "id": "25",
    "symbol": "NEAR",
    "name": "NEAR Protocol",
    "type": "Crypto",
    "network": "NEAR",
    "price": 4.15,
    "change24h": 2.20,
    "marketCap": 5100000000
  },
  {
    "id": "26",
    "symbol": "APT",
    "name": "Aptos",
    "type": "Crypto",
    "network": "APT",
    "price": 6.80,
    "change24h": 3.10,
    "marketCap": 3500000000
  },
  {
    "id": "27",
    "symbol": "SUI",
    "name": "Sui",
    "type": "Crypto",
    "network": "SUI",
    "price": 3.10,
    "change24h": 5.20,
    "marketCap": 8900000000
  },
  {
    "id": "28",
    "symbol": "AAVE",
    "name": "Aave",
    "type": "Crypto",
    "network": "AAVE",
    "price": 195.00,
    "change24h": 2.80,
    "marketCap": 2900000000
  },
  {
    "id": "29",
    "symbol": "INJ",
    "name": "Injective",
    "type": "Crypto",
    "network": "INJ",
    "price": 19.50,
    "change24h": 1.70,
    "marketCap": 1950000000
  },
  {
    "id": "30",
    "symbol": "RENDER",
    "name": "Render",
    "type": "Crypto",
    "network": "RENDER",
    "price": 6.20,
    "change24h": 3.90,
    "marketCap": 3200000000
  }
];
