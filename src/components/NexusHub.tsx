import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Film, Mic, Users, Building2, Grid, ChevronDown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { statsService } from "@/services/statsService";

const hubs = [
  { id: "reviews", label: "Reviews", icon: Star, path: "/reviews", color: "text-cyan-400", bg: "hover:bg-cyan-500/10" },
  { id: "docs", label: "Documentaries", icon: Film, path: "/documentary", color: "text-red-500", bg: "hover:bg-red-500/10" },
  { id: "podcast", label: "Podcast", icon: Mic, path: "/podcast", color: "text-purple-500", bg: "hover:bg-purple-500/10" },
  { id: "portfolio", label: "Portfolios", icon: Users, path: "/portfolios", color: "text-green-500", bg: "hover:bg-green-500/10" },
  { id: "studios", label: "Studios", icon: Building2, path: "/studios", color: "text-[#FFAB00]", bg: "hover:bg-yellow-500/10" },
];

export const NexusHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    statsService.getAllCounts().then(stats => {
      setCounts({
        reviews: stats.reviews,
        docs: stats.documentaries,
        podcast: stats.podcasts,
        portfolio: stats.portfolios,
        studios: stats.studios
      });
    });
  }, []);

  return (
    <section className="py-20 flex justify-center relative z-30 px-4">
      
      {/* 1. Ambient Glow (Always visible to separate from background) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 bg-[#FFAB00] blur-[100px] transition-opacity duration-500 ${isOpen ? "opacity-10" : "opacity-20"}`} />

      {/* 2. The Morphing Container */}
      <motion.div
        layout
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        initial={{ width: 240, height: 64, borderRadius: 50 }}
        animate={{ 
            width: isOpen ? 800 : 240, // Expands width
            height: isOpen ? 200 : 64, // Expands height
            borderRadius: isOpen ? 24 : 50, // Square out corners
            backgroundColor: isOpen ? "rgba(10, 10, 10, 0.95)" : "#FFAB00", // Color Shift: Yellow -> Black
            borderColor: isOpen ? "rgba(255, 171, 0, 0.3)" : "#FFAB00"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative overflow-hidden border cursor-pointer shadow-2xl z-40 backdrop-blur-md"
        style={{ 
            boxShadow: isOpen ? "0 20px 50px -10px rgba(0,0,0,0.5)" : "0 0 30px rgba(255, 171, 0, 0.4)"
        }}
      >
        <AnimatePresence mode="wait">
            
            {/* --- STATE A: THE CLOSED "PILL" (Yellow) --- */}
            {!isOpen ? (
                <motion.div 
                    key="closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center gap-3 text-black font-bold uppercase tracking-widest"
                >
                    <Grid className="w-5 h-5 fill-black" />
                    <span className="font-display text-sm">Explore Network</span>
                    <ChevronDown className="w-4 h-4 animate-bounce" />
                </motion.div>
            ) : (
                
            /* --- STATE B: THE OPEN "GRID" (Dark) --- */
                <motion.div 
                    key="open"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="h-full w-full p-6 flex flex-col"
                >
                    {/* Header inside the open box */}
                    <div className="flex justify-between items-center mb-6 px-2 border-b border-white/10 pb-2">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Select Channel</span>
                        <div className="flex gap-1">
                            <span className="w-1 h-1 rounded-full bg-[#FFAB00] animate-pulse" />
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                        </div>
                    </div>

                    {/* The Grid Icons */}
                    <div className="grid grid-cols-5 gap-2 h-full">
                        {hubs.map((hub, i) => (
                            <Link 
                                key={hub.id} 
                                to={hub.path}
                                className={`group flex flex-col items-center justify-center gap-2 rounded-md transition-all duration-300 border border-transparent hover:border-white/10 ${hub.bg}`}
                            >
                                <motion.div
                                    initial={{ scale: 0, y: 10 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, type: "spring" }}
                                >
                                    <hub.icon className={`w-8 h-8 ${hub.color} drop-shadow-md group-hover:scale-110 transition-transform`} />
                                </motion.div>
                                <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-white transition-colors tracking-wider">
                                    {hub.label}
                                </span>
                                <span className="text-[9px] font-mono text-gray-600 group-hover:text-gray-400 transition-colors">
                                  {counts[hub.id] !== undefined ? counts[hub.id] : '—'}
                                </span>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};