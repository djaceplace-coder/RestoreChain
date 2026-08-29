import React, { useState } from 'react';

interface CoinLogoProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  image?: string;
}

export default function CoinLogo({ symbol = '', size = 'md', className = '', image }: CoinLogoProps) {
  const [imgError, setImgError] = useState(false);
  const sym = (symbol || '').toUpperCase();

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base'
  }[size];

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={symbol}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-contain shrink-0 ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Specific logo designs based on cryptocurrency symbol
  if (sym === 'BTC' || sym === 'BITCOIN') {
    return (
      <div className={`${sizeClasses} rounded-full bg-amber-500 text-white font-black flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="font-serif text-[115%] leading-none font-bold">₿</span>
      </div>
    );
  }

  if (sym === 'ETH' || sym === 'ETHEREUM') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-b from-indigo-600 to-purple-800 text-white flex items-center justify-center shadow-xs shrink-0 p-1.5 ${className}`}>
        <svg viewBox="0 0 784 1277" fill="currentColor" className="w-full h-full">
          <path d="M392.07 0L383.5 29.11V873.74L392.07 882.29L784.13 650.54L392.07 0Z" opacity="0.6"/>
          <path d="M392.07 0L0 650.54L392.07 882.29V471.55V0Z"/>
          <path d="M392.07 956.52L387.24 962.41V1271.74L392.07 1276.12L784.37 724.89L392.07 956.52Z" opacity="0.6"/>
          <path d="M392.07 1276.12V956.52L0 724.89L392.07 1276.12Z"/>
          <path d="M392.07 882.29L784.13 650.54L392.07 471.55V882.29Z" opacity="0.4"/>
          <path d="M0 650.54L392.07 882.29V471.55L0 650.54Z" opacity="0.8"/>
        </svg>
      </div>
    );
  }

  if (sym === 'USDT' || sym === 'TETHER') {
    return (
      <div className={`${sizeClasses} rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none tracking-tighter">₮</span>
      </div>
    );
  }

  if (sym === 'USDTO') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-r from-emerald-600 to-purple-600 text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 relative ${className}`}>
        <span className="leading-none text-[10px]">USDTO</span>
      </div>
    );
  }

  if (sym === 'FUSD' || sym === 'FREEDOM') {
    return (
      <div className={`${sizeClasses} rounded-full bg-sky-500 text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none">F$</span>
      </div>
    );
  }

  if (sym === 'USDC') {
    return (
      <div className={`${sizeClasses} rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none font-sans">$</span>
      </div>
    );
  }

  if (sym === 'SOL' || sym === 'SOLANA') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-teal-400 text-white font-black flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none text-[9px] font-mono">SOL</span>
      </div>
    );
  }

  if (sym === 'BNB') {
    return (
      <div className={`${sizeClasses} rounded-full bg-yellow-500 text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none text-[10px]">BNB</span>
      </div>
    );
  }

  if (sym === 'MATIC' || sym === 'POLYGON' || sym === 'POL') {
    return (
      <div className={`${sizeClasses} rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none text-[9px]">MATIC</span>
      </div>
    );
  }

  if (sym === 'AVAX' || sym === 'AVALANCHE') {
    return (
      <div className={`${sizeClasses} rounded-full bg-red-600 text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none text-[9px]">AVAX</span>
      </div>
    );
  }

  if (sym === 'ADA' || sym === 'CARDANO') {
    return (
      <div className={`${sizeClasses} rounded-full bg-blue-700 text-white font-bold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none text-[9px]">ADA</span>
      </div>
    );
  }

  if (sym === 'XRP' || sym === 'RIPPLE') {
    return (
      <div className={`${sizeClasses} rounded-full bg-gray-900 text-white font-bold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none text-[9px]">XRP</span>
      </div>
    );
  }

  if (sym === 'DOGE' || sym === 'DOGECOIN') {
    return (
      <div className={`${sizeClasses} rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center shadow-xs shrink-0 ${className}`}>
        <span className="leading-none font-sans">Ð</span>
      </div>
    );
  }

  // Generic fallback with styled color badge based on first character code
  const charCode = sym.charCodeAt(0) || 65;
  const bgColors = [
    'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 
    'bg-amber-600', 'bg-rose-600', 'bg-teal-600', 'bg-indigo-600'
  ];
  const bg = bgColors[charCode % bgColors.length];

  return (
    <div className={`${sizeClasses} rounded-full ${bg} text-white font-bold flex items-center justify-center shadow-xs shrink-0 ${className}`}>
      <span>{sym.substring(0, 3)}</span>
    </div>
  );
}
