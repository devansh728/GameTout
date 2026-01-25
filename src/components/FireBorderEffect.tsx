import { useRef, useEffect, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface FireBorderEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "aggressive";
  color?: "gold" | "orange" | "blue" | "purple";
}

// Fire color configurations
const colorConfig = {
  gold: {
    primary: "#FFAB00",
    secondary: "#FFD700",
    tertiary: "#FF6B00",
    glow: "rgba(255, 171, 0, 0.8)",
  },
  orange: {
    primary: "#FF6B00",
    secondary: "#FF8C00",
    tertiary: "#FF4500",
    glow: "rgba(255, 107, 0, 0.8)",
  },
  blue: {
    primary: "#00D4FF",
    secondary: "#0099FF",
    tertiary: "#0066CC",
    glow: "rgba(0, 212, 255, 0.8)",
  },
  purple: {
    primary: "#A855F7",
    secondary: "#C084FC",
    tertiary: "#7C3AED",
    glow: "rgba(168, 85, 247, 0.8)",
  },
};

const intensityConfig = {
  low: {
    particleCount: 30,
    speed: 1,
    size: { min: 2, max: 6 },
    opacity: 0.6,
  },
  medium: {
    particleCount: 50,
    speed: 1.5,
    size: { min: 3, max: 8 },
    opacity: 0.8,
  },
  aggressive: {
    particleCount: 80,
    speed: 2.5,
    size: { min: 4, max: 12 },
    opacity: 1,
  },
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  life: number;
  maxLife: number;
  edge: "top" | "right" | "bottom" | "left";
}

export const FireBorderEffect = ({
  children,
  className = "",
  intensity = "aggressive",
  color = "gold",
}: FireBorderEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const colors = colorConfig[color];
  const settings = intensityConfig[intensity];

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Create particle at random edge position
  const createParticle = (id: number): Particle => {
    const edge = ["top", "right", "bottom", "left"][Math.floor(Math.random() * 4)] as Particle["edge"];
    let x = 0, y = 0;
    
    switch (edge) {
      case "top":
        x = Math.random() * dimensions.width;
        y = 0;
        break;
      case "right":
        x = dimensions.width;
        y = Math.random() * dimensions.height;
        break;
      case "bottom":
        x = Math.random() * dimensions.width;
        y = dimensions.height;
        break;
      case "left":
        x = 0;
        y = Math.random() * dimensions.height;
        break;
    }

    const maxLife = 30 + Math.random() * 40;
    
    return {
      id,
      x,
      y,
      size: settings.size.min + Math.random() * (settings.size.max - settings.size.min),
      speedY: (edge === "top" ? -1 : edge === "bottom" ? 1 : (Math.random() - 0.5)) * settings.speed * 2,
      speedX: (edge === "left" ? -1 : edge === "right" ? 1 : (Math.random() - 0.5)) * settings.speed * 2,
      opacity: settings.opacity,
      life: maxLife,
      maxLife,
      edge,
    };
  };

  // Initialize particles
  useEffect(() => {
    if (dimensions.width === 0) return;
    
    particlesRef.current = Array.from({ length: settings.particleCount }, (_, i) => 
      createParticle(i)
    );
  }, [dimensions, settings.particleCount]);

  // Animation loop
  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || dimensions.width === 0) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    particlesRef.current.forEach((particle, index) => {
      // Update particle
      particle.y += particle.speedY;
      particle.x += particle.speedX;
      particle.life -= 1;

      // Respawn if dead
      if (particle.life <= 0) {
        particlesRef.current[index] = createParticle(particle.id);
        return;
      }

      // Calculate opacity based on life
      const lifeRatio = particle.life / particle.maxLife;
      const currentOpacity = lifeRatio * particle.opacity;

      // Draw flame particle with gradient
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      
      gradient.addColorStop(0, `${colors.secondary}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.4, `${colors.primary}${Math.floor(currentOpacity * 200).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.7, `${colors.tertiary}${Math.floor(currentOpacity * 150).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add glow effect for aggressive intensity
      if (intensity === "aggressive" && lifeRatio > 0.5) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors.glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5 * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.secondary}${Math.floor(currentOpacity * 100).toString(16).padStart(2, '0')}`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${colors.tertiary}, ${colors.primary}, ${colors.secondary}, ${colors.primary}, ${colors.tertiary})`,
            backgroundSize: "400% 400%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        
        {/* Inner cutout */}
        <div 
          className="absolute inset-[3px] rounded-lg bg-[#0a0a0a]"
          style={{
            boxShadow: `inset 0 0 30px ${colors.glow}`,
          }}
        />
      </div>

      {/* Fire particle canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ filter: "blur(0.5px)" }}
      />

      {/* Glow layers */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none z-0"
        style={{
          boxShadow: `
            0 0 20px ${colors.glow},
            0 0 40px ${colors.primary}80,
            0 0 60px ${colors.tertiary}40,
            inset 0 0 20px ${colors.glow}
          `,
        }}
      />

      {/* Pulsing outer glow */}
      <motion.div
        className="absolute inset-[-4px] rounded-xl pointer-events-none z-0"
        animate={{
          boxShadow: [
            `0 0 30px ${colors.primary}60, 0 0 60px ${colors.tertiary}30`,
            `0 0 50px ${colors.primary}80, 0 0 100px ${colors.tertiary}50`,
            `0 0 30px ${colors.primary}60, 0 0 60px ${colors.tertiary}30`,
          ],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default FireBorderEffect;
