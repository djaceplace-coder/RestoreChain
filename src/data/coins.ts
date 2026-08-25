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
    "id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "type": "Layer 1",
    "network": "BTC",
    "price": 25821.75,
    "change24h": -3.07,
    "marketCap": 5140573585
  },
  {
    "id": "ethereum",
    "symbol": "ETH",
    "name": "Ethereum",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 1084.45,
    "change24h": 7.3,
    "marketCap": 6410303515
  },
  {
    "id": "tether",
    "symbol": "USDT",
    "name": "Tether",
    "type": "Stablecoin",
    "network": "Ethereum",
    "price": 94.19,
    "change24h": -4.4,
    "marketCap": 8249863957
  },
  {
    "id": "bnb",
    "symbol": "BNB",
    "name": "BNB",
    "type": "Token",
    "network": "Ethereum",
    "price": 59.25,
    "change24h": 0.99,
    "marketCap": 7613178416
  },
  {
    "id": "solana",
    "symbol": "SOL",
    "name": "Solana",
    "type": "Layer 1",
    "network": "Solana",
    "price": 48.95,
    "change24h": 4,
    "marketCap": 7778992799
  },
  {
    "id": "usd-coin",
    "symbol": "USDC",
    "name": "USD Coin",
    "type": "Stablecoin",
    "network": "Ethereum",
    "price": 77.11,
    "change24h": 6.03,
    "marketCap": 4177215642
  },
  {
    "id": "xrp",
    "symbol": "XRP",
    "name": "XRP",
    "type": "Token",
    "network": "Ethereum",
    "price": 98.29,
    "change24h": 3.48,
    "marketCap": 8937302574
  },
  {
    "id": "cardano",
    "symbol": "ADA",
    "name": "Cardano",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 82.07,
    "change24h": -7.79,
    "marketCap": 8496291848
  },
  {
    "id": "avalanche",
    "symbol": "AVAX",
    "name": "Avalanche",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 71.27,
    "change24h": -4.66,
    "marketCap": 9106515837
  },
  {
    "id": "dogecoin",
    "symbol": "DOGE",
    "name": "Dogecoin",
    "type": "Token",
    "network": "DOGE",
    "price": 56.7,
    "change24h": 0.88,
    "marketCap": 3037531849
  },
  {
    "id": "polkadot",
    "symbol": "DOT",
    "name": "Polkadot",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 69.51,
    "change24h": 7.59,
    "marketCap": 2509170183
  },
  {
    "id": "tron",
    "symbol": "TRX",
    "name": "TRON",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 35.49,
    "change24h": -5.03,
    "marketCap": 9191748660
  },
  {
    "id": "chainlink",
    "symbol": "LINK",
    "name": "Chainlink",
    "type": "Token",
    "network": "Ethereum",
    "price": 80.83,
    "change24h": 3.95,
    "marketCap": 1345446669
  },
  {
    "id": "toncoin",
    "symbol": "TON",
    "name": "Toncoin",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 29.1,
    "change24h": -8.22,
    "marketCap": 10012224566
  },
  {
    "id": "polygon",
    "symbol": "MATIC",
    "name": "Polygon",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 75.74,
    "change24h": -0.11,
    "marketCap": 8501005754
  },
  {
    "id": "shiba-inu",
    "symbol": "SHIB",
    "name": "Shiba Inu",
    "type": "Token",
    "network": "Ethereum",
    "price": 79.81,
    "change24h": -4.47,
    "marketCap": 4957457833
  },
  {
    "id": "litecoin",
    "symbol": "LTC",
    "name": "Litecoin",
    "type": "Token",
    "network": "LTC",
    "price": 38.45,
    "change24h": -9.76,
    "marketCap": 9588076659
  },
  {
    "id": "bitcoin-cash",
    "symbol": "BCH",
    "name": "Bitcoin Cash",
    "type": "Token",
    "network": "BCH",
    "price": 59.2,
    "change24h": -1.87,
    "marketCap": 2512928056
  },
  {
    "id": "uniswap",
    "symbol": "UNI",
    "name": "Uniswap",
    "type": "Token",
    "network": "Ethereum",
    "price": 51.97,
    "change24h": -7.34,
    "marketCap": 280038975
  },
  {
    "id": "cosmos",
    "symbol": "ATOM",
    "name": "Cosmos",
    "type": "Token",
    "network": "Ethereum",
    "price": 65.66,
    "change24h": 7.72,
    "marketCap": 8746473398
  },
  {
    "id": "stellar",
    "symbol": "XLM",
    "name": "Stellar",
    "type": "Token",
    "network": "Ethereum",
    "price": 68.97,
    "change24h": 2.55,
    "marketCap": 8965640103
  },
  {
    "id": "near-protocol",
    "symbol": "NEAR",
    "name": "NEAR Protocol",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 54.71,
    "change24h": 9.27,
    "marketCap": 4068610564
  },
  {
    "id": "aptos",
    "symbol": "APT",
    "name": "Aptos",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 32.79,
    "change24h": -2.73,
    "marketCap": 3640460264
  },
  {
    "id": "lido-dao",
    "symbol": "LDO",
    "name": "Lido DAO",
    "type": "Token",
    "network": "Ethereum",
    "price": 49.46,
    "change24h": -1.37,
    "marketCap": 7211746847
  },
  {
    "id": "internet-computer",
    "symbol": "ICP",
    "name": "Internet Computer",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 18.19,
    "change24h": 1.18,
    "marketCap": 1624485976
  },
  {
    "id": "filecoin",
    "symbol": "FIL",
    "name": "Filecoin",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 30.68,
    "change24h": 6.65,
    "marketCap": 5488617601
  },
  {
    "id": "hedera",
    "symbol": "HBAR",
    "name": "Hedera",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 61.8,
    "change24h": -9.47,
    "marketCap": 7858539163
  },
  {
    "id": "vechain",
    "symbol": "VET",
    "name": "VeChain",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 74.68,
    "change24h": -4.05,
    "marketCap": 8388269225
  },
  {
    "id": "optimism",
    "symbol": "OP",
    "name": "Optimism",
    "type": "Token",
    "network": "Ethereum",
    "price": 81.15,
    "change24h": -2.66,
    "marketCap": 6152751582
  },
  {
    "id": "mantle",
    "symbol": "MNT",
    "name": "Mantle",
    "type": "Token",
    "network": "Ethereum",
    "price": 64.03,
    "change24h": 1.01,
    "marketCap": 2139958365
  },
  {
    "id": "cronos",
    "symbol": "CRO",
    "name": "Cronos",
    "type": "Token",
    "network": "Ethereum",
    "price": 93.71,
    "change24h": 0.4,
    "marketCap": 2518566156
  },
  {
    "id": "injective",
    "symbol": "INJ",
    "name": "Injective",
    "type": "Token",
    "network": "Ethereum",
    "price": 1.85,
    "change24h": -3.87,
    "marketCap": 2440004971
  },
  {
    "id": "render",
    "symbol": "RNDR",
    "name": "Render",
    "type": "Token",
    "network": "Ethereum",
    "price": 4.22,
    "change24h": -5.88,
    "marketCap": 7297344928
  },
  {
    "id": "quant",
    "symbol": "QNT",
    "name": "Quant",
    "type": "Token",
    "network": "Ethereum",
    "price": 82.95,
    "change24h": 6.69,
    "marketCap": 2789436996
  },
  {
    "id": "arbitrum",
    "symbol": "ARB",
    "name": "Arbitrum",
    "type": "Token",
    "network": "Ethereum",
    "price": 27.58,
    "change24h": 1.99,
    "marketCap": 9612580840
  },
  {
    "id": "the-graph",
    "symbol": "GRT",
    "name": "The Graph",
    "type": "Token",
    "network": "Ethereum",
    "price": 73.23,
    "change24h": 4.04,
    "marketCap": 6282716594
  },
  {
    "id": "maker",
    "symbol": "MKR",
    "name": "Maker",
    "type": "Token",
    "network": "Ethereum",
    "price": 60.79,
    "change24h": -8.84,
    "marketCap": 3012841886
  },
  {
    "id": "stacks",
    "symbol": "STX",
    "name": "Stacks",
    "type": "Token",
    "network": "Ethereum",
    "price": 33.75,
    "change24h": -4.93,
    "marketCap": 586079579
  },
  {
    "id": "algorand",
    "symbol": "ALGO",
    "name": "Algorand",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 80.36,
    "change24h": 6.73,
    "marketCap": 3803885401
  },
  {
    "id": "aave",
    "symbol": "AAVE",
    "name": "Aave",
    "type": "Token",
    "network": "Ethereum",
    "price": 31.12,
    "change24h": -5.37,
    "marketCap": 4185823430
  },
  {
    "id": "synthetix",
    "symbol": "SNX",
    "name": "Synthetix",
    "type": "Token",
    "network": "Ethereum",
    "price": 92.71,
    "change24h": -7.41,
    "marketCap": 2665835182
  },
  {
    "id": "theta-network",
    "symbol": "THETA",
    "name": "Theta Network",
    "type": "Token",
    "network": "Ethereum",
    "price": 41.92,
    "change24h": -8,
    "marketCap": 9841854126
  },
  {
    "id": "fantom",
    "symbol": "FTM",
    "name": "Fantom",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 21.29,
    "change24h": -6.31,
    "marketCap": 3350218236
  },
  {
    "id": "the-sandbox",
    "symbol": "SAND",
    "name": "The Sandbox",
    "type": "Token",
    "network": "Ethereum",
    "price": 43.45,
    "change24h": 1.88,
    "marketCap": 7777852156
  },
  {
    "id": "eos",
    "symbol": "EOS",
    "name": "EOS",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 65.14,
    "change24h": -8.16,
    "marketCap": 4071829214
  },
  {
    "id": "decentraland",
    "symbol": "MANA",
    "name": "Decentraland",
    "type": "Token",
    "network": "Ethereum",
    "price": 9.11,
    "change24h": -8.91,
    "marketCap": 4904865580
  },
  {
    "id": "multiversx",
    "symbol": "EGLD",
    "name": "MultiversX",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 62.9,
    "change24h": 8.45,
    "marketCap": 8996330216
  },
  {
    "id": "tezos",
    "symbol": "XTZ",
    "name": "Tezos",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 87.97,
    "change24h": 1.44,
    "marketCap": 8132053405
  },
  {
    "id": "axie-infinity",
    "symbol": "AXS",
    "name": "Axie Infinity",
    "type": "Token",
    "network": "Ethereum",
    "price": 9.65,
    "change24h": -1.55,
    "marketCap": 1860229289
  },
  {
    "id": "chiliz",
    "symbol": "CHZ",
    "name": "Chiliz",
    "type": "Token",
    "network": "Ethereum",
    "price": 47.92,
    "change24h": 1.93,
    "marketCap": 2742783680
  },
  {
    "id": "flow",
    "symbol": "FLOW",
    "name": "Flow",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 8.99,
    "change24h": 3.52,
    "marketCap": 6948943333
  },
  {
    "id": "kava",
    "symbol": "KAVA",
    "name": "Kava",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 16.61,
    "change24h": -1.92,
    "marketCap": 4178260835
  },
  {
    "id": "mina",
    "symbol": "MINA",
    "name": "Mina",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 22.91,
    "change24h": -4.52,
    "marketCap": 4864987256
  },
  {
    "id": "neo",
    "symbol": "NEO",
    "name": "NEO",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 78.12,
    "change24h": -7.24,
    "marketCap": 4203807871
  },
  {
    "id": "curve-dao-token",
    "symbol": "CRV",
    "name": "Curve DAO Token",
    "type": "Token",
    "network": "Ethereum",
    "price": 89.48,
    "change24h": 2.87,
    "marketCap": 3567804312
  },
  {
    "id": "gala",
    "symbol": "GALA",
    "name": "Gala",
    "type": "Token",
    "network": "Ethereum",
    "price": 2.93,
    "change24h": 5.75,
    "marketCap": 3722825827
  },
  {
    "id": "compound",
    "symbol": "COMP",
    "name": "Compound",
    "type": "Token",
    "network": "Ethereum",
    "price": 28.72,
    "change24h": 8.82,
    "marketCap": 8200723579
  },
  {
    "id": "klaytn",
    "symbol": "KLAY",
    "name": "Klaytn",
    "type": "Token",
    "network": "Ethereum",
    "price": 4.62,
    "change24h": 6.33,
    "marketCap": 2532381979
  },
  {
    "id": "frax-share",
    "symbol": "FXS",
    "name": "Frax Share",
    "type": "Token",
    "network": "Ethereum",
    "price": 52.62,
    "change24h": 2.35,
    "marketCap": 8351315111
  },
  {
    "id": "gmx",
    "symbol": "GMX",
    "name": "GMX",
    "type": "Token",
    "network": "Ethereum",
    "price": 77.17,
    "change24h": -9.85,
    "marketCap": 3248446776
  },
  {
    "id": "dydx",
    "symbol": "DYDX",
    "name": "dYdX",
    "type": "Token",
    "network": "Ethereum",
    "price": 2.56,
    "change24h": -1.48,
    "marketCap": 8556362132
  },
  {
    "id": "terra-classic",
    "symbol": "LUNC",
    "name": "Terra Classic",
    "type": "Token",
    "network": "Ethereum",
    "price": 71.14,
    "change24h": 7.23,
    "marketCap": 4321942455
  },
  {
    "id": "zilliqa",
    "symbol": "ZIL",
    "name": "Zilliqa",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 49.76,
    "change24h": 5.28,
    "marketCap": 6387758481
  },
  {
    "id": "dash",
    "symbol": "DASH",
    "name": "Dash",
    "type": "Layer 1",
    "network": "DASH",
    "price": 24.27,
    "change24h": 3.81,
    "marketCap": 2838003474
  },
  {
    "id": "iota",
    "symbol": "IOTA",
    "name": "IOTA",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 76.62,
    "change24h": 9.34,
    "marketCap": 5879151471
  },
  {
    "id": "pancakeswap",
    "symbol": "CAKE",
    "name": "PancakeSwap",
    "type": "Token",
    "network": "Ethereum",
    "price": 22.56,
    "change24h": 5.44,
    "marketCap": 5575585983
  },
  {
    "id": "trust-wallet-token",
    "symbol": "TWT",
    "name": "Trust Wallet Token",
    "type": "Token",
    "network": "Ethereum",
    "price": 36.77,
    "change24h": 1.78,
    "marketCap": 6615905178
  },
  {
    "id": "xdc-network",
    "symbol": "XDC",
    "name": "XDC Network",
    "type": "Token",
    "network": "Ethereum",
    "price": 17.61,
    "change24h": -7.36,
    "marketCap": 1794412416
  },
  {
    "id": "zcash",
    "symbol": "ZEC",
    "name": "Zcash",
    "type": "Layer 1",
    "network": "ZEC",
    "price": 72.16,
    "change24h": 1.18,
    "marketCap": 5086162522
  },
  {
    "id": "enjin-coin",
    "symbol": "ENJ",
    "name": "Enjin Coin",
    "type": "Token",
    "network": "Ethereum",
    "price": 1.54,
    "change24h": 4.64,
    "marketCap": 7756947955
  },
  {
    "id": "1inch-network",
    "symbol": "1INCH",
    "name": "1inch Network",
    "type": "Token",
    "network": "Ethereum",
    "price": 75.99,
    "change24h": -7.94,
    "marketCap": 8431472937
  },
  {
    "id": "basic-attention-token",
    "symbol": "BAT",
    "name": "Basic Attention Token",
    "type": "Token",
    "network": "Ethereum",
    "price": 61.1,
    "change24h": 3.66,
    "marketCap": 5608122144
  },
  {
    "id": "oasis-network",
    "symbol": "ROSE",
    "name": "Oasis Network",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 88.5,
    "change24h": 9.04,
    "marketCap": 2382192909
  },
  {
    "id": "loopring",
    "symbol": "LRC",
    "name": "Loopring",
    "type": "Token",
    "network": "Ethereum",
    "price": 50.67,
    "change24h": 3.26,
    "marketCap": 998795422
  },
  {
    "id": "ravencoin",
    "symbol": "RVN",
    "name": "Ravencoin",
    "type": "Layer 1",
    "network": "RVN",
    "price": 38.23,
    "change24h": 2.35,
    "marketCap": 7011694180
  },
  {
    "id": "kusama",
    "symbol": "KSM",
    "name": "Kusama",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 23.36,
    "change24h": 0.43,
    "marketCap": 3762830458
  },
  {
    "id": "yearn.finance",
    "symbol": "YFI",
    "name": "yearn.finance",
    "type": "Token",
    "network": "Ethereum",
    "price": 41.28,
    "change24h": -9.9,
    "marketCap": 1597092613
  },
  {
    "id": "balancer",
    "symbol": "BAL",
    "name": "Balancer",
    "type": "Token",
    "network": "Ethereum",
    "price": 54.49,
    "change24h": 3.64,
    "marketCap": 3827955197
  },
  {
    "id": "sxp",
    "symbol": "SXP",
    "name": "SXP",
    "type": "Token",
    "network": "Ethereum",
    "price": 59.78,
    "change24h": 8.34,
    "marketCap": 6339982753
  },
  {
    "id": "band-protocol",
    "symbol": "BAND",
    "name": "Band Protocol",
    "type": "Token",
    "network": "Ethereum",
    "price": 39.87,
    "change24h": 6.24,
    "marketCap": 6773786655
  },
  {
    "id": "ocean-protocol",
    "symbol": "OCEAN",
    "name": "Ocean Protocol",
    "type": "Token",
    "network": "Ethereum",
    "price": 84.87,
    "change24h": -9.69,
    "marketCap": 9604778600
  },
  {
    "id": "ankr",
    "symbol": "ANKR",
    "name": "Ankr",
    "type": "Token",
    "network": "Ethereum",
    "price": 18.54,
    "change24h": 5.36,
    "marketCap": 2481797838
  },
  {
    "id": "serum",
    "symbol": "SRM",
    "name": "Serum",
    "type": "Token",
    "network": "Solana",
    "price": 62.31,
    "change24h": -6.09,
    "marketCap": 10074064021
  },
  {
    "id": "raydium",
    "symbol": "RAY",
    "name": "Raydium",
    "type": "Token",
    "network": "Solana",
    "price": 74.13,
    "change24h": -5.43,
    "marketCap": 8985525934
  },
  {
    "id": "audius",
    "symbol": "AUDIO",
    "name": "Audius",
    "type": "Token",
    "network": "Ethereum",
    "price": 62.4,
    "change24h": 6.11,
    "marketCap": 585352713
  },
  {
    "id": "coin98",
    "symbol": "C98",
    "name": "Coin98",
    "type": "Token",
    "network": "Ethereum",
    "price": 95.38,
    "change24h": 7.92,
    "marketCap": 1721357969
  },
  {
    "id": "celo",
    "symbol": "CELO",
    "name": "Celo",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 25.13,
    "change24h": -7.92,
    "marketCap": 7353689632
  },
  {
    "id": "ethereum-name-service",
    "symbol": "ENS",
    "name": "Ethereum Name Service",
    "type": "Token",
    "network": "Ethereum",
    "price": 84.19,
    "change24h": 9.05,
    "marketCap": 4034781854
  },
  {
    "id": "gitcoin",
    "symbol": "GTC",
    "name": "Gitcoin",
    "type": "Token",
    "network": "Ethereum",
    "price": 55.78,
    "change24h": -1.37,
    "marketCap": 3614774708
  },
  {
    "id": "perpetual-protocol",
    "symbol": "PERP",
    "name": "Perpetual Protocol",
    "type": "Token",
    "network": "Ethereum",
    "price": 61.2,
    "change24h": 5.24,
    "marketCap": 1002481418
  },
  {
    "id": "ren",
    "symbol": "REN",
    "name": "Ren",
    "type": "Token",
    "network": "Ethereum",
    "price": 76.32,
    "change24h": -2.53,
    "marketCap": 9836711259
  },
  {
    "id": "request",
    "symbol": "REQ",
    "name": "Request",
    "type": "Token",
    "network": "Ethereum",
    "price": 69.6,
    "change24h": 9.23,
    "marketCap": 271389879
  },
  {
    "id": "reserve-rights",
    "symbol": "RSR",
    "name": "Reserve Rights",
    "type": "Token",
    "network": "Ethereum",
    "price": 1.81,
    "change24h": 1.67,
    "marketCap": 1434664467
  },
  {
    "id": "storj",
    "symbol": "STORJ",
    "name": "Storj",
    "type": "Token",
    "network": "Ethereum",
    "price": 10.75,
    "change24h": 4.71,
    "marketCap": 9227494460
  },
  {
    "id": "sushiswap",
    "symbol": "SUSHI",
    "name": "SushiSwap",
    "type": "Token",
    "network": "Ethereum",
    "price": 18.89,
    "change24h": -9.15,
    "marketCap": 8940219792
  },
  {
    "id": "uma",
    "symbol": "UMA",
    "name": "UMA",
    "type": "Token",
    "network": "Ethereum",
    "price": 32,
    "change24h": 1.04,
    "marketCap": 9362017243
  },
  {
    "id": "wax",
    "symbol": "WAXP",
    "name": "WAX",
    "type": "Token",
    "network": "Ethereum",
    "price": 24.66,
    "change24h": -3.07,
    "marketCap": 2474221512
  },
  {
    "id": "0x",
    "symbol": "ZRX",
    "name": "0x",
    "type": "Token",
    "network": "Ethereum",
    "price": 97,
    "change24h": 9.2,
    "marketCap": 7224606052
  },
  {
    "id": "omg-network",
    "symbol": "OMG",
    "name": "OMG Network",
    "type": "Token",
    "network": "Ethereum",
    "price": 80.93,
    "change24h": 3.16,
    "marketCap": 5742690617
  },
  {
    "id": "icon",
    "symbol": "ICX",
    "name": "ICON",
    "type": "Layer 1",
    "network": "Ethereum",
    "price": 70.75,
    "change24h": -1.5,
    "marketCap": 1558332523
  },
  {
    "id": "bittorrent",
    "symbol": "BTT",
    "name": "BitTorrent",
    "type": "Token",
    "network": "Ethereum",
    "price": 68.71,
    "change24h": 2.44,
    "marketCap": 326282128
  }
];
