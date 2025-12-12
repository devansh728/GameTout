import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface EvervaultCardProps {
  children: React.ReactNode;
  className?: string;
}

export const EvervaultCard = ({ children, className = "" }: EvervaultCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`gaming-card relative overflow-hidden ${className}`}
    >
      {/* Matrix Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <MatrixRain mouseX={mousePosition.x} mouseY={mousePosition.y} />
        </div>
      )}
      
      {/* Radial Gradient Follow */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, hsl(43 100% 50% / 0.15), transparent)`,
        }}
      />
      
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
};

const MatrixRain = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
  const columns = 15;
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100 }}
          animate={{ y: "100%" }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
          className="absolute text-primary font-mono text-xs leading-none"
          style={{ left: `${(i / columns) * 100}%` }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="opacity-70">
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};
