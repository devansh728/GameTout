import { motion } from "framer-motion";
import { MapPin, Linkedin, Lock, Eye } from "lucide-react";
import { Developer } from "@/types/portfolio";

interface BasicPortfolioCardProps {
  developer: Developer;
  onClick: () => void;
  isRestricted?: boolean;
  onUnlockClick?: () => void;
}

export const BasicPortfolioCard = ({
  developer,
  onClick,
  isRestricted = false,
  onUnlockClick,
}: BasicPortfolioCardProps) => {
  const handleClick = () => {
    if (isRestricted && onUnlockClick) {
      onUnlockClick();
    } else {
      onClick();
    }
  };

  const firstName = developer.name.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="relative group cursor-pointer w-full h-full"
    >
      {/* Card container - aspect-square preserved */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-lg border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/30 group-hover:shadow-xl">
        
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Restricted badge - absolute, top-right corner */}
        {isRestricted && (
          <div className="absolute top-1.5 right-1.5 z-10">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/70 rounded-full border border-white/10">
              <Lock className="w-2.5 h-2.5 text-gray-500" />
            </div>
          </div>
        )}

        {/* Corner accent - absolute decoration */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-16 h-0.5 bg-gradient-to-l from-white/20 to-transparent transform rotate-45 translate-x-4 -translate-y-2" />
        </div>

        {/* === MAIN CONTENT - Flexbox column, no absolute positioning === */}
        <div className="relative z-[1] flex flex-col items-center justify-between h-full px-2 sm:px-3 py-3 sm:py-4">
          
          {/* Top section: Avatar */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <motion.img
              src={developer.avatar}
              alt={developer.name}
              className="relative w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"
              loading="lazy"
            />

            {/* Online status dot */}
            {developer.status === "Open for Work" && (
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full border-[1.5px] border-[#0a0a0a] shadow-[0_0_8px_#22c55e]" />
            )}
          </div>

          {/* Middle section: Name + Role + Location */}
          <div className="flex flex-col items-center min-w-0 w-full mt-1.5 sm:mt-2 flex-1 justify-center gap-0.5">
            {/* Name */}
            <h3 className="font-display font-bold text-white truncate w-full text-center text-[11px] xs:text-xs sm:text-sm md:text-base leading-tight">
              <span className="hidden xs:inline">{developer.name}</span>
              <span className="xs:hidden">{firstName}</span>
            </h3>

            {/* Role */}
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-400 font-medium truncate w-full text-center leading-tight">
              {developer.role}
            </p>

            {/* Location */}
            <div className="flex items-center justify-center gap-0.5 text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 mt-0.5">
              <MapPin className="w-2 h-2 xs:w-2.5 xs:h-2.5 shrink-0" />
              <span className="truncate max-w-[70px] xs:max-w-[80px] sm:max-w-[100px]">
                {developer.location}
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center justify-center gap-1 mt-1 sm:mt-1.5 w-full">
              {developer.badges.slice(0, 2).map((badge, i) => (
                <span
                  key={i}
                  className="text-[6px] xs:text-[7px] sm:text-[8px] bg-white/8 border border-white/5 px-1.5 py-0.5 rounded text-gray-400 truncate max-w-[50px] xs:max-w-[55px] sm:max-w-[65px]"
                >
                  {badge}
                </span>
              ))}
              {developer.badges.length > 2 && (
                <span className="text-[6px] xs:text-[7px] sm:text-[8px] text-gray-600">
                  +{developer.badges.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Bottom section: LinkedIn button */}
          <div className="shrink-0 mt-1.5 sm:mt-2">
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white rounded-md border border-[#0077B5]/30 transition-all duration-300"
            >
              <Linkedin className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
              <span className="text-[7px] xs:text-[8px] font-bold uppercase tracking-wide">
                Connect
              </span>
            </motion.a>
          </div>
        </div>

        {/* Hover overlay - view indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-[52px] xs:pb-14 pointer-events-none rounded-lg z-[2]"
        >
          <div className="flex items-center gap-1 text-white/80 text-[8px] xs:text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Eye className="w-3 h-3" />
            <span>{isRestricted ? "Unlock" : "View"}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BasicPortfolioCard;