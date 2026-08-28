import React from 'react';
import { motion } from 'motion/react';

export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      {/* Deep Space Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d0914] via-black to-black opacity-100" />
      
      {/* Center Bright Sun / Star Core */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[20%] w-[120vw] h-[120vw] sm:w-[60vw] sm:h-[60vw] bg-fuchsia-600/20 rounded-full blur-[150px] mix-blend-screen"
      />
      
      {/* Orange/Amber Nebula Cloud */}
      <motion.div 
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] bg-amber-600/20 rounded-full blur-[160px] mix-blend-screen"
      />
      
      {/* Deep Blue Galactic Edge */}
      <motion.div 
        animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] right-[10%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] bg-blue-600/20 rounded-full blur-[140px] mix-blend-screen"
      />

      {/* Grid overlay for digital feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40 mix-blend-overlay" />
    </div>
  );
}
