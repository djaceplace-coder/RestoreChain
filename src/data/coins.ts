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
    "price": 64000,
    "change24h": 1.98,
    "marketCap": 497545081
  },
  {
    "id": "2",
    "symbol": "ETH",
    "name": "Ethereum",
    "type": "Crypto",
    "network": "ETH",
    "price": 3400,
    "change24h": 1.58,
    "marketCap": 961244234
  },
  {
    "id": "3",
    "symbol": "USDT",
    "name": "USDT Coin",
    "type": "Crypto",
    "network": "USDT",
    "price": 1,
    "change24h": -3.44,
    "marketCap": 122894357
  },
  {
    "id": "4",
    "symbol": "BNB",
    "name": "BNB Coin",
    "type": "Crypto",
    "network": "BNB",
    "price": 42.05756057443644,
    "change24h": 1.25,
    "marketCap": 288776353
  },
  {
    "id": "5",
    "symbol": "SOL",
    "name": "SOL Coin",
    "type": "Crypto",
    "network": "SOL",
    "price": 1.559946326883077,
    "change24h": -0.23,
    "marketCap": 470145008
  },
  {
    "id": "6",
    "symbol": "USDC",
    "name": "USDC Coin",
    "type": "Crypto",
    "network": "USDC",
    "price": 1,
    "change24h": -0.08,
    "marketCap": 896747211
  },
  {
    "id": "7",
    "symbol": "XRP",
    "name": "XRP Coin",
    "type": "Crypto",
    "network": "XRP",
    "price": 21.70722710373112,
    "change24h": 4.22,
    "marketCap": 156738127
  },
  {
    "id": "8",
    "symbol": "ADA",
    "name": "ADA Coin",
    "type": "Crypto",
    "network": "ADA",
    "price": 84.74999681411417,
    "change24h": -1.2,
    "marketCap": 827637328
  },
  {
    "id": "9",
    "symbol": "AVAX",
    "name": "AVAX Coin",
    "type": "Crypto",
    "network": "AVAX",
    "price": 0.8236495610440597,
    "change24h": -1.06,
    "marketCap": 653761072
  },
  {
    "id": "10",
    "symbol": "DOGE",
    "name": "DOGE Coin",
    "type": "Crypto",
    "network": "DOGE",
    "price": 14.082053437066499,
    "change24h": -1.31,
    "marketCap": 410945071
  },
  {
    "id": "11",
    "symbol": "TRX",
    "name": "TRX Coin",
    "type": "Crypto",
    "network": "TRX",
    "price": 8.676152506883206,
    "change24h": 4.15,
    "marketCap": 741808110
  },
  {
    "id": "12",
    "symbol": "DOT",
    "name": "DOT Coin",
    "type": "Crypto",
    "network": "DOT",
    "price": 82.96120353301274,
    "change24h": 3.93,
    "marketCap": 342758955
  },
  {
    "id": "13",
    "symbol": "LINK",
    "name": "LINK Coin",
    "type": "Crypto",
    "network": "LINK",
    "price": 52.98103947986361,
    "change24h": 2.45,
    "marketCap": 239191990
  },
  {
    "id": "14",
    "symbol": "MATIC",
    "name": "MATIC Coin",
    "type": "Crypto",
    "network": "MATIC",
    "price": 11.154331542060447,
    "change24h": -0.51,
    "marketCap": 706273659
  },
  {
    "id": "15",
    "symbol": "TON",
    "name": "TON Coin",
    "type": "Crypto",
    "network": "TON",
    "price": 79.4287758483673,
    "change24h": -0.7,
    "marketCap": 313750487
  },
  {
    "id": "16",
    "symbol": "SHIB",
    "name": "SHIB Coin",
    "type": "Crypto",
    "network": "SHIB",
    "price": 92.3686419153873,
    "change24h": 3.25,
    "marketCap": 901012183
  },
  {
    "id": "17",
    "symbol": "LTC",
    "name": "LTC Coin",
    "type": "Crypto",
    "network": "LTC",
    "price": 68.19757901494705,
    "change24h": -1.32,
    "marketCap": 859903027
  },
  {
    "id": "18",
    "symbol": "BCH",
    "name": "BCH Coin",
    "type": "Crypto",
    "network": "BCH",
    "price": 9.110616512818815,
    "change24h": 4.98,
    "marketCap": 17061858
  },
  {
    "id": "19",
    "symbol": "DAI",
    "name": "DAI Coin",
    "type": "Crypto",
    "network": "DAI",
    "price": 1,
    "change24h": -0.81,
    "marketCap": 141115425
  },
  {
    "id": "20",
    "symbol": "UNI",
    "name": "UNI Coin",
    "type": "Crypto",
    "network": "UNI",
    "price": 17.104098159748116,
    "change24h": -2.62,
    "marketCap": 984426481
  },
  {
    "id": "21",
    "symbol": "ATOM",
    "name": "ATOM Coin",
    "type": "Crypto",
    "network": "ATOM",
    "price": 67.93813383494678,
    "change24h": 2.3,
    "marketCap": 498586255
  },
  {
    "id": "22",
    "symbol": "XLM",
    "name": "XLM Coin",
    "type": "Crypto",
    "network": "XLM",
    "price": 15.012612261961689,
    "change24h": 0.44,
    "marketCap": 95461679
  },
  {
    "id": "23",
    "symbol": "OKB",
    "name": "OKB Coin",
    "type": "Crypto",
    "network": "OKB",
    "price": 99.77751161314667,
    "change24h": -2.51,
    "marketCap": 46798994
  },
  {
    "id": "24",
    "symbol": "LEO",
    "name": "LEO Coin",
    "type": "Crypto",
    "network": "LEO",
    "price": 11.381195371505592,
    "change24h": 3.71,
    "marketCap": 976545562
  },
  {
    "id": "25",
    "symbol": "XMR",
    "name": "XMR Coin",
    "type": "Crypto",
    "network": "XMR",
    "price": 11.841951145473818,
    "change24h": -3.36,
    "marketCap": 561154304
  },
  {
    "id": "26",
    "symbol": "ETC",
    "name": "ETC Coin",
    "type": "Crypto",
    "network": "ETC",
    "price": 42.55896039725189,
    "change24h": 1.15,
    "marketCap": 45626937
  },
  {
    "id": "27",
    "symbol": "ICP",
    "name": "ICP Coin",
    "type": "Crypto",
    "network": "ICP",
    "price": 74.81929427444203,
    "change24h": 0.18,
    "marketCap": 75726341
  },
  {
    "id": "28",
    "symbol": "FIL",
    "name": "FIL Coin",
    "type": "Crypto",
    "network": "FIL",
    "price": 67.83517108452439,
    "change24h": 2.63,
    "marketCap": 105470063
  },
  {
    "id": "29",
    "symbol": "KAS",
    "name": "KAS Coin",
    "type": "Crypto",
    "network": "KAS",
    "price": 91.44853971734553,
    "change24h": 4.24,
    "marketCap": 466240703
  },
  {
    "id": "30",
    "symbol": "LDO",
    "name": "LDO Coin",
    "type": "Crypto",
    "network": "LDO",
    "price": 88.13263065821124,
    "change24h": 4.15,
    "marketCap": 822221725
  },
  {
    "id": "31",
    "symbol": "APT",
    "name": "APT Coin",
    "type": "Crypto",
    "network": "APT",
    "price": 53.373176002013814,
    "change24h": -1.7,
    "marketCap": 322674509
  },
  {
    "id": "32",
    "symbol": "NEAR",
    "name": "NEAR Coin",
    "type": "Crypto",
    "network": "NEAR",
    "price": 47.74509253550316,
    "change24h": -2.45,
    "marketCap": 439526193
  },
  {
    "id": "33",
    "symbol": "VET",
    "name": "VET Coin",
    "type": "Crypto",
    "network": "VET",
    "price": 76.5356060374229,
    "change24h": -1.87,
    "marketCap": 310678175
  },
  {
    "id": "34",
    "symbol": "OP",
    "name": "OP Coin",
    "type": "Crypto",
    "network": "OP",
    "price": 43.83870232703116,
    "change24h": 0.1,
    "marketCap": 413091699
  },
  {
    "id": "35",
    "symbol": "ARB",
    "name": "ARB Coin",
    "type": "Crypto",
    "network": "ARB",
    "price": 83.27443784731203,
    "change24h": -0.14,
    "marketCap": 488053483
  },
  {
    "id": "36",
    "symbol": "MNT",
    "name": "MNT Coin",
    "type": "Crypto",
    "network": "MNT",
    "price": 46.87900542745016,
    "change24h": 3.28,
    "marketCap": 389128382
  },
  {
    "id": "37",
    "symbol": "MKR",
    "name": "MKR Coin",
    "type": "Crypto",
    "network": "MKR",
    "price": 14.385790340002202,
    "change24h": 0.81,
    "marketCap": 358648212
  },
  {
    "id": "38",
    "symbol": "INJ",
    "name": "INJ Coin",
    "type": "Crypto",
    "network": "INJ",
    "price": 89.40385974704652,
    "change24h": -2.38,
    "marketCap": 985070081
  },
  {
    "id": "39",
    "symbol": "QNT",
    "name": "QNT Coin",
    "type": "Crypto",
    "network": "QNT",
    "price": 79.36319620049366,
    "change24h": 3.88,
    "marketCap": 252140868
  },
  {
    "id": "40",
    "symbol": "GRT",
    "name": "GRT Coin",
    "type": "Crypto",
    "network": "GRT",
    "price": 24.593378161947133,
    "change24h": 3.07,
    "marketCap": 828014306
  },
  {
    "id": "41",
    "symbol": "AAVE",
    "name": "AAVE Coin",
    "type": "Crypto",
    "network": "AAVE",
    "price": 46.23431592164666,
    "change24h": -3.67,
    "marketCap": 18671464
  },
  {
    "id": "42",
    "symbol": "STX",
    "name": "STX Coin",
    "type": "Crypto",
    "network": "STX",
    "price": 84.33697820890336,
    "change24h": -2.12,
    "marketCap": 800893795
  },
  {
    "id": "43",
    "symbol": "BSV",
    "name": "BSV Coin",
    "type": "Crypto",
    "network": "BSV",
    "price": 50.62945037385549,
    "change24h": -1.98,
    "marketCap": 855910429
  },
  {
    "id": "44",
    "symbol": "ALGO",
    "name": "ALGO Coin",
    "type": "Crypto",
    "network": "ALGO",
    "price": 82.69122985187596,
    "change24h": 4.44,
    "marketCap": 133015537
  },
  {
    "id": "45",
    "symbol": "SNX",
    "name": "SNX Coin",
    "type": "Crypto",
    "network": "SNX",
    "price": 6.033494201632217,
    "change24h": 0.04,
    "marketCap": 562608529
  },
  {
    "id": "46",
    "symbol": "EGLD",
    "name": "EGLD Coin",
    "type": "Crypto",
    "network": "EGLD",
    "price": 90.60488233462934,
    "change24h": 2.48,
    "marketCap": 487118102
  },
  {
    "id": "47",
    "symbol": "THETA",
    "name": "THETA Coin",
    "type": "Crypto",
    "network": "THETA",
    "price": 21.851604407801382,
    "change24h": 1.32,
    "marketCap": 468948791
  },
  {
    "id": "48",
    "symbol": "RNDR",
    "name": "RNDR Coin",
    "type": "Crypto",
    "network": "RNDR",
    "price": 37.18019467930995,
    "change24h": 4.74,
    "marketCap": 697116579
  },
  {
    "id": "49",
    "symbol": "IMX",
    "name": "IMX Coin",
    "type": "Crypto",
    "network": "IMX",
    "price": 94.1806237831018,
    "change24h": -4.18,
    "marketCap": 694974479
  },
  {
    "id": "50",
    "symbol": "AXS",
    "name": "AXS Coin",
    "type": "Crypto",
    "network": "AXS",
    "price": 38.918823299926956,
    "change24h": -0.43,
    "marketCap": 541137520
  },
  {
    "id": "51",
    "symbol": "SAND",
    "name": "SAND Coin",
    "type": "Crypto",
    "network": "SAND",
    "price": 27.859453116909137,
    "change24h": -2.99,
    "marketCap": 640541386
  },
  {
    "id": "52",
    "symbol": "EOS",
    "name": "EOS Coin",
    "type": "Crypto",
    "network": "EOS",
    "price": 16.434697751882112,
    "change24h": -4.68,
    "marketCap": 623900617
  },
  {
    "id": "53",
    "symbol": "XTZ",
    "name": "XTZ Coin",
    "type": "Crypto",
    "network": "XTZ",
    "price": 76.4935717896565,
    "change24h": 0.4,
    "marketCap": 829935301
  },
  {
    "id": "54",
    "symbol": "FTM",
    "name": "FTM Coin",
    "type": "Crypto",
    "network": "FTM",
    "price": 68.82053584185593,
    "change24h": 4.45,
    "marketCap": 878802260
  },
  {
    "id": "55",
    "symbol": "MANA",
    "name": "MANA Coin",
    "type": "Crypto",
    "network": "MANA",
    "price": 28.565431153873067,
    "change24h": 4.64,
    "marketCap": 353524974
  },
  {
    "id": "56",
    "symbol": "APE",
    "name": "APE Coin",
    "type": "Crypto",
    "network": "APE",
    "price": 94.73133447931006,
    "change24h": 0.05,
    "marketCap": 177528690
  },
  {
    "id": "57",
    "symbol": "NEO",
    "name": "NEO Coin",
    "type": "Crypto",
    "network": "NEO",
    "price": 12.558988663534576,
    "change24h": 1.61,
    "marketCap": 970643229
  },
  {
    "id": "58",
    "symbol": "KAVA",
    "name": "KAVA Coin",
    "type": "Crypto",
    "network": "KAVA",
    "price": 13.904615236853068,
    "change24h": -1.09,
    "marketCap": 894764326
  },
  {
    "id": "59",
    "symbol": "RUNE",
    "name": "RUNE Coin",
    "type": "Crypto",
    "network": "RUNE",
    "price": 28.626073094177173,
    "change24h": -3.92,
    "marketCap": 504700137
  },
  {
    "id": "60",
    "symbol": "FLOW",
    "name": "FLOW Coin",
    "type": "Crypto",
    "network": "FLOW",
    "price": 68.79662138290068,
    "change24h": 0.11,
    "marketCap": 115895089
  },
  {
    "id": "61",
    "symbol": "CHZ",
    "name": "CHZ Coin",
    "type": "Crypto",
    "network": "CHZ",
    "price": 5.643656697934785,
    "change24h": 2.58,
    "marketCap": 321406341
  },
  {
    "id": "62",
    "symbol": "MINA",
    "name": "MINA Coin",
    "type": "Crypto",
    "network": "MINA",
    "price": 9.772918676519794,
    "change24h": -4.17,
    "marketCap": 718765731
  },
  {
    "id": "63",
    "symbol": "FXS",
    "name": "FXS Coin",
    "type": "Crypto",
    "network": "FXS",
    "price": 42.37207622372012,
    "change24h": -2.71,
    "marketCap": 457451536
  },
  {
    "id": "64",
    "symbol": "GALA",
    "name": "GALA Coin",
    "type": "Crypto",
    "network": "GALA",
    "price": 66.17439983453635,
    "change24h": 1.34,
    "marketCap": 894636053
  },
  {
    "id": "65",
    "symbol": "ZEC",
    "name": "ZEC Coin",
    "type": "Crypto",
    "network": "ZEC",
    "price": 42.66014574195003,
    "change24h": -4.79,
    "marketCap": 868638119
  },
  {
    "id": "66",
    "symbol": "IOTA",
    "name": "IOTA Coin",
    "type": "Crypto",
    "network": "IOTA",
    "price": 52.69665636962253,
    "change24h": -2.62,
    "marketCap": 255463461
  },
  {
    "id": "67",
    "symbol": "CRV",
    "name": "CRV Coin",
    "type": "Crypto",
    "network": "CRV",
    "price": 41.437111140691464,
    "change24h": -2.23,
    "marketCap": 811898388
  },
  {
    "id": "68",
    "symbol": "KLAY",
    "name": "KLAY Coin",
    "type": "Crypto",
    "network": "KLAY",
    "price": 13.280877715619589,
    "change24h": 0.58,
    "marketCap": 226996148
  },
  {
    "id": "69",
    "symbol": "XEC",
    "name": "XEC Coin",
    "type": "Crypto",
    "network": "XEC",
    "price": 22.273332914477905,
    "change24h": 1.38,
    "marketCap": 202315661
  },
  {
    "id": "70",
    "symbol": "BTT",
    "name": "BTT Coin",
    "type": "Crypto",
    "network": "BTT",
    "price": 36.634430646564596,
    "change24h": 2.28,
    "marketCap": 872013192
  },
  {
    "id": "71",
    "symbol": "CAKE",
    "name": "CAKE Coin",
    "type": "Crypto",
    "network": "CAKE",
    "price": 17.338213874304675,
    "change24h": 0.31,
    "marketCap": 936527015
  },
  {
    "id": "72",
    "symbol": "PAXG",
    "name": "PAXG Coin",
    "type": "Crypto",
    "network": "PAXG",
    "price": 11.943837765087139,
    "change24h": -3.92,
    "marketCap": 167682421
  },
  {
    "id": "73",
    "symbol": "TUSD",
    "name": "TUSD Coin",
    "type": "Crypto",
    "network": "TUSD",
    "price": 72.61154338624998,
    "change24h": 0.94,
    "marketCap": 255100788
  },
  {
    "id": "74",
    "symbol": "COMP",
    "name": "COMP Coin",
    "type": "Crypto",
    "network": "COMP",
    "price": 4.365970697750421,
    "change24h": -3.28,
    "marketCap": 98266893
  },
  {
    "id": "75",
    "symbol": "HT",
    "name": "HT Coin",
    "type": "Crypto",
    "network": "HT",
    "price": 71.45494922247792,
    "change24h": 3.01,
    "marketCap": 189044523
  },
  {
    "id": "76",
    "symbol": "DASH",
    "name": "DASH Coin",
    "type": "Crypto",
    "network": "DASH",
    "price": 77.18704633188133,
    "change24h": -1.43,
    "marketCap": 564242687
  },
  {
    "id": "77",
    "symbol": "ZIL",
    "name": "ZIL Coin",
    "type": "Crypto",
    "network": "ZIL",
    "price": 45.28044374221694,
    "change24h": -1.69,
    "marketCap": 977210802
  },
  {
    "id": "78",
    "symbol": "CFX",
    "name": "CFX Coin",
    "type": "Crypto",
    "network": "CFX",
    "price": 68.01490231151739,
    "change24h": 0.64,
    "marketCap": 216796560
  },
  {
    "id": "79",
    "symbol": "1INCH",
    "name": "1INCH Coin",
    "type": "Crypto",
    "network": "1INCH",
    "price": 6.75554495316284,
    "change24h": 2.77,
    "marketCap": 728627379
  },
  {
    "id": "80",
    "symbol": "ENJ",
    "name": "ENJ Coin",
    "type": "Crypto",
    "network": "ENJ",
    "price": 45.30124237932141,
    "change24h": 1.75,
    "marketCap": 74753835
  },
  {
    "id": "81",
    "symbol": "BAT",
    "name": "BAT Coin",
    "type": "Crypto",
    "network": "BAT",
    "price": 23.133753427918435,
    "change24h": 4.86,
    "marketCap": 360206241
  },
  {
    "id": "82",
    "symbol": "LRC",
    "name": "LRC Coin",
    "type": "Crypto",
    "network": "LRC",
    "price": 15.409480044577073,
    "change24h": -2.99,
    "marketCap": 725212331
  },
  {
    "id": "83",
    "symbol": "QTUM",
    "name": "QTUM Coin",
    "type": "Crypto",
    "network": "QTUM",
    "price": 87.96827742667685,
    "change24h": 4.63,
    "marketCap": 572263892
  },
  {
    "id": "84",
    "symbol": "NEXO",
    "name": "NEXO Coin",
    "type": "Crypto",
    "network": "NEXO",
    "price": 29.539386777335984,
    "change24h": 3.22,
    "marketCap": 464959903
  },
  {
    "id": "85",
    "symbol": "ROSE",
    "name": "ROSE Coin",
    "type": "Crypto",
    "network": "ROSE",
    "price": 61.6017701240243,
    "change24h": 2.9,
    "marketCap": 624679622
  },
  {
    "id": "86",
    "symbol": "RVN",
    "name": "RVN Coin",
    "type": "Crypto",
    "network": "RVN",
    "price": 9.016719504437454,
    "change24h": 0.28,
    "marketCap": 450274182
  },
  {
    "id": "87",
    "symbol": "KSM",
    "name": "KSM Coin",
    "type": "Crypto",
    "network": "KSM",
    "price": 54.61965929460191,
    "change24h": -1.09,
    "marketCap": 243153908
  },
  {
    "id": "88",
    "symbol": "MASK",
    "name": "MASK Coin",
    "type": "Crypto",
    "network": "MASK",
    "price": 53.53394033697742,
    "change24h": -0.53,
    "marketCap": 619101622
  },
  {
    "id": "89",
    "symbol": "GMX",
    "name": "GMX Coin",
    "type": "Crypto",
    "network": "GMX",
    "price": 62.86062427888523,
    "change24h": -2.96,
    "marketCap": 863277135
  },
  {
    "id": "90",
    "symbol": "LPT",
    "name": "LPT Coin",
    "type": "Crypto",
    "network": "LPT",
    "price": 59.92147987108836,
    "change24h": -0.8,
    "marketCap": 388598457
  },
  {
    "id": "91",
    "symbol": "TWT",
    "name": "TWT Coin",
    "type": "Crypto",
    "network": "TWT",
    "price": 61.433666185883,
    "change24h": 1.6,
    "marketCap": 278083797
  },
  {
    "id": "92",
    "symbol": "BAL",
    "name": "BAL Coin",
    "type": "Crypto",
    "network": "BAL",
    "price": 42.84333409650487,
    "change24h": -3.34,
    "marketCap": 730140879
  },
  {
    "id": "93",
    "symbol": "ENS",
    "name": "ENS Coin",
    "type": "Crypto",
    "network": "ENS",
    "price": 51.12974369556087,
    "change24h": 4.5,
    "marketCap": 151254994
  },
  {
    "id": "94",
    "symbol": "GLM",
    "name": "GLM Coin",
    "type": "Crypto",
    "network": "GLM",
    "price": 43.161989734839665,
    "change24h": -4.58,
    "marketCap": 438818922
  },
  {
    "id": "95",
    "symbol": "YFI",
    "name": "YFI Coin",
    "type": "Crypto",
    "network": "YFI",
    "price": 77.95503899367733,
    "change24h": 4.55,
    "marketCap": 974877200
  },
  {
    "id": "96",
    "symbol": "SXP",
    "name": "SXP Coin",
    "type": "Crypto",
    "network": "SXP",
    "price": 9.951223920601283,
    "change24h": -3.16,
    "marketCap": 553141238
  },
  {
    "id": "97",
    "symbol": "ILV",
    "name": "ILV Coin",
    "type": "Crypto",
    "network": "ILV",
    "price": 37.860171057482916,
    "change24h": 0.51,
    "marketCap": 488688711
  },
  {
    "id": "98",
    "symbol": "BAND",
    "name": "BAND Coin",
    "type": "Crypto",
    "network": "BAND",
    "price": 84.03710400715279,
    "change24h": -3.71,
    "marketCap": 712745937
  },
  {
    "id": "99",
    "symbol": "OCEAN",
    "name": "OCEAN Coin",
    "type": "Crypto",
    "network": "OCEAN",
    "price": 98.20048868184121,
    "change24h": -0.61,
    "marketCap": 359368272
  }
];
