import { motion } from "framer-motion";
import { Briefcase, Building2, Calendar, Terminal, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const stats = [
  {
    id: 1,
    label: "Active Studios",
    value: "142",
    icon: Building2,
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5"
  },
  {
    id: 2,
    label: "Open Positions",
    value: "28",
    icon: Briefcase,
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5"
  },
  {
    id: 3,
    label: "Upcoming Events",
    value: "05",
    icon: Calendar,
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5"
  }
];

export const CommunityTerminal = () => {
  const [text, setText] = useState("");
  const fullText = "> SYSTEM_STATUS: ONLINE // CONNECTING TO INDIAN_GAMEDEV_NETWORK...";

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden font-mono">
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10" 
           style={{ background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }} 
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20">
        
        {/* Terminal Header */}
        <div className="mb-12 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <Terminal className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">The Network</span>
          </div>
          <h2 className="text-2xl md:text-3xl text-gray-300 min-h-[40px]">
            {text}<span className="animate-pulse">_</span>
          </h2>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative p-6 border ${stat.border} ${stat.bg} backdrop-blur-sm rounded-sm overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <span className={`text-4xl font-bold ${stat.color} tracking-tighter`}>{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm uppercase tracking-widest">{stat.label}</p>
              
              {/* Hover Scan Effect */}
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Glitch CTA Button */}
        <div className="flex justify-center">
          <button className="relative group px-8 py-4 bg-[#FFAB00] text-black font-bold text-lg uppercase tracking-widest overflow-hidden hover:bg-white transition-colors duration-100 clip-path-polygon">
            <span className="relative z-10 flex items-center gap-2">
              Enter The Network <ArrowRight className="w-5 h-5" />
            </span>
            
            {/* Glitch Layers */}
            <div className="absolute inset-0 bg-red-500 translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity z-0" />
            <div className="absolute inset-0 bg-cyan-500 -translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity z-0" />
          </button>
        </div>
      </div>
    </section>
  );
};