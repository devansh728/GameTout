import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Loader2 } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => Promise<void> | void;
  showValue?: boolean;
  label?: string;
  isLoading?: boolean;
}

export const StarRating = ({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRate,
  showValue = false,
  label,
  isLoading = false,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeConfig = {
    sm: { star: "w-3 h-3", gap: "gap-0.5", text: "text-xs" },
    md: { star: "w-4 h-4", gap: "gap-1", text: "text-sm" },
    lg: { star: "w-6 h-6", gap: "gap-1.5", text: "text-base" },
  };

  const config = sizeConfig[size];
  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = useCallback(async (starIndex: number) => {
    if (!interactive || !onRate || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onRate(starIndex + 1);
    } finally {
      setIsSubmitting(false);
    }
  }, [interactive, onRate, isSubmitting]);

  const handleMouseEnter = useCallback((starIndex: number) => {
    if (interactive && !isSubmitting) {
      setHoverRating(starIndex + 1);
    }
  }, [interactive, isSubmitting]);

  const handleMouseLeave = useCallback(() => {
    setHoverRating(null);
  }, []);

  return (
    <div className="flex flex-col">
      {label && (
        <span className={`${config.text} text-muted-foreground mb-1`}>
          {label}
        </span>
      )}
      
      <div className={`flex items-center ${config.gap}`}>
        {/* Stars */}
        <div 
          className={`flex ${config.gap} ${interactive ? "cursor-pointer" : ""}`}
          onMouseLeave={handleMouseLeave}
        >
          {[...Array(maxStars)].map((_, i) => {
            const isFilled = i < displayRating;
            const isHovering = hoverRating !== null && i < hoverRating;
            
            return (
              <motion.button
                key={i}
                type="button"
                disabled={!interactive || isSubmitting}
                onClick={() => handleClick(i)}
                onMouseEnter={() => handleMouseEnter(i)}
                whileHover={interactive ? { scale: 1.2 } : {}}
                whileTap={interactive ? { scale: 0.9 } : {}}
                className={`
                  ${config.star} transition-colors duration-200 disabled:cursor-default
                  ${interactive && !isSubmitting ? "hover:opacity-100" : ""}
                `}
              >
                <Star
                  className={`
                    ${config.star} transition-all duration-200
                    ${isFilled || isHovering
                      ? "text-primary fill-primary drop-shadow-[0_0_8px_rgba(255,171,0,0.5)]"
                      : "text-muted-foreground/30"
                    }
                    ${isHovering && !isFilled ? "text-primary/70 fill-primary/70" : ""}
                  `}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Value display */}
        {showValue && (
          <span className={`${config.text} text-muted-foreground ml-2 font-mono`}>
            {rating.toFixed(1)}/{maxStars}
          </span>
        )}

        {/* Loading indicator */}
        <AnimatePresence>
          {(isLoading || isSubmitting) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-2"
            >
              <Loader2 className={`${config.star} text-primary animate-spin`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive hint */}
      {interactive && hoverRating !== null && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-primary mt-1 font-medium"
        >
          Rate {hoverRating} star{hoverRating > 1 ? "s" : ""}
        </motion.span>
      )}
    </div>
  );
};

/**
 * Compact star rating for cards
 */
export const CompactStarRating = ({
  rating,
  maxStars = 5,
  size = "sm",
}: {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md";
}) => {
  const sizeConfig = {
    sm: { star: "w-3 h-3", gap: "gap-0.5" },
    md: { star: "w-4 h-4", gap: "gap-0.5" },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex ${config.gap}`}>
      {[...Array(maxStars)].map((_, i) => (
        <Star
          key={i}
          className={`
            ${config.star}
            ${i < rating
              ? "text-primary fill-primary"
              : "text-muted-foreground/30"
            }
          `}
        />
      ))}
    </div>
  );
};

export default StarRating;
