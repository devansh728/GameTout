import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Focus, X, Eye } from "lucide-react";
import { HealthBar } from "@/components/HealthBar";

interface MissionBriefingModeProps {
  children: React.ReactNode;
  articleTitle?: string;
}

export const MissionBriefingMode = ({
  children,
  articleTitle = "Article",
}: MissionBriefingModeProps) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Focus Mode Toggle */}
      <motion.button
        onClick={() => setIsFocusMode(!isFocusMode)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          isFocusMode
            ? "bg-primary text-primary-foreground"
            : "glass border border-border"
        }`}
      >
        {isFocusMode ? (
          <>
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Exit Focus</span>
          </>
        ) : (
          <>
            <Focus className="w-4 h-4" />
            <span className="text-sm font-medium">Focus Mode</span>
          </>
        )}
      </motion.button>

      {/* Reading Progress Bar (Health Bar Style) */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="font-display text-sm">MISSION BRIEFING</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {Math.round(scrollProgress)}% Complete
                </span>
              </div>
              <div className="health-bar h-1.5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-destructive via-primary to-green-500"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dimmed Overlay for Focus Mode */}
      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className={`relative ${isFocusMode ? "z-30" : ""}`}>
        {children}
      </div>
    </>
  );
};
