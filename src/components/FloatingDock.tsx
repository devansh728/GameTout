import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { 
  Sparkles, 
  Film, 
  Star, 
  Users, 
  Building2, 
  MessageSquare,
  User,
  Menu,
  X
} from "lucide-react";

const navItems = [
  { path: "/", label: "Featured", icon: Sparkles },
  { path: "/about", label: "About", icon: User },
  { path: "/documentary", label: "Documentary", icon: Film },
  { path: "/reviews", label: "Reviews", icon: Star },
  { path: "/portfolios", label: "Portfolios", icon: Users },
  { path: "/studios", label: "Studios", icon: Building2 },
  { path: "/contact", label: "Contact", icon: MessageSquare },
];

export const FloatingDock = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Desktop Floating Dock */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-1">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: hoveredIndex === index ? 1.3 : 1,
                    y: hoveredIndex === index ? -8 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`dock-item ${isActive ? "active" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-card text-xs font-medium whitespace-nowrap border border-border"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile Bottom Sheet */}
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden glass-strong p-4 rounded-full"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-strong rounded-t-3xl p-6 pb-10"
          >
            <div className="grid grid-cols-3 gap-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
