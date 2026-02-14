import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { UserPlus, Radio, Cpu, Signal, Activity, Hexagon, Triangle, Circle, Zap, Users } from "lucide-react";

// Rotating categories for the animated tagline
const rotatingCategories = [
  { text: "Developers", color: "#FFAB00", accent: "#FFD700" },
  { text: "Programmers", color: "#00FF88", accent: "#00FFAA" },
  { text: "3D Artists", color: "#FF6B6B", accent: "#FF8E8E" },
  { text: "Designers", color: "#00D4FF", accent: "#00E5FF" },
  { text: "Engineers", color: "#A855F7", accent: "#C084FC" },
  { text: "2D Artists", color: "#F97316", accent: "#FB923C" },
  { text: "Producers", color: "#F97316", accent: "#FB923C" },
];

// Optimized Particle System
const ParticleField = () => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15 + 8,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.3 + 0.1,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#FFAB00]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 3D Floating Geometric Shapes - Simplified
const FloatingShapes = () => {
  const shapes = useMemo(() => [
    { Icon: Hexagon, x: 5, y: 20, size: 24, rotation: 45, delay: 0, color: "#FFAB00" },
    { Icon: Triangle, x: 90, y: 30, size: 18, rotation: -30, delay: 1, color: "#00D4FF" },
    { Icon: Circle, x: 85, y: 70, size: 12, rotation: 0, delay: 2, color: "#A855F7" },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: shape.delay },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        >
          <shape.Icon
            size={shape.size}
            className="opacity-15"
            style={{
              color: shape.color,
              filter: `drop-shadow(0 0 8px ${shape.color})`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// 3D Rotating Category Display - More Compact
const Category3DDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingCategories.length);
        setIsFlipping(false);
      }, 200);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const current = rotatingCategories[currentIndex];

  return (
    <div className="relative h-6 flex items-center" style={{ perspective: "800px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ rotateX: -90, opacity: 0, y: 10 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 90, opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <span
            className="font-bold text-sm md:text-base uppercase tracking-wider"
            style={{
              color: current.color,
              textShadow: `0 0 15px ${current.color}`,
              filter: isFlipping ? "blur(1px)" : "none",
            }}
          >
            {current.text}
          </span>
        </motion.div>
      </AnimatePresence>

      <motion.span
        className="ml-1 inline-block w-2 h-5 bg-current"
        style={{ color: current.color }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  );
};

// Mobile-friendly Stats Counter
const StatsCounter = ({ count, label }: { count: number; label: string }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = count / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <motion.div
      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-white/10"
      whileHover={{ scale: 1.02, borderColor: "#FFAB00" }}
    >
      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFAB00]" />
      <div className="flex items-baseline gap-1">
        <span className="text-xs sm:text-sm font-bold text-white font-mono">
          {displayCount.toLocaleString()}
        </span>
        <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wider hidden sm:inline">
          {label}
        </span>
        <span className="text-[8px] text-gray-400 uppercase tracking-wider sm:hidden">
          active
        </span>
      </div>
    </motion.div>
  );
};

// CTA Button - More Compact
const CTAButton3D = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group flex-shrink-0"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="relative px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFAB00 0%, #FF8C00 100%)",
          boxShadow: "0 2px 8px rgba(255,171,0,0.3)",
        }}
        whileHover={{
          boxShadow: "0 4px 12px rgba(255,171,0,0.5)",
        }}
      >
        <span className="relative flex items-center gap-1 sm:gap-1.5 font-bold text-black uppercase text-[10px] sm:text-xs tracking-wide">
          <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">Create</span>
          <span className="xs:hidden">+</span>
        </span>
      </motion.div>
    </motion.button>
  );
};

// Demo Mode Toggle - More Compact
const DemoToggle3D = ({ isDemoMode, onToggle }: { isDemoMode: boolean; onToggle: () => void }) => (
  <motion.button
    onClick={onToggle}
    className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider transition-all flex-shrink-0"
    style={{
      background: isDemoMode 
        ? "rgba(168,85,247,0.2)"
        : "rgba(255,255,255,0.05)",
      border: isDemoMode 
        ? "1px solid rgba(168,85,247,0.3)"
        : "1px solid rgba(255,255,255,0.1)",
      color: isDemoMode ? "#C084FC" : "#9CA3AF",
    }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Radio className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
    <span className="hidden xs:inline">{isDemoMode ? "DEMO" : "LIVE"}</span>
    <span className="xs:hidden">{isDemoMode ? "D" : "L"}</span>
  </motion.button>
);

// Scan Line - Subtler
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[1px] pointer-events-none"
    style={{
      background: "linear-gradient(90deg, transparent, #FFAB00, transparent)",
      opacity: 0.3,
    }}
    animate={{ top: ["0%", "100%", "0%"] }}
    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
  />
);

// Main Header Component - Fixed for Mobile
export const CompactHeader = ({
  onCreateProfile,
  isDemoMode,
  onToggleDemo,
  totalProfiles = 0,
  showDemoToggle = true,
}: {
  onCreateProfile: () => void;
  isDemoMode: boolean;
  onToggleDemo: () => void;
  totalProfiles?: number;
  showDemoToggle?: boolean;
}) => {
  return (
    <section className="relative px-2 sm:px-3 md:px-6 max-w-7xl mx-auto mb-2 sm:mb-3 z-10">
      {/* Background Effects - More Subtle */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg sm:rounded-xl">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 30% 0%, rgba(255,171,0,0.1) 0%, transparent 60%)",
          }}
        />
        <ParticleField />
        <FloatingShapes />
        <ScanLine />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,171,0,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,171,0,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Content Container - Reduced Padding */}
      <div
        className="relative rounded-lg sm:rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(20,20,20,0.9) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Main Content - Mobile Optimized Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-2 sm:py-2.5">
          {/* Left Section - Tagline - Fixed for Mobile */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
              <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFAB00] flex-shrink-0" />
              <span className="text-[10px] sm:text-xs md:text-sm font-mono text-gray-400 whitespace-nowrap">
                {">"}  The Hub of India's elite
              </span>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <Category3DDisplay />
            </div>
          </div>

          {/* Right Section - Stats + CTA */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Stats - Always Visible Now */}
            <StatsCounter count={totalProfiles} label="Active Talents" />
            
            {/* CTA Button */}
            <CTAButton3D onClick={onCreateProfile} />

            {/* Demo Toggle */}
            {showDemoToggle && (
              <DemoToggle3D isDemoMode={isDemoMode} onToggle={onToggleDemo} />
            )}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent, #FFAB00, transparent)",
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </section>
  );
};

export default CompactHeader;