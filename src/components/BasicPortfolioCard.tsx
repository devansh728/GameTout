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
      {/* Card container */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-lg border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/30 group-hover:shadow-xl">
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Avatar Section */}
        <div className="relative flex flex-col items-center justify-center pt-3 sm:pt-6 md:pt-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <motion.img
              src={developer.avatar}
              alt={developer.name}
              className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"
              loading="lazy"
            />
            
            {/* Online status indicator */}
            {developer.status === "Open for Work" && (
              <div className="absolute bottom-0 right-0 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a] shadow-[0_0_10px_#22c55e]" />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="px-2 xs:px-3 sm:px-4 md:px-6 pt-1 xs:pt-2 sm:pt-3 md:pt-4 text-center">
          <h3 className="font-display text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-white truncate group-hover:text-[#FFAB00] transition-colors">
            {developer.name}
          </h3>
          
          <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 font-medium truncate">
            {developer.role}
          </p>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 text-[8px] xs:text-[10px] sm:text-xs text-gray-500 mt-0.5 xs:mt-1 sm:mt-2">
            <MapPin className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-none">{developer.location}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute bottom-10 xs:bottom-12 sm:bottom-14 left-1 right-1 xs:left-2 xs:right-2 flex justify-center gap-0.5 xs:gap-1">
          {developer.badges.slice(0, 2).map((badge, i) => (
            <span
              key={i}
              className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[10px] bg-white/10 px-1 py-0.5 rounded text-gray-300 truncate max-w-[50px] xs:max-w-[60px] sm:max-w-[70px]"
            >
              {badge}
            </span>
          ))}
          {developer.badges.length > 2 && (
            <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-[10px] text-gray-500">
              +{developer.badges.length - 2}
            </span>
          )}
        </div>

        {/* Social Link - ALWAYS VISIBLE */}
        <div className="absolute bottom-2 left-0 right-0 px-2 xs:px-3 sm:px-4">
          <div className="flex justify-center">
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-2 bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white rounded-lg border border-[#0077B5]/30 transition-all duration-300"
            >
              <Linkedin className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold uppercase tracking-wide hidden xs:inline">LinkedIn</span>
              <span className="xs:hidden text-[8px]">in</span>
            </motion.a>
          </div>
        </div>

        {/* Restricted overlay hint */}
        {isRestricted && (
          <div className="absolute top-1 right-1 xs:top-2 xs:right-2">
            <div className="flex items-center gap-0.5 px-1 py-0.5 xs:px-1.5 xs:py-1 bg-black/60 rounded-full border border-white/10">
              <Lock className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-gray-500" />
              <span className="text-[6px] xs:text-[7px] text-gray-500 uppercase hidden xs:inline">Limited</span>
            </div>
          </div>
        )}

        {/* Hover action indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-12 xs:pb-14 sm:pb-16 pointer-events-none rounded-lg"
        >
          <div className="flex items-center gap-1 text-white/80 text-[8px] xs:text-[10px] sm:text-xs font-medium">
            <Eye className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
            <span>View Profile</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BasicPortfolioCard;