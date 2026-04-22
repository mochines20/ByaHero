import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function JeepneyLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-byahero-navy">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-byahero-navy via-[#1E3A8A] to-[#3B82F6] bg-[length:400%_400%] animate-gradient-slow opacity-40" />
      
      {/* Cityscape Silhouette Placeholder (Purely Decorative) */}
      <div className="absolute bottom-0 w-full h-32 opacity-10 bg-repeat-x pointer-events-none" style={{ backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 100%)' }} />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-80 h-32 mb-12">
          {/* Animated Jeepney SVG */}
          <motion.div 
            animate={{ 
              x: ["-20%", "120%"],
              y: [0, -2, 0, -2, 0] 
            }}
            transition={{ 
              x: { duration: 3, repeat: Infinity, ease: "linear" },
              y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-0"
          >
            <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Body */}
              <path d="M10 50H130V30C130 25 125 20 120 20H35C30 20 25 25 25 30V40H10V50Z" fill="#0A2463" stroke="#FFD60A" strokeWidth="2"/>
              {/* Windows */}
              <rect x="30" y="25" width="20" height="15" rx="2" fill="#DBEAFE" fillOpacity="0.3" stroke="#FFD60A" strokeWidth="1"/>
              <rect x="55" y="25" width="65" height="15" rx="2" fill="#DBEAFE" fillOpacity="0.3" stroke="#FFD60A" strokeWidth="1"/>
              {/* Wheels */}
              <circle cx="35" cy="50" r="10" fill="#0A2463" stroke="#FFD60A" strokeWidth="2"/>
              <circle cx="115" cy="50" r="10" fill="#0A2463" stroke="#FFD60A" strokeWidth="2"/>
              {/* Branding */}
              <text x="65" y="45" fill="#FFD60A" fontSize="9" fontWeight="900" fontFamily='"Baloo 2", cursive'>BYAHERO</text>
            </svg>
          </motion.div>
          
          {/* Road line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-byahero-yellow/30 to-transparent" />
        </div>

        <div className="text-center group">
          <h2 className="font-brand text-3xl font-black tracking-widest text-byahero-yellow drop-shadow-yellow animate-pulse">
            Sumasakay na{dots}
          </h2>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Sandali lang, ka-byahero...
          </p>
        </div>
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return <JeepneyLoader />;
}

