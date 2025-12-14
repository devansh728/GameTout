import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShieldCheck, Zap, MapPin } from "lucide-react";

// --- DUMMY DATA FOR OPERATIVES ---
const operatives = [
  { id: 1, name: "Aditya Kumar", role: "VFX Artist", level: "LVL 5", rate: "$45/hr", location: "Bangalore", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", specialty: "Niagara" },
  { id: 2, name: "Priya Nair", role: "3D Modeler", level: "LVL 4", rate: "$35/hr", location: "Mumbai", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", specialty: "ZBrush" },
  { id: 3, name: "Vikram Singh", role: "Unity Dev", level: "LVL 6", rate: "$55/hr", location: "Delhi", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", specialty: "C#" },
  { id: 4, name: "Neha Gupta", role: "Sound Eng.", level: "LVL 3", rate: "$30/hr", location: "Pune", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", specialty: "FMOD" },
  { id: 5, name: "Rahul Dev", role: "Game Design", level: "LVL 5", rate: "$40/hr", location: "Hyderabad", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", specialty: "Systems" },
];

export const PortfolioRail = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      
      {/* Background Texture: Digital Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
            backgroundImage: "linear-gradient(rgba(255, 171, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 171, 0, 0.1) 1px, transparent 1px)", 
            backgroundSize: "40px 40px" 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="h-[2px] w-8 bg-[#FFAB00]" />
                <span className="text-[#FFAB00] font-mono text-xs tracking-[0.2em] uppercase">Active Network</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white tracking-tight leading-none">
              Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Operatives</span>
            </h2>
          </div>
          
          {/* View All & Navigation */}
          <div className="flex items-center gap-4">
             <a href="/portfolios" className="hidden md:flex items-center gap-2 text-xs font-bold font-mono uppercase text-gray-400 hover:text-[#FFAB00] transition-colors">
                View Full Roster
             </a>
             <div className="flex gap-2">
                <button 
                    onClick={() => scroll("left")}
                    className="p-3 rounded-full border border-white/10 bg-black/50 hover:bg-[#FFAB00] hover:text-black hover:border-[#FFAB00] transition-all duration-300 group"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => scroll("right")}
                    className="p-3 rounded-full border border-white/10 bg-black/50 hover:bg-[#FFAB00] hover:text-black hover:border-[#FFAB00] transition-all duration-300 group"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-12 pt-4 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {operatives.map((op) => (
            <motion.div 
              key={op.id}
              className="relative group flex-shrink-0 w-[280px] md:w-[320px] aspect-[3/4] rounded-sm bg-gray-900 snap-center cursor-pointer perspective-1000"
              whileHover="hover" // Triggers hover animations for children
              initial="rest"
              animate="rest"
            >
              {/* Card Container (The Box) */}
              <div className="absolute inset-0 rounded-sm overflow-hidden border border-white/10 group-hover:border-[#FFAB00]/50 transition-colors duration-500 bg-black shadow-2xl">
                
                {/* --- IMAGE SECTION --- */}
                <div className="absolute inset-0 h-3/5 w-full overflow-hidden bg-gray-900">
                    {/* Image: Pure Color (No Grayscale), Scale on Hover */}
                    <img 
                        src={op.img} 
                        alt={op.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    
                    {/* Holographic Sheen Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-20" />

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFAB00]/20 to-transparent h-[10px] w-full animate-scan pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ animation: 'scan 2s linear infinite' }} />

                    {/* Gradient Shade only at bottom for text readability */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#050505] to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur border border-[#FFAB00]/30 px-2 py-1 flex items-center gap-1.5 rounded-sm z-30 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">Available</span>
                    </div>
                </div>

                {/* --- INFO SECTION (Bottom) --- */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-[#050505] border-t border-white/5 overflow-hidden">
                    
                    {/* Content Wrapper that slides UP */}
                    <motion.div 
                        className="p-6 h-full flex flex-col justify-between relative z-10"
                        variants={{
                            rest: { y: 0 },
                            hover: { y: -45 } // Shift up to make room for button
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        {/* Name & Role */}
                        <div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-display text-2xl text-white uppercase leading-none">{op.name}</h3>
                                <ShieldCheck className="w-4 h-4 text-[#FFAB00]" />
                            </div>
                            <p className="text-[#FFAB00] text-xs font-bold uppercase tracking-wide bg-[#FFAB00]/10 inline-block px-1.5 py-0.5 rounded-sm border border-[#FFAB00]/20">
                                {op.role} // {op.level}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-y-2 text-xs font-mono text-gray-500">
                            <div>
                                <span className="block text-[10px] uppercase opacity-50">Location</span>
                                <span className="text-white flex items-center gap-1"><MapPin className="w-3 h-3" /> {op.location}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase opacity-50">Rate</span>
                                <span className="text-white">{op.rate}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- INITIATE BUTTON (Slides Up) --- */}
                    <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-12 bg-[#FFAB00] flex items-center justify-center gap-2 z-20 shadow-[0_-5px_20px_rgba(255,171,0,0.3)]"
                        initial={{ y: "100%" }}
                        variants={{
                            rest: { y: "100%" },
                            hover: { y: 0 }
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <Zap className="w-4 h-4 fill-black text-black animate-pulse" />
                        <span className="text-black font-bold uppercase tracking-widest text-xs">Initiate Contact</span>
                    </motion.div>
                </div>
              </div>

              {/* Floor Reflection/Shadow */}
              <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/50 blur-xl rounded-[100%] group-hover:bg-[#FFAB00]/20 transition-colors duration-500" />

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};