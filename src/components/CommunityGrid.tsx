import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Star, ShieldCheck, Zap, Crosshair, Terminal } from "lucide-react";

// --- SUB-COMPONENT: FACTION CONSENSUS (POLL) ---
const FactionConsensus = () => {
  const [voted, setVoted] = useState<"A" | "B" | null>(null);

  // Mock Data
  const poll = {
    question: "PREFERRED ENGINE 2025",
    optionA: "UNREAL 5",
    optionB: "UNITY 6",
    percentA: 68,
    percentB: 32
  };

  return (
    <div className="h-full bg-[#121212] border border-white/10 p-8 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #121212 25%, #121212 75%, #000 75%, #000)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px" }} 
      />

      <div className="relative z-10 mb-8 flex justify-between items-end">
        <div>
           <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Daily Consensus // Vote Required</div>
           <h3 className="font-display text-4xl font-bold uppercase text-white leading-none">{poll.question}</h3>
        </div>
        <Users className="w-6 h-6 text-[#FFAB00]" />
      </div>

      <div className="flex-1 flex flex-col gap-4 justify-center">
        {/* Option A Bar */}
        <motion.button
          onClick={() => !voted && setVoted("A")}
          disabled={!!voted}
          className="relative w-full h-24 group overflow-hidden border border-white/20 hover:border-[#FFAB00] transition-colors"
        >
           {/* Fill Animation */}
           <motion.div 
             className="absolute inset-0 bg-[#FFAB00]"
             initial={{ width: 0 }}
             animate={{ width: voted ? `${poll.percentA}%` : "0%" }}
             transition={{ duration: 1, ease: "circOut" }}
           />
           
           <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
             <span className={`font-display text-3xl font-bold uppercase ${voted ? "text-black" : "text-white group-hover:text-[#FFAB00]"}`}>
               {poll.optionA}
             </span>
             {voted && (
               <motion.span 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="font-mono text-2xl font-bold text-black"
               >
                 {poll.percentA}%
               </motion.span>
             )}
           </div>
        </motion.button>

        {/* VS Badge */}
        {!voted && (
            <div className="self-center -my-2 z-20 bg-black px-3 py-1 text-xs font-bold text-gray-500 border border-white/10 rounded-full">VS</div>
        )}

        {/* Option B Bar */}
        <motion.button
          onClick={() => !voted && setVoted("B")}
          disabled={!!voted}
          className="relative w-full h-24 group overflow-hidden border border-white/20 hover:border-cyan-400 transition-colors"
        >
           {/* Fill Animation */}
           <motion.div 
             className="absolute inset-0 bg-cyan-500"
             initial={{ width: 0 }}
             animate={{ width: voted ? `${poll.percentB}%` : "0%" }}
             transition={{ duration: 1, ease: "circOut" }}
           />
           
           <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
             <span className={`font-display text-3xl font-bold uppercase ${voted ? "text-black" : "text-white group-hover:text-cyan-400"}`}>
               {poll.optionB}
             </span>
             {voted && (
               <motion.span 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="font-mono text-2xl font-bold text-black"
               >
                 {poll.percentB}%
               </motion.span>
             )}
           </div>
        </motion.button>
      </div>

      {voted && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center text-xs font-mono text-gray-500 mt-6"
        >
            <Terminal className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">VOTE_HASH_RECORDED: 0x8F3...A2 // SYNCING...</span>
          {/* > VOTE_HASH_RECORDED: 0x8F3...A2 // SYNCING... */}
        </motion.p>
      )}
    </div>
  );
};


// --- SUB-COMPONENT: OPERATIVE SPOTLIGHT (WANTED POSTER) ---
const OperativeSpotlight = () => {
  return (
    <div className="h-full bg-[#0a0a0a] border border-[#FFAB00]/30 relative p-6 flex flex-col min-h-[400px] group">
      
      {/* Decorative Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FFAB00]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFAB00]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FFAB00]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FFAB00]" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider animate-pulse">
            High Demand
          </span>
          <h3 className="font-display text-2xl font-bold text-white uppercase mt-1">
            Operative <span className="text-gray-500">#804</span>
          </h3>
        </div>
        <ShieldCheck className="w-5 h-5 text-[#FFAB00]" />
      </div>

      {/* Character Image/Avatar */}
      <div className="relative flex-1 bg-gray-900 overflow-hidden mb-6 border border-white/10 group-hover:border-[#FFAB00] transition-colors">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" 
          alt="Developer" 
          className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
        />
        
        {/* Overlay Scanner Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFAB00]/10 to-transparent h-[10px] w-full animate-scan" 
             style={{ animation: 'scan 3s linear infinite' }} />
             
        {/* Stars Overlay */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#FFAB00] text-[#FFAB00]" />)}
        </div>
      </div>

      {/* Stats/Info */}
      <div className="space-y-3 mb-6 font-mono text-sm">
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="text-gray-500">CLASS</span>
          <span className="text-white font-bold">VFX ARTIST (LVL 5)</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="text-gray-500">SPECIALTY</span>
          <span className="text-white">NIAGARA / HOUDINI</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="text-gray-500">BOUNTY (RATE)</span>
          <span className="text-[#FFAB00] font-bold">$45 / HR</span>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full py-3 bg-white hover:bg-[#FFAB00] text-black font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,171,0,0.4)]">
        <Zap className="w-4 h-4 fill-black" />
        Initiate Contact
      </button>

    </div>
  );
};


// --- MAIN CONTAINER EXPORT ---
export const CommunityGrid = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="mb-10 flex items-center gap-3">
          <Crosshair className="w-6 h-6 text-white" />
          <h2 className="font-display text-4xl font-bold uppercase text-white">
            Community <span className="text-gray-600">Intel</span>
          </h2>
        </div>

        {/* The Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[500px]">
          
          {/* Left: Poll (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <FactionConsensus />
          </div>

          {/* Right: Wanted Poster (Spans 1 column) */}
          <div className="lg:col-span-1">
            <OperativeSpotlight />
          </div>

        </div>
      </div>
    </section>
  );
};