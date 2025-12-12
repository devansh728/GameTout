import { motion } from "framer-motion";
import { Circle } from "lucide-react";

const headlines = [
  "BREAKING: Indus Battle Royale enters Open Beta",
  "IGDC 2025: Keynote Speakers Announced",
  "Nodding Heads Games teases new mythological RPG",
  "Esports: Global Esports secures franchise slot",
  "Review: The new Mumbai Gullies trailer breaks records"
];

export const BreakingNewsTicker = () => {
  return (
    <div className="relative w-full bg-black/80 backdrop-blur-md border-t border-white/10 overflow-hidden z-20 h-12 flex items-center">
      {/* Label Badge */}
      <div className="absolute left-0 top-0 bottom-0 bg-destructive text-destructive-foreground px-6 flex items-center gap-2 z-30 font-display uppercase tracking-wider text-sm font-bold shadow-2xl">
        <div className="relative flex items-center justify-center">
          <Circle className="w-3 h-3 fill-white animate-pulse" />
        </div>
        Live Feed
      </div>

      {/* Scrolling Text */}
      <div className="flex whitespace-nowrap mask-linear-fade w-full pl-32 md:pl-40">
        <motion.div 
          className="flex gap-16 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 20 
          }}
        >
          {[...headlines, ...headlines, ...headlines].map((text, i) => (
            <span key={i} className="text-sm md:text-base text-gray-300 font-mono flex items-center gap-4">
              {text}
              <span className="text-yellow-500/50 text-xs">●</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};