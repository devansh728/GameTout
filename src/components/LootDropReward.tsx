import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Star, Sparkles, X } from "lucide-react";

interface LootDropRewardProps {
  onClaim?: (xp: number) => void;
}

export const LootDropReward = ({ onClaim }: LootDropRewardProps) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasTriggered) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / docHeight) * 100;

      if (scrollPercentage >= 90) {
        setHasTriggered(true);
        setIsTriggered(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasTriggered]);

  const handleOpen = async () => {
    setIsOpening(true);
    
    // Random XP between 10-100
    const xp = Math.floor(Math.random() * 91) + 10;
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setXpAwarded(xp);
    setIsRevealed(true);
    onClaim?.(xp);
  };

  const handleClose = () => {
    setIsTriggered(false);
    setIsOpening(false);
    setIsRevealed(false);
  };

  return (
    <AnimatePresence>
      {isTriggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Loot Box */}
          <motion.div
            initial={{ scale: 0, rotateY: 0 }}
            animate={{
              scale: isOpening ? [1, 1.2, 0] : 1,
              rotateY: isOpening ? 720 : 0,
            }}
            transition={{ duration: isOpening ? 1.5 : 0.5 }}
            className="relative"
          >
            {!isRevealed && (
              <>
                {/* Glow Effect */}
                <div className="absolute inset-0 w-48 h-48 rounded-xl blur-3xl bg-primary/30" />
                
                {/* Loot Box */}
                <motion.div
                  onClick={!isOpening ? handleOpen : undefined}
                  whileHover={!isOpening ? { scale: 1.05 } : {}}
                  whileTap={!isOpening ? { scale: 0.95 } : {}}
                  className={`relative w-48 h-48 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary flex items-center justify-center cursor-pointer ${
                    isOpening ? "pointer-events-none" : ""
                  }`}
                  style={{
                    boxShadow: "0 0 60px hsl(43 100% 50% / 0.3)",
                  }}
                >
                  {/* Sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      animate={{
                        y: [-20, -40, -20],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: i * 0.3,
                      }}
                      style={{
                        left: `${20 + i * 12}%`,
                        top: "10%",
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                    </motion.div>
                  ))}

                  <Gift className="w-20 h-20 text-primary" />
                </motion.div>

                {!isOpening && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-6 font-display text-lg text-primary"
                  >
                    TAP TO OPEN
                  </motion.p>
                )}
              </>
            )}
          </motion.div>

          {/* Revealed Reward */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-center"
              >
                {/* Stars Burst */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                      y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                    }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="absolute left-1/2 top-1/2"
                  >
                    <Star className="w-6 h-6 text-primary fill-primary" />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-4xl text-primary">LOOT DROP!</h2>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-8 h-8 text-primary fill-primary" />
                    <span className="font-display text-6xl text-foreground">
                      +{xpAwarded} XP
                    </span>
                    <Star className="w-8 h-8 text-primary fill-primary" />
                  </div>
                  <p className="text-muted-foreground">
                    Thanks for reading to the end!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="mt-4 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
                  >
                    CLAIM REWARD
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
