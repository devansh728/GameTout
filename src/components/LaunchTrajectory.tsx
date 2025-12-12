import { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, MapPin, Crosshair } from "lucide-react";

interface LaunchEvent {
  id: number;
  title: string;
  date: string;
  displayDate: string;
  type: "Game Release" | "Event" | "Update";
  platform: string;
  image: string;
  status: "Confirmed" | "Rumored" | "Beta";
}

const launches: LaunchEvent[] = [
  {
    id: 1,
    title: "Indus Battle Royale",
    date: "2025-08-15",
    displayDate: "AUG 15",
    type: "Game Release",
    platform: "PC / Mobile",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    status: "Beta"
  },
  {
    id: 2,
    title: "Mumbai Gullies",
    date: "2025-09-10",
    displayDate: "SEP 10",
    type: "Game Release",
    platform: "PS5 / PC",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    status: "Confirmed"
  },
  {
    id: 3,
    title: "IGDC 2025",
    date: "2025-11-02",
    displayDate: "NOV 02",
    type: "Event",
    platform: "Hyderabad",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    status: "Confirmed"
  },
  {
    id: 4,
    title: "Raji 2: The Sequel",
    date: "2025-12-25",
    displayDate: "DEC 25",
    type: "Game Release",
    platform: "All Platforms",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    status: "Rumored"
  },
  {
    id: 5,
    title: "Protocol: Gemini",
    date: "2026-01-15",
    displayDate: "JAN 15",
    type: "Update",
    platform: "PC",
    image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=600&q=80",
    status: "Confirmed"
  }
];

export const LaunchTrajectory = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // DRAG TO SCROLL LOGIC
  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5 select-none">
      
      {/* Background: Digital Grid Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: "linear-gradient(#FFAB00 1px, transparent 1px), linear-gradient(90deg, #FFAB00 1px, transparent 1px)", backgroundSize: "50px 50px" }} 
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex items-end gap-4 mb-20 pointer-events-none">
          <div className="p-3 bg-[#FFAB00]/10 border border-[#FFAB00]/20 rounded-sm">
            <Rocket className="w-8 h-8 text-[#FFAB00]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
               <span className="text-xs font-mono text-red-500 tracking-widest uppercase">Syncing with Server...</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white tracking-tighter leading-none">
              Launch <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] to-yellow-200">Trajectory</span>
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-2 flex items-center gap-2">
              <Crosshair className="w-3 h-3" /> DRAG TO NAVIGATE TIMELINE
            </p>
          </div>
        </div>

        {/* Timeline Container - Hidden Scrollbar + Drag Enabled */}
        <div 
          ref={scrollRef}
          className={`relative min-h-[450px] w-full overflow-x-auto overflow-y-visible pb-10 
            cursor-${isDragging ? 'grabbing' : 'grab'} 
            scrollbar-none [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="min-w-[1200px] px-10 relative mt-20">
            
            {/* The Main Timeline Line */}
            <div className="absolute top-[9px] left-0 right-0 h-[2px] bg-white/10 w-full pointer-events-none">
              <motion.div 
                className="h-full bg-gradient-to-r from-transparent via-[#FFAB00] to-transparent opacity-50"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Timeline Nodes */}
            <div className="flex justify-between relative">
              {launches.map((launch) => (
                <div 
                  key={launch.id} 
                  className="relative group"
                  onMouseEnter={() => !isDragging && setHoveredId(launch.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* The Dot (Node) */}
                  <div className="relative z-20 flex flex-col items-center">
                    
                    {/* Pulsing Ring */}
                    <div className="absolute -inset-4 rounded-full border border-[#FFAB00]/30 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-500" />
                    
                    {/* Core Dot */}
                    <div className={`w-5 h-5 rounded-full border-4 border-[#0a0a0a] transition-colors duration-300 z-20 shadow-xl
                      ${hoveredId === launch.id ? "bg-[#FFAB00] shadow-[0_0_20px_#FFAB00]" : "bg-gray-600 group-hover:bg-white"}`} 
                    />
                    
                    {/* Date Label */}
                    <span className={`mt-4 font-mono text-sm tracking-widest transition-colors duration-300
                      ${hoveredId === launch.id ? "text-[#FFAB00]" : "text-gray-500"}`}>
                      {launch.displayDate}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-5 w-[1px] bg-gradient-to-b from-[#FFAB00] to-transparent transition-all duration-300 pointer-events-none
                    ${hoveredId === launch.id ? "h-16 opacity-100" : "h-0 opacity-0"}`} 
                  />

                  {/* Holographic Card (With AnimatePresence for smooth unmount) */}
                  <AnimatePresence>
                    {hoveredId === launch.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 z-30 w-72 pointer-events-none" // pointer-events-none to prevent drag interruption
                      >
                        <div className="relative bg-black/90 border border-[#FFAB00]/30 backdrop-blur-xl rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                          
                          {/* Image Section */}
                          <div className="h-32 relative overflow-hidden">
                            <img src={launch.image} alt={launch.title} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            
                            {/* Scanline Animation */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFAB00]/20 to-transparent h-[20%]"
                              animate={{ top: ["-20%", "120%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Status Badge */}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#FFAB00]">
                              {launch.status}
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="p-4 relative">
                            {/* Decorative Corner Brackets */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FFAB00]" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FFAB00]" />

                            <h3 className="font-display text-xl font-bold text-white uppercase leading-none mb-1">{launch.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-mono">
                              <MapPin className="w-3 h-3" /> {launch.platform}
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                              <span className="text-[10px] uppercase text-gray-500 tracking-widest">{launch.type}</span>
                              <div className="flex items-center gap-1 text-[#FFAB00] text-xs font-bold">
                                <Crosshair className="w-3 h-3" />
                                TRACKING
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Triangle Pointer */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-t border-l border-[#FFAB00]/30 transform rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Progress Bar (The "Replacement" for the Scrollbar) */}
        <div className="absolute bottom-10 left-4 md:left-8 right-4 md:right-8 h-[1px] bg-white/10 mt-4">
            <motion.div 
                className="h-[2px] bg-[#FFAB00] w-[100px] shadow-[0_0_10px_#FFAB00]"
                animate={{ 
                    x: scrollRef.current ? (scrollLeft / (scrollRef.current.scrollWidth - scrollRef.current.clientWidth)) * (scrollRef.current.clientWidth - 100) : 0 
                }}
            />
        </div>

      </div>
    </section>
  );
};