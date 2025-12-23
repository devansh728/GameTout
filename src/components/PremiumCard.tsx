import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Star, Gem, Zap, Shield } from "lucide-react";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  tier?: "elite" | "legendary" | "mythic" | "divine";
  enableParticles?: boolean;
  enable3D?: boolean;
  enableHolographic?: boolean;
}

// Tier configurations
const tierConfig = {
  elite: {
    primary: "#FFAB00",
    secondary: "#FFD700",
    tertiary: "#FFA000",
    icon: Crown,
    label: "ELITE",
    glowIntensity: 1,
  },
  legendary: {
    primary: "#FF6B00",
    secondary: "#FF8C00",
    tertiary: "#FF4500",
    icon: Star,
    label: "LEGENDARY",
    glowIntensity: 1.2,
  },
  mythic: {
    primary: "#A855F7",
    secondary: "#C084FC",
    tertiary: "#7C3AED",
    icon: Gem,
    label: "MYTHIC",
    glowIntensity: 1.4,
  },
  divine: {
    primary: "#06B6D4",
    secondary: "#22D3EE",
    tertiary: "#0891B2",
    icon: Shield,
    label: "DIVINE",
    glowIntensity: 1.6,
  },
};

export const PremiumCard = ({ 
  children, 
  className = "",
  tier = "elite",
  enableParticles = true,
  enable3D = true,
  enableHolographic = true
}: PremiumCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const config = tierConfig[tier];
  const TierIcon = config.icon;

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configurations for smooth 3D movement
  const springConfig = { stiffness: 150, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(smoothMouseY, [0, dimensions.height], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, dimensions.width], [-8, 8]);

  // Spotlight position
  const spotlightX = useTransform(smoothMouseX, [0, dimensions.width], [0, 100]);
  const spotlightY = useTransform(smoothMouseY, [0, dimensions.height], [0, 100]);

  // Update dimensions on mount and resize
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      };
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(dimensions.width / 2);
    mouseY.set(dimensions.height / 2);
  }, [mouseX, mouseY, dimensions]);

  // Dynamic spotlight gradient
  const spotlightGradient = useMotionTemplate`
    radial-gradient(
      600px circle at ${smoothMouseX}px ${smoothMouseY}px,
      ${config.primary}25,
      transparent 60%
    )
  `;

  // Holographic gradient
  const holographicGradient = useMotionTemplate`
    linear-gradient(
      ${useTransform(smoothMouseX, [0, dimensions.width], [0, 360])}deg,
      ${config.primary}20,
      ${config.secondary}20,
      ${config.tertiary}20,
      ${config.primary}20
    )
  `;

  return (
    <motion.div
      ref={containerRef}
      className={`group relative w-full h-full select-none rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D CONTAINER */}
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: enable3D && isHovered ? rotateX : 0,
          rotateY: enable3D && isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        {/* OUTER GLOW */}
        <motion.div
          className="absolute -inset-1 rounded-2xl blur-xl"
          style={{
            background: `linear-gradient(135deg, ${config.primary}, ${config.secondary}, ${config.tertiary})`,
          }}
          animate={{
            opacity: isHovered ? 0.6 * config.glowIntensity : 0.2,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* ANIMATED BORDER */}
        <AnimatedBorder 
          isHovered={isHovered} 
          config={config}
        />

        {/* MAIN CONTAINER */}
        <motion.div 
          className="relative h-full w-full bg-[#0a0a0a] rounded-2xl overflow-hidden"
          animate={{
            boxShadow: isHovered 
              ? `0 25px 50px -12px ${config.primary}40, 0 0 0 1px ${config.primary}60, inset 0 1px 0 ${config.secondary}30`
              : `0 10px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px ${config.primary}30, inset 0 1px 0 rgba(255,255,255,0.05)`
          }}
          transition={{ duration: 0.4 }}
        >
          
          {/* PREMIUM BADGE */}
          <PremiumBadge 
            config={config} 
            TierIcon={TierIcon} 
            isHovered={isHovered}
          />

          {/* CORNER ACCENTS */}
          <CornerAccents isHovered={isHovered} config={config} />

          {/* HOLOGRAPHIC LAYER */}
          {enableHolographic && (
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: holographicGradient }}
            />
          )}

          {/* GOLDEN PARTICLES */}
          {enableParticles && (
            <GoldenParticles isHovered={isHovered} config={config} />
          )}

          {/* SHINE EFFECT */}
          <ShineEffect isHovered={isHovered} config={config} />

          {/* SCAN LINES */}
          <ScanLines isHovered={isHovered} config={config} />

          {/* MOUSE SPOTLIGHT */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            style={{ background: spotlightGradient }}
          />

          {/* GRID OVERLAY */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(${config.primary}08 1px, transparent 1px), linear-gradient(90deg, ${config.primary}08 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
            animate={{ opacity: isHovered ? 0.5 : 0.1 }}
            transition={{ duration: 0.3 }}
          />

          {/* LIGHT RAYS */}
          <LightRays isHovered={isHovered} config={config} />

          {/* CONTENT */}
          <div className="relative h-full w-full z-20">
            {children}
          </div>

          {/* BOTTOM GLOW BAR */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 z-30"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.primary}, ${config.secondary}, ${config.primary}, transparent)`
            }}
            animate={{
              opacity: isHovered ? 1 : 0.3,
              boxShadow: isHovered ? `0 0 20px ${config.primary}, 0 0 40px ${config.primary}50` : 'none'
            }}
            transition={{ duration: 0.3 }}
          />

          {/* REFLECTION LAYER */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none z-10 rounded-2xl" />

        </motion.div>

        {/* 3D SHADOW */}
        <motion.div
          className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-2xl -z-10"
          style={{ background: config.primary }}
          animate={{
            opacity: isHovered ? 0.4 : 0.1,
            scale: isHovered ? 0.95 : 0.8,
            y: isHovered ? 10 : 0,
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
};

// ============================================
// ANIMATED BORDER COMPONENT
// ============================================
const AnimatedBorder = ({ isHovered, config }: { isHovered: boolean; config: typeof tierConfig.elite }) => {
  return (
    <>
      {/* Static gradient border */}
      <div 
        className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${config.primary}60, transparent 50%, ${config.secondary}60)`,
        }}
      />

      {/* Rotating conic gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ padding: 1 }}
      >
        <motion.div
          className="absolute inset-[-100%]"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${config.primary}, ${config.secondary}, transparent)`,
          }}
          animate={{
            rotate: isHovered ? 360 : 0,
          }}
          transition={{
            duration: 3,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Traveling light */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id={`borderGradient-${config.label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor={config.primary} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke={`url(#borderGradient-${config.label})`}
          strokeWidth="2"
          rx="16"
          ry="16"
          strokeDasharray="100 400"
          initial={{ strokeDashoffset: 500 }}
          animate={isHovered ? { strokeDashoffset: [500, 0] } : { strokeDashoffset: 500 }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
        />
      </svg>
    </>
  );
};

// ============================================
// PREMIUM BADGE COMPONENT
// ============================================
const PremiumBadge = ({ 
  config, 
  TierIcon, 
  isHovered 
}: { 
  config: typeof tierConfig.elite; 
  TierIcon: any;
  isHovered: boolean;
}) => {
  return (
    <motion.div 
      className="absolute top-0 left-0 z-30"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
    >
      <div className="relative">
        {/* Badge glow */}
        <motion.div
          className="absolute inset-0 blur-md rounded-br-xl"
          style={{ background: config.primary }}
          animate={{ opacity: isHovered ? 0.8 : 0.4 }}
        />
        
        {/* Main badge */}
        <motion.div 
          className="relative text-black text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-br-xl flex items-center gap-1.5 overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${config.primary}, ${config.secondary})`,
            boxShadow: `0 4px 15px ${config.primary}60`
          }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
            initial={{ x: "-200%" }}
            animate={isHovered ? { x: "200%" } : { x: "-200%" }}
            transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
          />
          
          {/* Icon with animation */}
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, -10, 10, 0] : 0,
              scale: isHovered ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <TierIcon className="w-3.5 h-3.5 fill-black relative z-10" />
          </motion.div>
          
          <span className="relative z-10">{config.label}</span>

          {/* Sparkle */}
          <motion.div
            className="absolute right-2 top-1"
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-2 h-2 text-black/50" />
          </motion.div>
        </motion.div>

        {/* Drip effect */}
        <motion.div
          className="absolute -bottom-2 left-4 w-1 h-2 rounded-full"
          style={{ background: config.primary }}
          animate={{
            height: isHovered ? [8, 16, 8] : 8,
            opacity: isHovered ? [0.8, 0.4, 0.8] : 0.5,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

// ============================================
// CORNER ACCENTS COMPONENT
// ============================================
const CornerAccents = ({ isHovered, config }: { isHovered: boolean; config: typeof tierConfig.elite }) => {
  const corners = useMemo(() => [
    { position: "top-3 right-3", rotation: 90 },
    { position: "bottom-3 right-3", rotation: 180 },
    { position: "bottom-3 left-3", rotation: 270 },
  ], []);

  return (
    <>
      {corners.map((corner, i) => (
        <motion.div
          key={i}
          className={`absolute ${corner.position} w-6 h-6 pointer-events-none z-20`}
          style={{ rotate: corner.rotation }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.3,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <div 
            className="w-full h-[2px] rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${config.primary}, transparent)`,
              boxShadow: isHovered ? `0 0 10px ${config.primary}` : 'none'
            }}
          />
          <div 
            className="w-[2px] h-full rounded-full absolute top-0 left-0"
            style={{ 
              background: `linear-gradient(180deg, ${config.primary}, transparent)`,
              boxShadow: isHovered ? `0 0 10px ${config.primary}` : 'none'
            }}
          />
        </motion.div>
      ))}
    </>
  );
};

// ============================================
// GOLDEN PARTICLES COMPONENT (Optimized)
// ============================================
const GoldenParticles = ({ isHovered, config }: { isHovered: boolean; config: typeof tierConfig.elite }) => {
  const particles = useMemo(() => 
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
      type: Math.random() > 0.7 ? 'star' : 'circle'
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(({ id, initialX, initialY, size, duration, delay, type }) => (
        <motion.div
          key={id}
          className="absolute"
          style={{
            left: `${initialX}%`,
            top: `${initialY}%`,
            width: size,
            height: size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={isHovered ? {
            y: [-20, -80],
            x: [0, (Math.random() - 0.5) * 40],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            rotate: type === 'star' ? [0, 180, 360] : 0,
          } : {
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration,
            delay,
            repeat: isHovered ? Infinity : 0,
            ease: "easeOut",
          }}
        >
          {type === 'star' ? (
            <Star 
              className="w-full h-full" 
              style={{ color: config.primary, filter: `drop-shadow(0 0 4px ${config.primary})` }}
              fill={config.primary}
            />
          ) : (
            <div 
              className="w-full h-full rounded-full"
              style={{ 
                background: `radial-gradient(circle, ${config.secondary}, ${config.primary})`,
                boxShadow: `0 0 ${size * 2}px ${config.primary}`
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Large floating orbs */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-20 h-20 rounded-full blur-2xl"
              style={{
                background: `radial-gradient(circle, ${config.primary}40, transparent)`,
                left: `${30 + i * 20}%`,
                top: "50%"
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

// ============================================
// SHINE EFFECT COMPONENT
// ============================================
const ShineEffect = ({ isHovered, config }: { isHovered: boolean; config: typeof tierConfig.elite }) => {
  return (
    <>
      {/* Main diagonal shine */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl"
      >
        <motion.div
          className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2"
          style={{
            background: `linear-gradient(
              45deg,
              transparent 40%,
              ${config.primary}15 45%,
              ${config.secondary}25 50%,
              ${config.primary}15 55%,
              transparent 60%
            )`,
          }}
          initial={{ x: "-100%", y: "-100%" }}
          animate={isHovered ? { x: "100%", y: "100%" } : { x: "-100%", y: "-100%" }}
          transition={{ 
            duration: 1.2, 
            repeat: isHovered ? Infinity : 0, 
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Vertical sweep */}
      <motion.div
        className="absolute top-0 bottom-0 w-[2px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent, ${config.primary}, transparent)`,
          boxShadow: `0 0 20px ${config.primary}`,
        }}
        initial={{ left: "-10%", opacity: 0 }}
        animate={isHovered ? { 
          left: ["0%", "100%"],
          opacity: [0, 1, 0]
        } : { left: "-10%", opacity: 0 }}
        transition={{ 
          duration: 1.5, 
          repeat: isHovered ? Infinity : 0, 
          repeatDelay: 3 
        }}
      />
    </>
  );
};

// ============================================
// SCAN LINES COMPONENT
// ============================================
const ScanLines = ({ isHovered, config }: { isHovered: boolean; config: typeof tierConfig.elite }) => {
  return (
    <>
      {/* Static scanlines */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${config.primary}05 2px,
            ${config.primary}05 4px
          )`,
        }}
        animate={{ opacity: isHovered ? 0.5 : 0.2 }}
      />

      {/* Moving scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.primary}80, transparent)`,
          boxShadow: `0 0 20px ${config.primary}`,
        }}
        initial={{ top: 0, opacity: 0 }}
        animate={isHovered ? {
          top: ["0%", "100%"],
          opacity: [0, 1, 0],
        } : { top: 0, opacity: 0 }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "linear",
        }}
      />
    </>
  );
};

// ============================================
// LIGHT RAYS COMPONENT
// ============================================
const LightRays = ({ isHovered, config }: { isHovered: boolean; config: typeof tierConfig.elite }) => {
  const rays = useMemo(() => [
    { angle: -30, delay: 0 },
    { angle: 0, delay: 0.2 },
    { angle: 30, delay: 0.4 },
  ], []);

  return (
    <AnimatePresence>
      {isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
          {rays.map((ray, i) => (
            <motion.div
              key={i}
              className="absolute top-0 left-1/2 w-[2px] h-full origin-top"
              style={{
                background: `linear-gradient(180deg, ${config.primary}40, transparent 60%)`,
                rotate: ray.angle,
                boxShadow: `0 0 30px ${config.primary}30`,
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.6, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.5, delay: ray.delay }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// PREMIUM CARD VARIANTS FOR EASY USE
// ============================================
export const EliteCard = (props: Omit<PremiumCardProps, 'tier'>) => (
  <PremiumCard {...props} tier="elite" />
);

export const LegendaryCard = (props: Omit<PremiumCardProps, 'tier'>) => (
  <PremiumCard {...props} tier="legendary" />
);

export const MythicCard = (props: Omit<PremiumCardProps, 'tier'>) => (
  <PremiumCard {...props} tier="mythic" />
);

export const DivineCard = (props: Omit<PremiumCardProps, 'tier'>) => (
  <PremiumCard {...props} tier="divine" />
);

export default PremiumCard;