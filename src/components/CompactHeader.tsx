import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { UserPlus, Radio, Cpu, Signal, Activity, Hexagon, Triangle, Circle, Zap } from "lucide-react";

// Rotating categories for the animated tagline
const rotatingCategories = [
  { text: "Game Developers", color: "#FFAB00", accent: "#FFD700" },
  { text: "Programmers", color: "#00FF88", accent: "#00FFAA" },
  { text: "3D Artists", color: "#FF6B6B", accent: "#FF8E8E" },
  { text: "Game Designers", color: "#00D4FF", accent: "#00E5FF" },
  { text: "Audio Engineers", color: "#A855F7", accent: "#C084FC" },
  { text: "Producers", color: "#F97316", accent: "#FB923C" },
];

// Optimized Particle System
const ParticleField = () => {
  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1,
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
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
            scale: [1, 1.5, 1],
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

// 3D Floating Geometric Shapes
const FloatingShapes = () => {
  const shapes = useMemo(() => [
    { Icon: Hexagon, x: 5, y: 20, size: 40, rotation: 45, delay: 0, color: "#FFAB00" },
    { Icon: Triangle, x: 90, y: 30, size: 30, rotation: -30, delay: 1, color: "#00D4FF" },
    { Icon: Circle, x: 85, y: 70, size: 20, rotation: 0, delay: 2, color: "#A855F7" },
    { Icon: Hexagon, x: 10, y: 80, size: 25, rotation: 60, delay: 0.5, color: "#00FF88" },
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
            perspective: "1000px",
          }}
          animate={{
            y: [0, -20, 0],
            rotateY: [0, 360],
            rotateX: [0, 15, 0],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: shape.delay },
            rotateY: { duration: 20, repeat: Infinity, ease: "linear", delay: shape.delay },
            rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: shape.delay },
          }}
        >
          <shape.Icon
            size={shape.size}
            className="opacity-20"
            style={{
              color: shape.color,
              filter: `drop-shadow(0 0 10px ${shape.color})`,
              transform: `rotate(${shape.rotation}deg)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Holographic Scanning Line
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] pointer-events-none"
    style={{
      background: "linear-gradient(90deg, transparent, #FFAB00, transparent)",
      boxShadow: "0 0 20px #FFAB00, 0 0 40px #FFAB00",
    }}
    animate={{ top: ["0%", "100%", "0%"] }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  />
);

// 3D Rotating Category Display
const Category3DDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingCategories.length);
        setIsFlipping(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = rotatingCategories[currentIndex];

  return (
    <div className="relative h-8 flex items-center" style={{ perspective: "1000px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ rotateX: -90, opacity: 0, y: 20 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 90, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Main Text */}
          <span
            className="font-bold text-lg md:text-xl uppercase tracking-wider"
            style={{
              color: current.color,
              textShadow: `0 0 20px ${current.color}, 0 0 40px ${current.color}50, 0 0 60px ${current.color}30`,
              filter: isFlipping ? "blur(2px)" : "none",
            }}
          >
            {current.text}
          </span>

          {/* 3D Depth Shadow */}
          <span
            className="absolute inset-0 font-bold text-lg md:text-xl uppercase tracking-wider"
            style={{
              color: "transparent",
              WebkitTextStroke: `1px ${current.color}30`,
              transform: "translateZ(-10px) translateY(2px)",
            }}
          >
            {current.text}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Blinking Cursor */}
      <motion.span
        className="ml-1 inline-block w-3 h-6 bg-current"
        style={{ color: current.color }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
};

// Holographic Badge Component
const HoloBadge = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ElementType }) => (
  <motion.div
    className="relative px-3 py-1.5 rounded-full overflow-hidden group cursor-default"
    whileHover={{ scale: 1.05 }}
    style={{
      background: "linear-gradient(135deg, rgba(255,171,0,0.1) 0%, rgba(255,171,0,0.05) 100%)",
      border: "1px solid rgba(255,171,0,0.3)",
    }}
  >
    {/* Holographic shimmer */}
    <motion.div
      className="absolute inset-0 opacity-30"
      style={{
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      }}
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
    />
    
    <div className="relative flex items-center gap-2">
      <Icon className="w-3 h-3 text-[#FFAB00]" />
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFAB00]">
        {children}
      </span>
    </div>
  </motion.div>
);

// Live Pulse Indicator
const LiveIndicator = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-full bg-green-500"
        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div className="relative w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
    </div>
    <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">Live Network</span>
  </div>
);

// 3D Title Component with Perspective
const Title3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-default select-none"
      style={{ perspective: "1000px" }}
    >
      <motion.h1
        className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-none"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Back layer - shadow */}
        <span
          className="absolute inset-0 text-transparent"
          style={{
            WebkitTextStroke: "1px rgba(255,171,0,0.2)",
            transform: "translateZ(-30px)",
          }}
        >
          Talent Network
        </span>

        {/* Middle layer - glow */}
        <span
          className="absolute inset-0 blur-sm opacity-50"
          style={{
            background: "linear-gradient(135deg, #FFAB00, #FFD700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: "translateZ(-15px)",
          }}
        >
          Talent Network
        </span>

        {/* Front layer - main text */}
        <span className="relative inline-block">
          <span className="text-white">Talent</span>
          <span
            className="ml-3 relative"
            style={{
              background: "linear-gradient(135deg, #FFAB00 0%, #FFD700 50%, #FFAB00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(255,171,0,0.5))",
            }}
          >
            Network
            {/* Shine effect */}
            <motion.span
              className="absolute inset-0 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #FFAB00 0%, #FFD700 50%, #FFAB00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <motion.span
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              />
            </motion.span>
          </span>
        </span>
      </motion.h1>
    </motion.div>
  );
};

// Stats Counter with 3D effect
const StatsCounter = ({ count, label }: { count: number; label: string }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
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
      className="relative px-4 py-2 rounded-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(255,171,0,0.2)" }}
    >
      <div className="flex items-center gap-3">
        <Zap className="w-4 h-4 text-[#FFAB00]" />
        <div>
          <div className="text-lg font-bold text-white font-mono">
            {displayCount.toLocaleString()}+
          </div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
        </div>
      </div>
    </motion.div>
  );
};

// CTA Button with 3D effect
const CTAButton3D = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ perspective: "1000px" }}
    >
      {/* Shadow layer */}
      <div
        className="absolute inset-0 rounded-lg bg-[#FFAB00] blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
        style={{ transform: "translateY(10px)" }}
      />

      {/* Button body */}
      <motion.div
        className="relative px-6 py-3 rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFAB00 0%, #FF8C00 50%, #FFAB00 100%)",
          boxShadow: "0 4px 15px rgba(255,171,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2)",
        }}
        whileHover={{
          boxShadow: "0 8px 25px rgba(255,171,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.2)",
        }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Content */}
        <span className="relative flex items-center gap-2 font-bold text-black uppercase text-sm tracking-wide">
          <UserPlus className="w-4 h-4" />
          Create Profile
        </span>
      </motion.div>
    </motion.button>
  );
};

// Demo Mode Toggle with 3D flip
const DemoToggle3D = ({ isDemoMode, onToggle }: { isDemoMode: boolean; onToggle: () => void }) => (
  <motion.button
    onClick={onToggle}
    className="relative w-16 h-8 rounded-full p-1"
    style={{
      background: isDemoMode 
        ? "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)"
        : "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
      boxShadow: isDemoMode
        ? "0 4px 15px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
        : "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
      animate={{ x: isDemoMode ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Radio className={`w-3 h-3 ${isDemoMode ? "text-purple-600" : "text-gray-600"}`} />
    </motion.div>
  </motion.button>
);

// Main Header Component
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
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto mb-4 z-10">
      {/* Background Effects Container */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(ellipse at 30% 0%, rgba(255,171,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 100%, rgba(168,85,247,0.1) 0%, transparent 50%)",
          }}
        />
        
        {/* Particle Field */}
        <ParticleField />
        
        {/* Floating Shapes */}
        <FloatingShapes />
        
        {/* Scan Line */}
        <ScanLine />
        
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,171,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,171,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content Container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(20,20,20,0.8) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <LiveIndicator />
            
            <div className="hidden md:flex items-center gap-2">
              <HoloBadge icon={Cpu}>Neural Link Active</HoloBadge>
              <HoloBadge icon={Signal}>{totalProfiles} Online</HoloBadge>
            </div>
          </div>

          {/* Demo Toggle - only show if enabled */}
          {showDemoToggle && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                {isDemoMode ? "Demo" : "Live"}
              </span>
              <DemoToggle3D isDemoMode={isDemoMode} onToggle={onToggleDemo} />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="px-6 py-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left Section */}
            <div className="space-y-3">
              {/* 3D Title */}
              <Title3D />

              {/* Animated Tagline */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Activity className="w-3 h-3 text-[#FFAB00]" />
                  <span className="text-xs font-mono text-gray-400">
                    {">"} The centralized mainframe of India's elite
                  </span>
                </div>
                <Category3DDisplay />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <StatsCounter count={totalProfiles} label="Active Talents" />
              </div>
              <CTAButton3D onClick={onCreateProfile} />
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, #FFAB00, #FFD700, #FFAB00, transparent)",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </section>
  );
};

export default CompactHeader;