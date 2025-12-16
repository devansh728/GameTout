import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Gamepad2, Cpu, Zap, Ghost, Crosshair } from "lucide-react";

interface EvervaultCardProps {
  children: React.ReactNode;
  className?: string;
}

export const EvervaultCard = ({ children, className = "" }: EvervaultCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    const str = "0123456789"; // Keep simpler binary for background texture
    setRandomString(str);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-white/10 bg-black flex items-center justify-center w-full h-full select-none overflow-hidden rounded-xl hover:border-[#FFAB00]/50 transition-colors duration-500 ${className}`}
      onMouseMove={onMouseMove}
    >
      <div className="relative h-full w-full">
        
        {/* GAMER PATTERN LAYER (The "Flicker") */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           <GamerPattern />
        </div>

        {/* MOUSE FOLLOW GRADIENT */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 171, 0, 0.15),
                transparent 80%
              )
            `,
          }}
        />
        
        {/* Content */}
        <div className="relative h-full w-full z-10">
            {children}
        </div>
      </div>
    </div>
  );
};

// THE NEW "GAMER FLICKER" COMPONENT
const GamerPattern = () => {
    // A mix of gaming icons
    const icons = [Gamepad2, Cpu, Zap, Ghost, Crosshair];
    
    // Create a 6x8 Grid (Adjust based on card size)
    const rows = 8;
    const cols = 6;

    return (
        <div className="w-full h-full grid grid-cols-6 gap-4 p-4 opacity-20 pointer-events-none">
            {Array.from({ length: rows * cols }).map((_, i) => {
                const Icon = icons[i % icons.length];
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0.1 }}
                        animate={{ opacity: [0.1, 0.8, 0.1] }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                        className="flex items-center justify-center"
                    >
                        <Icon className="w-6 h-6 text-[#FFAB00]" />
                    </motion.div>
                );
            })}
        </div>
    );
};