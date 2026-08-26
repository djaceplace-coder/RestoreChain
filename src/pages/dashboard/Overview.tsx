import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, FileText, ArrowRight, TrendingUp, Bitcoin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const data = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 1200 },
  { name: 'Mar', value: 800 },
  { name: 'Apr', value: 2500 },
  { name: 'May', value: 1800 },
  { name: 'Jun', value: 3400 },
  { name: 'Jul', value: 4200 },
];

const COINS = [{"id":"1","name":"Bitcoin","symbol":"BTC","price":64000,"change24h":"1.98"},{"id":"2","name":"Ethereum","symbol":"ETH","price":3400,"change24h":"1.58"},{"id":"3","name":"USDT Coin","symbol":"USDT","price":1,"change24h":"-3.44"},{"id":"4","name":"BNB Coin","symbol":"BNB","price":42.05756057443644,"change24h":"1.25"},{"id":"5","name":"SOL Coin","symbol":"SOL","price":1.559946326883077,"change24h":"-0.23"},{"id":"6","name":"USDC Coin","symbol":"USDC","price":1,"change24h":"-0.08"},{"id":"7","name":"XRP Coin","symbol":"XRP","price":21.70722710373112,"change24h":"4.22"},{"id":"8","name":"ADA Coin","symbol":"ADA","price":84.74999681411417,"change24h":"-1.20"},{"id":"9","name":"AVAX Coin","symbol":"AVAX","price":0.8236495610440597,"change24h":"-1.06"},{"id":"10","name":"DOGE Coin","symbol":"DOGE","price":14.082053437066499,"change24h":"-1.31"},{"id":"11","name":"TRX Coin","symbol":"TRX","price":8.676152506883206,"change24h":"4.15"},{"id":"12","name":"DOT Coin","symbol":"DOT","price":82.96120353301274,"change24h":"3.93"},{"id":"13","name":"LINK Coin","symbol":"LINK","price":52.98103947986361,"change24h":"2.45"},{"id":"14","name":"MATIC Coin","symbol":"MATIC","price":11.154331542060447,"change24h":"-0.51"},{"id":"15","name":"TON Coin","symbol":"TON","price":79.4287758483673,"change24h":"-0.70"},{"id":"16","name":"SHIB Coin","symbol":"SHIB","price":92.3686419153873,"change24h":"3.25"},{"id":"17","name":"LTC Coin","symbol":"LTC","price":68.19757901494705,"change24h":"-1.32"},{"id":"18","name":"BCH Coin","symbol":"BCH","price":9.110616512818815,"change24h":"4.98"},{"id":"19","name":"DAI Coin","symbol":"DAI","price":1,"change24h":"-0.81"},{"id":"20","name":"UNI Coin","symbol":"UNI","price":17.104098159748116,"change24h":"-2.62"},{"id":"21","name":"ATOM Coin","symbol":"ATOM","price":67.93813383494678,"change24h":"2.30"},{"id":"22","name":"XLM Coin","symbol":"XLM","price":15.012612261961689,"change24h":"0.44"},{"id":"23","name":"OKB Coin","symbol":"OKB","price":99.77751161314667,"change24h":"-2.51"},{"id":"24","name":"LEO Coin","symbol":"LEO","price":11.381195371505592,"change24h":"3.71"},{"id":"25","name":"XMR Coin","symbol":"XMR","price":11.841951145473818,"change24h":"-3.36"},{"id":"26","name":"ETC Coin","symbol":"ETC","price":42.55896039725189,"change24h":"1.15"},{"id":"27","name":"ICP Coin","symbol":"ICP","price":74.81929427444203,"change24h":"0.18"},{"id":"28","name":"FIL Coin","symbol":"FIL","price":67.83517108452439,"change24h":"2.63"},{"id":"29","name":"KAS Coin","symbol":"KAS","price":91.44853971734553,"change24h":"4.24"},{"id":"30","name":"LDO Coin","symbol":"LDO","price":88.13263065821124,"change24h":"4.15"},{"id":"31","name":"APT Coin","symbol":"APT","price":53.373176002013814,"change24h":"-1.70"},{"id":"32","name":"NEAR Coin","symbol":"NEAR","price":47.74509253550316,"change24h":"-2.45"},{"id":"33","name":"VET Coin","symbol":"VET","price":76.5356060374229,"change24h":"-1.87"},{"id":"34","name":"OP Coin","symbol":"OP","price":43.83870232703116,"change24h":"0.10"},{"id":"35","name":"ARB Coin","symbol":"ARB","price":83.27443784731203,"change24h":"-0.14"},{"id":"36","name":"MNT Coin","symbol":"MNT","price":46.87900542745016,"change24h":"3.28"},{"id":"37","name":"MKR Coin","symbol":"MKR","price":14.385790340002202,"change24h":"0.81"},{"id":"38","name":"INJ Coin","symbol":"INJ","price":89.40385974704652,"change24h":"-2.38"},{"id":"39","name":"QNT Coin","symbol":"QNT","price":79.36319620049366,"change24h":"3.88"},{"id":"40","name":"GRT Coin","symbol":"GRT","price":24.593378161947133,"change24h":"3.07"},{"id":"41","name":"AAVE Coin","symbol":"AAVE","price":46.23431592164666,"change24h":"-3.67"},{"id":"42","name":"STX Coin","symbol":"STX","price":84.33697820890336,"change24h":"-2.12"},{"id":"43","name":"BSV Coin","symbol":"BSV","price":50.62945037385549,"change24h":"-1.98"},{"id":"44","name":"ALGO Coin","symbol":"ALGO","price":82.69122985187596,"change24h":"4.44"},{"id":"45","name":"SNX Coin","symbol":"SNX","price":6.033494201632217,"change24h":"0.04"},{"id":"46","name":"EGLD Coin","symbol":"EGLD","price":90.60488233462934,"change24h":"2.48"},{"id":"47","name":"THETA Coin","symbol":"THETA","price":21.851604407801382,"change24h":"1.32"},{"id":"48","name":"RNDR Coin","symbol":"RNDR","price":37.18019467930995,"change24h":"4.74"},{"id":"49","name":"IMX Coin","symbol":"IMX","price":94.1806237831018,"change24h":"-4.18"},{"id":"50","name":"AXS Coin","symbol":"AXS","price":38.918823299926956,"change24h":"-0.43"},{"id":"51","name":"SAND Coin","symbol":"SAND","price":27.859453116909137,"change24h":"-2.99"},{"id":"52","name":"EOS Coin","symbol":"EOS","price":16.434697751882112,"change24h":"-4.68"},{"id":"53","name":"XTZ Coin","symbol":"XTZ","price":76.4935717896565,"change24h":"0.40"},{"id":"54","name":"FTM Coin","symbol":"FTM","price":68.82053584185593,"change24h":"4.45"},{"id":"55","name":"MANA Coin","symbol":"MANA","price":28.565431153873067,"change24h":"4.64"},{"id":"56","name":"APE Coin","symbol":"APE","price":94.73133447931006,"change24h":"0.05"},{"id":"57","name":"NEO Coin","symbol":"NEO","price":12.558988663534576,"change24h":"1.61"},{"id":"58","name":"KAVA Coin","symbol":"KAVA","price":13.904615236853068,"change24h":"-1.09"},{"id":"59","name":"RUNE Coin","symbol":"RUNE","price":28.626073094177173,"change24h":"-3.92"},{"id":"60","name":"FLOW Coin","symbol":"FLOW","price":68.79662138290068,"change24h":"0.11"},{"id":"61","name":"CHZ Coin","symbol":"CHZ","price":5.643656697934785,"change24h":"2.58"},{"id":"62","name":"MINA Coin","symbol":"MINA","price":9.772918676519794,"change24h":"-4.17"},{"id":"63","name":"FXS Coin","symbol":"FXS","price":42.37207622372012,"change24h":"-2.71"},{"id":"64","name":"GALA Coin","symbol":"GALA","price":66.17439983453635,"change24h":"1.34"},{"id":"65","name":"ZEC Coin","symbol":"ZEC","price":42.66014574195003,"change24h":"-4.79"},{"id":"66","name":"IOTA Coin","symbol":"IOTA","price":52.69665636962253,"change24h":"-2.62"},{"id":"67","name":"CRV Coin","symbol":"CRV","price":41.437111140691464,"change24h":"-2.23"},{"id":"68","name":"KLAY Coin","symbol":"KLAY","price":13.280877715619589,"change24h":"0.58"},{"id":"69","name":"XEC Coin","symbol":"XEC","price":22.273332914477905,"change24h":"1.38"},{"id":"70","name":"BTT Coin","symbol":"BTT","price":36.634430646564596,"change24h":"2.28"},{"id":"71","name":"CAKE Coin","symbol":"CAKE","price":17.338213874304675,"change24h":"0.31"},{"id":"72","name":"PAXG Coin","symbol":"PAXG","price":11.943837765087139,"change24h":"-3.92"},{"id":"73","name":"TUSD Coin","symbol":"TUSD","price":72.61154338624998,"change24h":"0.94"},{"id":"74","name":"COMP Coin","symbol":"COMP","price":4.365970697750421,"change24h":"-3.28"},{"id":"75","name":"HT Coin","symbol":"HT","price":71.45494922247792,"change24h":"3.01"},{"id":"76","name":"DASH Coin","symbol":"DASH","price":77.18704633188133,"change24h":"-1.43"},{"id":"77","name":"ZIL Coin","symbol":"ZIL","price":45.28044374221694,"change24h":"-1.69"},{"id":"78","name":"CFX Coin","symbol":"CFX","price":68.01490231151739,"change24h":"0.64"},{"id":"79","name":"1INCH Coin","symbol":"1INCH","price":6.75554495316284,"change24h":"2.77"},{"id":"80","name":"ENJ Coin","symbol":"ENJ","price":45.30124237932141,"change24h":"1.75"},{"id":"81","name":"BAT Coin","symbol":"BAT","price":23.133753427918435,"change24h":"4.86"},{"id":"82","name":"LRC Coin","symbol":"LRC","price":15.409480044577073,"change24h":"-2.99"},{"id":"83","name":"QTUM Coin","symbol":"QTUM","price":87.96827742667685,"change24h":"4.63"},{"id":"84","name":"NEXO Coin","symbol":"NEXO","price":29.539386777335984,"change24h":"3.22"},{"id":"85","name":"ROSE Coin","symbol":"ROSE","price":61.6017701240243,"change24h":"2.90"},{"id":"86","name":"RVN Coin","symbol":"RVN","price":9.016719504437454,"change24h":"0.28"},{"id":"87","name":"KSM Coin","symbol":"KSM","price":54.61965929460191,"change24h":"-1.09"},{"id":"88","name":"MASK Coin","symbol":"MASK","price":53.53394033697742,"change24h":"-0.53"},{"id":"89","name":"GMX Coin","symbol":"GMX","price":62.86062427888523,"change24h":"-2.96"},{"id":"90","name":"LPT Coin","symbol":"LPT","price":59.92147987108836,"change24h":"-0.80"},{"id":"91","name":"TWT Coin","symbol":"TWT","price":61.433666185883,"change24h":"1.60"},{"id":"92","name":"BAL Coin","symbol":"BAL","price":42.84333409650487,"change24h":"-3.34"},{"id":"93","name":"ENS Coin","symbol":"ENS","price":51.12974369556087,"change24h":"4.50"},{"id":"94","name":"GLM Coin","symbol":"GLM","price":43.161989734839665,"change24h":"-4.58"},{"id":"95","name":"YFI Coin","symbol":"YFI","price":77.95503899367733,"change24h":"4.55"},{"id":"96","name":"SXP Coin","symbol":"SXP","price":9.951223920601283,"change24h":"-3.16"},{"id":"97","name":"ILV Coin","symbol":"ILV","price":37.860171057482916,"change24h":"0.51"},{"id":"98","name":"BAND Coin","symbol":"BAND","price":84.03710400715279,"change24h":"-3.71"},{"id":"99","name":"OCEAN Coin","symbol":"OCEAN","price":98.20048868184121,"change24h":"-0.61"}];

export default function Overview() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [displayedBalance, setDisplayedBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setUserProfile(profile);
          setDisplayedBalance(Number(profile.total_balance) || 0);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Real-time balance growth effect
  useEffect(() => {
    if (!userProfile) return;
    const profitRate = Number(userProfile.profit_rate) || 0;
    if (profitRate <= 0) return;

    // Simulate growth: the profit rate is applied over time.
    // e.g. a 5% daily profit rate means balance increases by a tiny fraction every second.
    // To make it visible in real-time for demonstration, we'll increment slightly every 2 seconds.
    const interval = setInterval(() => {
      setDisplayedBalance(prev => {
        // Increment by a small random fraction of the profit rate to look organic
        const incrementFactor = (profitRate / 100) * (Math.random() * 0.0001); 
        // Ensure at least a tiny cent increase if balance > 0
        const minIncrement = prev > 0 ? 0.01 : 0;
        return prev + (prev * incrementFactor) + minIncrement;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [userProfile]);

  const greetingName = userProfile?.last_name || userProfile?.first_name || 'User';
  const displayGreeting = userProfile?.last_name ? `Welcome, ${userProfile.last_name}` : `Hello, ${greetingName}`;

  return (
    <div className="animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark">
             {loading ? 'Loading...' : displayGreeting}
          </h1>
          <p className="text-brand-text-gray mt-1">Here is the status of your crypto operations.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium">Total Balance (USD)</h3>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Activity size={20} /></div>
          </div>
          <p className="text-4xl font-display font-bold text-brand-dark">
            $${displayedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {Number(userProfile?.profit_rate) > 0 && (
            <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
              <TrendingUp size={16} /> +${userProfile?.profit_rate}% Active Growth
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium">Recovered Funds</h3>
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><ShieldCheck size={20} /></div>
          </div>
          <p className="text-4xl font-display font-bold text-brand-dark">$0.00</p>
          <p className="text-sm text-brand-text-gray mt-2 font-medium">Pending initial review</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-brand-text-gray font-medium">Action Required</h3>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl"><FileText size={20} /></div>
          </div>
          <p className="text-4xl font-display font-bold text-brand-dark">0</p>
          <p className="text-sm text-green-600 mt-2 font-medium bg-green-50 px-2 py-1 rounded-lg inline-block">All caught up</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Market List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-bold font-display text-brand-dark mb-6 flex items-center gap-2">
            <Bitcoin size={24} className="text-orange-500" /> Supported Crypto Assets
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {COINS.map(coin => (
              <div key={coin.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-brand-dark text-xs">
                    {coin.symbol.substring(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{coin.name}</h4>
                    <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-dark">$${Number(coin.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <p className={`text-xs font-bold ${Number(coin.change24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Number(coin.change24h) > 0 ? '+' : ''}{coin.change24h}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-brand-dark">Recent Operations</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div className="group block p-4 rounded-xl border border-gray-100 hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-brand-dark">SYS-9921</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-sm text-brand-text-gray mb-3">Monitoring wallet deposits</p>
              <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Just now</span>
              </div>
            </div>
            
            <div className="block p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
              No other recent operations found.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
