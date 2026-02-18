import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Briefcase, Award, Zap, Crown, ChevronRight, Star } from "lucide-react";
import { Developer } from "@/types/portfolio";
import { FireBorderEffect } from "./FireBorderEffect";
import { SkillBar } from "./HealthBar";

interface PremiumPortfolioCardProps {
  developer: Developer;
  onClick: () => void;
}

export const PremiumPortfolioCard = ({
  developer,
  onClick,
}: PremiumPortfolioCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation - reduced for subtle effect
  const rotateX = useTransform(smoothMouseY, [0, 400], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [0, 400], [-5, 5]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(200);
    mouseY.set(200);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative cursor-pointer w-full h-full"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        <FireBorderEffect intensity="aggressive" color="gold" className="w-full h-full">
          {/* Main Card Content - Responsive */}
          <div className="relative w-full h-full bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] rounded-xl overflow-hidden">
            
            {/* Holographic shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(
                  135deg,
                  transparent 20%,
                  rgba(255, 171, 0, 0.1) 40%,
                  rgba(255, 215, 0, 0.15) 50%,
                  rgba(255, 171, 0, 0.1) 60%,
                  transparent 80%
                )`,
                backgroundSize: "200% 200%",
              }}
              animate={{
                backgroundPosition: isHovered 
                  ? ["0% 0%", "100% 100%", "0% 0%"]
                  : "0% 0%",
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Elite Badge - Smaller on mobile */}
            <div className="absolute top-2 left-2 xs:top-3 xs:left-3 sm:top-4 sm:left-4 z-30">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255, 171, 0, 0.5)",
                    "0 0 20px rgba(255, 171, 0, 0.8)",
                    "0 0 10px rgba(255, 171, 0, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#FFAB00] to-[#FFD700] rounded-full"
              >
                <Crown className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-4 sm:h-4 text-black" />
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-black text-black uppercase tracking-wider">Elite</span>
              </motion.div>
            </div>

            {/* Status Badge - Smaller on mobile */}
            <div className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 z-30">
              <div className={`flex items-center gap-1 px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-3 sm:py-1.5 rounded-full text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wide
                ${developer.status === "Open for Work" 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : developer.status === "Freelance"
                  ? "bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                <Zap className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden xs:inline">{developer.status}</span>
                <span className="xs:hidden">{developer.status === "Open for Work" ? "Open" : developer.status === "Freelance" ? "Free" : "Deployed"}</span>
              </div>
            </div>

            {/* Content - Compact on mobile */}
            <div className="relative z-20 h-full flex flex-col p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 pt-10 xs:pt-12 sm:pt-14 md:pt-16">
              
              {/* Badges Row - Hidden on very small screens */}
              <div className="hidden xs:flex gap-1 mb-2 sm:mb-4 md:mb-6 flex-wrap">
                {developer.badges.slice(0, 2).map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-1 px-1 py-0.5 xs:px-1.5 xs:py-1 bg-white/5 border border-white/10 rounded-md"
                  >
                    <Award className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-[#FFAB00]" />
                    <span className="text-[7px] xs:text-[8px] sm:text-[9px] text-gray-300 uppercase">{badge}</span>
                  </motion.div>
                ))}
              </div>

              {/* Avatar Section - Smaller on mobile */}
              <div className="flex flex-col items-center mb-2 xs:mb-3 sm:mb-4 md:mb-6">
                <div className="relative">
                  {/* Animated glow ring */}
                  <motion.div
                    className="absolute inset-[-4px] xs:inset-[-5px] sm:inset-[-6px] md:inset-[-8px] rounded-full"
                    style={{
                      background: "linear-gradient(45deg, #FFAB00, #FFD700, #FF6B00, #FFAB00)",
                      backgroundSize: "400% 400%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-[-2px] xs:inset-[-3px] sm:inset-[-4px] rounded-full bg-[#0a0a0a]"
                  />
                  
                  <motion.img
                    src={developer.avatar}
                    alt={developer.name}
                    className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-28 rounded-full object-cover border-2 border-[#FFAB00]"
                    whileHover={{ scale: 1.05 }}
                    loading="lazy"
                  />

                  {/* Verified star - Smaller on mobile */}
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 xs:-bottom-1 xs:-right-1 w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gradient-to-br from-[#FFAB00] to-[#FFD700] rounded-full flex items-center justify-center border-2 border-[#0a0a0a]"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-black" fill="black" />
                  </motion.div>
                </div>

                <h3 className="font-display text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white mt-2 xs:mt-2.5 sm:mt-3 md:mt-4 mb-0.5 text-center drop-shadow-[0_0_10px_rgba(255,171,0,0.3)] line-clamp-1">
                  {developer.name}
                </h3>
                <p className="text-[#FFAB00] font-bold text-[10px] xs:text-xs sm:text-sm uppercase tracking-widest">
                  {developer.role}
                </p>
              </div>

              {/* Stats Grid - Compact on mobile */}
              <div className="grid grid-cols-2 gap-1 xs:gap-2 sm:gap-3 md:gap-4 mb-2 xs:mb-3 sm:mb-4 md:mb-6 p-1 xs:p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-center border-r border-white/10">
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Loc</p>
                  <div className="flex items-center justify-center gap-0.5 text-white text-[10px] xs:text-xs sm:text-sm font-medium">
                    <MapPin className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 text-[#FFAB00] flex-shrink-0" />
                    <span className="truncate max-w-[50px] xs:max-w-[60px] sm:max-w-[80px]">{developer.location}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Exp</p>
                  <p className="text-white text-[10px] xs:text-xs sm:text-sm font-bold">{developer.exp}</p>
                </div>
              </div>

              {/* Skills - Hidden on mobile, shown on larger screens */}
              <div className="hidden sm:block flex-1 space-y-1 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
                {developer.skills.slice(0, 2).map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <SkillBar skill={skill.name} level={skill.level} />
                  </motion.div>
                ))}
              </div>

              {/* Mobile Skills - Compact pills */}
              <div className="sm:hidden flex-1 mb-1 xs:mb-2">
                <div className="flex flex-wrap gap-0.5 xs:gap-1 justify-center">
                  {developer.skills.slice(0, 3).map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-1 py-0.5 bg-[#FFAB00]/10 border border-[#FFAB00]/30 rounded text-[7px] xs:text-[8px] text-[#FFAB00]"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button - Smaller on mobile */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 bg-gradient-to-r from-[#FFAB00] to-[#FFD700] text-black font-bold uppercase text-[10px] xs:text-xs sm:text-sm tracking-wider rounded-lg flex items-center justify-center gap-1 shadow-[0_0_30px_rgba(255,171,0,0.3)] hover:shadow-[0_0_50px_rgba(255,171,0,0.5)] transition-shadow"
              >
                <Briefcase className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="hidden xs:inline">View</span>
                <span className="xs:hidden">→</span>
                <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>

            {/* Corner accents - Smaller on mobile */}
            <div className="absolute top-0 left-0 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 overflow-hidden pointer-events-none">
              <div className="absolute w-20 xs:w-24 sm:w-32 md:w-40 h-0.5 bg-gradient-to-r from-[#FFAB00] to-transparent transform -rotate-45 -translate-x-5 xs:-translate-x-6 sm:-translate-x-8 md:-translate-x-10 translate-y-4 xs:translate-y-5 sm:translate-y-6 md:translate-y-8" />
            </div>
            <div className="absolute bottom-0 right-0 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 overflow-hidden pointer-events-none">
              <div className="absolute w-20 xs:w-24 sm:w-32 md:w-40 h-0.5 bg-gradient-to-l from-[#FFAB00] to-transparent transform -rotate-45 translate-x-5 xs:translate-x-6 sm:translate-x-8 md:translate-x-10 -translate-y-4 xs:-translate-y-5 sm:-translate-y-6 md:-translate-y-8" />
            </div>
          </div>
        </FireBorderEffect>
      </motion.div>
    </motion.div>
  );
};

export default PremiumPortfolioCard;