import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface WantedStarsProps {
  level: number;
  maxLevel?: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export const WantedStars = ({
  level,
  maxLevel = 5,
  size = "md",
  animated = true,
}: WantedStarsProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLevel }).map((_, index) => {
        const isFilled = index < level;
        
        return (
          <motion.div
            key={index}
            initial={animated ? { scale: 0, rotate: -180 } : false}
            animate={animated ? { scale: 1, rotate: 0 } : false}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                isFilled
                  ? "fill-primary text-primary drop-shadow-[0_0_8px_hsl(43_100%_50%/0.6)]"
                  : "fill-muted/30 text-muted"
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
