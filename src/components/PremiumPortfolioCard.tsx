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
          {/* Main Card Content - Responsive with aspect ratio */}
          <div className="relative w-full h-full min-h-[320px] sm:min-h-[400px] md:min-h-[450px] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] rounded-xl overflow-hidden">
            
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

            {/* Elite Badge */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-30">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(255, 171, 0, 0.5)",
                    "0 0 20px rgba(255, 171, 0, 0.8)",
                    "0 0 10px rgba(255, 171, 0, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#FFAB00] to-[#FFD700] rounded-full"
              >
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                <span className="text-[10px] sm:text-xs font-black text-black uppercase tracking-wider">Elite</span>
              </motion.div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30">
              <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide
                ${developer.status === "Open for Work" 
                  ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                  : developer.status === "Freelance"
                  ? "bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">{developer.status}</span>
                <span className="sm:hidden">{developer.status === "Open for Work" ? "Open" : developer.status}</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col p-4 sm:p-6 md:p-8 pt-14 sm:pt-16">
              
              {/* Badges Row - Hidden on very small screens */}
              <div className="hidden sm:flex gap-2 mb-4 md:mb-6 flex-wrap">
                {developer.badges.slice(0, 3).map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md"
                  >
                    <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFAB00]" />
                    <span className="text-[9px] sm:text-[10px] text-gray-300 uppercase">{badge}</span>
                  </motion.div>
                ))}
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-4 sm:mb-6">
                <div className="relative">
                  {/* Animated glow ring */}
                  <motion.div
                    className="absolute inset-[-6px] sm:inset-[-8px] rounded-full"
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
                    className="absolute inset-[-3px] sm:inset-[-4px] rounded-full bg-[#0a0a0a]"
                  />
                  
                  <motion.img
                    src={developer.avatar}
                    alt={developer.name}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-[#FFAB00]"
                    whileHover={{ scale: 1.05 }}
                    loading="lazy"
                  />

                  {/* Verified star */}
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#FFAB00] to-[#FFD700] rounded-full flex items-center justify-center border-2 border-[#0a0a0a]"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="black" />
                  </motion.div>
                </div>

                <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-white mt-3 sm:mt-4 mb-0.5 sm:mb-1 text-center drop-shadow-[0_0_10px_rgba(255,171,0,0.3)] line-clamp-1">
                  {developer.name}
                </h3>
                <p className="text-[#FFAB00] font-bold text-xs sm:text-sm uppercase tracking-widest">
                  {developer.role}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 p-2 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-center border-r border-white/10">
                  <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">Location</p>
                  <div className="flex items-center justify-center gap-1 text-white text-xs sm:text-sm font-medium">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFAB00] flex-shrink-0" />
                    <span className="truncate">{developer.location}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 sm:mb-1">Experience</p>
                  <p className="text-white text-xs sm:text-sm font-bold">{developer.exp}</p>
                </div>
              </div>

              {/* Skills - Hidden on mobile, shown on larger screens */}
              <div className="hidden sm:block flex-1 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {developer.skills.slice(0, 3).map((skill, idx) => (
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

              {/* Mobile Skills - Compact version */}
              <div className="sm:hidden flex-1 mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {developer.skills.slice(0, 4).map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 bg-[#FFAB00]/10 border border-[#FFAB00]/30 rounded text-[10px] text-[#FFAB00]"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#FFAB00] to-[#FFD700] text-black font-bold uppercase text-xs sm:text-sm tracking-wider rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_30px_rgba(255,171,0,0.3)] hover:shadow-[0_0_50px_rgba(255,171,0,0.5)] transition-shadow"
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">View Full Dossier</span>
                <span className="sm:hidden">View Profile</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden pointer-events-none">
              <div className="absolute w-32 sm:w-40 h-1 bg-gradient-to-r from-[#FFAB00] to-transparent transform -rotate-45 -translate-x-8 sm:-translate-x-10 translate-y-6 sm:translate-y-8" />
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden pointer-events-none">
              <div className="absolute w-32 sm:w-40 h-1 bg-gradient-to-l from-[#FFAB00] to-transparent transform -rotate-45 translate-x-8 sm:translate-x-10 -translate-y-6 sm:-translate-y-8" />
            </div>
          </div>
        </FireBorderEffect>
      </motion.div>
    </motion.div>
  );
};

export default PremiumPortfolioCard;
