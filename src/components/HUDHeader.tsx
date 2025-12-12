import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";

interface HUDHeaderProps {
  onLoginClick: () => void;
  isAuthenticated?: boolean; // You can hook this to real auth later
}

export const HUDHeader = ({ onLoginClick, isAuthenticated = false }: HUDHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-start pointer-events-none">
      
      {/* LEFT: Brand Logo (Pointer events auto to allow clicking) */}
      <div className="pointer-events-auto">
         {/* Simple text logo for now, replace with Image if you have one */}
         <div className="flex flex-col">
            <h1 className="font-display text-3xl font-bold uppercase text-white leading-none tracking-tighter">
              Game<span className="text-[#FFAB00]">Tout</span>
            </h1>
            <span className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase">
              Official Nexus
            </span>
         </div>
      </div>

      {/* RIGHT: Auth Button (The "Social Club" Trigger) */}
      <div className="pointer-events-auto">
        <motion.button
          onClick={onLoginClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 pr-5 pl-1 py-1 rounded-full overflow-hidden hover:border-[#FFAB00] transition-colors"
        >
          {/* Avatar / Icon Circle */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
            ${isAuthenticated ? "bg-[#FFAB00] border-white" : "bg-white/10 border-white/20 group-hover:border-[#FFAB00]"}`}>
            {isAuthenticated ? (
               <ShieldCheck className="w-5 h-5 text-black" />
            ) : (
               <User className="w-5 h-5 text-white group-hover:text-[#FFAB00]" />
            )}
          </div>

          {/* Text Info */}
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-[#FFAB00]">
              {isAuthenticated ? "Clearance Level 5" : "Guest Access"}
            </span>
            <span className="font-display text-sm font-bold text-white leading-none uppercase">
              {isAuthenticated ? "Operative Online" : "Sign In"}
            </span>
          </div>

          {/* Decorative Corner (Gaming UI feel) */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FFAB00] opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>
    </header>
  );
};