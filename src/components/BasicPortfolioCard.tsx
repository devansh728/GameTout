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
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="relative group cursor-pointer w-full h-full"
    >
      {/* Card container - Responsive Square shape with aspect ratio */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/30 group-hover:shadow-xl min-h-[200px] max-h-[320px]">
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Avatar Section */}
        <div className="relative flex flex-col items-center justify-center pt-6 sm:pt-8">
          {/* Avatar with subtle glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-150 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            <motion.img
              src={developer.avatar}
              alt={developer.name}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"
              loading="lazy"
            />
            
            {/* Online status indicator */}
            {developer.status === "Open for Work" && (
              <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a] shadow-[0_0_10px_#22c55e]" />
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="px-3 sm:px-6 pt-3 sm:pt-4 text-center">
          <h3 className="font-display text-base sm:text-xl text-white truncate mb-0.5 sm:mb-1 group-hover:text-[#FFAB00] transition-colors">
            {developer.name}
          </h3>
          
          <p className="text-xs sm:text-sm text-gray-400 font-medium mb-1 sm:mb-2 truncate">
            {developer.role}
          </p>

          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-4">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <span className="truncate">{developer.location}</span>
          </div>
        </div>

        {/* Social Link - Always Visible */}
        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 px-3 sm:px-6">
          <div className="flex justify-center">
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white rounded-lg border border-[#0077B5]/30 transition-all duration-300"
            >
              <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">LinkedIn</span>
            </motion.a>
          </div>
        </div>

        {/* Restricted overlay hint */}
        {isRestricted && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full border border-white/10">
              <Lock className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] text-gray-500 uppercase">Limited</span>
            </div>
          </div>
        )}

        {/* Hover action indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-20 pointer-events-none"
        >
          <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </div>
        </motion.div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-white/20 to-transparent transform rotate-45 translate-x-8 -translate-y-4" />
        </div>
      </div>
    </motion.div>
  );
};

export default BasicPortfolioCard;
