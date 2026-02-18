import { useMemo } from "react";
import { motion } from "framer-motion";
import { Developer } from "@/types/portfolio";
import { BasicPortfolioCard } from "./BasicPortfolioCard";
import { PremiumPortfolioCard } from "./PremiumPortfolioCard";

interface MasonryGridProps {
  developers: Developer[];
  onSelectDev: (dev: Developer) => void;
  isRestricted?: boolean;
  onUnlockClick?: () => void;
}

/**
 * Responsive Masonry Grid Layout
 * 
 * Uses CSS Grid with auto-placement for a clean, responsive layout.
 * Premium cards are larger and more prominent.
 * Fully responsive with proper spacing on all devices.
 */
export const ResponsiveMasonryGrid = ({
  developers,
  onSelectDev,
  isRestricted = false,
  onUnlockClick,
}: MasonryGridProps) => {
  // Interleave premium and basic cards for visual variety
  const sortedDevelopers = useMemo(() => {
    const premium = developers.filter((d) => d.isPremium);
    const basic = developers.filter((d) => !d.isPremium);
    
    // Interleave: place premium cards at strategic intervals
    const result: Developer[] = [];
    let pIndex = 0;
    let bIndex = 0;
    let position = 0;
    
    while (pIndex < premium.length || bIndex < basic.length) {
      // Place premium at positions 0, 3, 7, 12, 18... (increasing intervals)
      const premiumPositions = [0, 3, 7, 12, 18, 25, 33];
      const shouldPlacePremium = premiumPositions.includes(position) && pIndex < premium.length;
      
      if (shouldPlacePremium) {
        result.push(premium[pIndex]);
        pIndex++;
      } else if (bIndex < basic.length) {
        result.push(basic[bIndex]);
        bIndex++;
      } else if (pIndex < premium.length) {
        result.push(premium[pIndex]);
        pIndex++;
      }
      position++;
    }
    
    return result;
  }, [developers]);

  if (developers.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* 
        Responsive Grid Layout - MORE COLUMNS ON MOBILE:
        - Mobile (< 640px): 2 columns (more cards visible)
        - Small (640-767px): 3 columns
        - Medium (768-1023px): 4 columns
        - Large (1024-1279px): 5 columns
        - XL (1280px+): 6 columns
      */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 auto-rows-auto">
        {sortedDevelopers.map((dev, index) => (
          <motion.div
            key={dev.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
            className={`
              ${dev.isPremium 
                ? "col-span-2 xs:col-span-2 sm:col-span-2 row-span-1 xs:row-span-2" 
                : "col-span-1 row-span-1"
              }
            `}
          >
            {dev.isPremium ? (
              <PremiumPortfolioCard
                developer={dev}
                onClick={() => onSelectDev(dev)}
              />
            ) : (
              <BasicPortfolioCard
                developer={dev}
                onClick={() => onSelectDev(dev)}
                isRestricted={isRestricted}
                onUnlockClick={onUnlockClick}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveMasonryGrid;