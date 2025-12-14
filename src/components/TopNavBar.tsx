import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { path: "/", label: "Featured" },
  { path: "/reviews", label: "Game Reviews" },
  { path: "/documentary", label: "Documentary" },
  { path: "/podcast", label: "Podcast" },
  { path: "/opinion", label: "Opinion" },
  { path: "/portfolios", label: "Portfolio" },
  { path: "/studios", label: "Companies" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

export const TopNavBar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* --- DESKTOP NAVIGATION (Hidden on Mobile) --- */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-20 items-center justify-center z-30 pointer-events-none">
        {/* We use pointer-events-none on container so clicks pass through to Hero, 
            but pointer-events-auto on the links themselves */}
        <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full mt-4 shadow-2xl flex gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative group"
              >
                <span className={`text-xs font-bold font-mono uppercase tracking-widest transition-colors ${
                    isActive ? "text-[#FFAB00]" : "text-gray-400 group-hover:text-white"
                }`}>
                  {item.label}
                </span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                    <motion.div 
                        layoutId="nav-indicator"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FFAB00] rounded-full"
                    />
                )}

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-[#FFAB00] opacity-0 group-hover:opacity-10 blur-lg transition-opacity" />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* --- MOBILE NAVIGATION (Hamburger) --- */}
      <div className="lg:hidden fixed top-4 right-20 z-50"> 
        {/* Positioned to the left of the Login Button (which is usually top-right) */}
        <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-black/80 border border-white/20 rounded text-white hover:text-[#FFAB00] transition-colors"
        >
            <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col p-8"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <span className="font-display text-2xl text-white uppercase">Menu</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 border border-white/20 rounded-full hover:bg-white/10 text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-6 overflow-y-auto">
                    {navItems.map((item, i) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="group flex items-center justify-between"
                        >
                            <span className={`font-display text-3xl uppercase transition-colors ${
                                location.pathname === item.path ? "text-[#FFAB00]" : "text-gray-500 group-hover:text-white"
                            }`}>
                                {item.label}
                            </span>
                            <ChevronDown className="w-5 h-5 -rotate-90 text-gray-700 group-hover:text-[#FFAB00] transition-colors" />
                        </Link>
                    ))}
                </div>

                {/* Footer Decor */}
                <div className="mt-auto pt-8 border-t border-white/10">
                    <p className="text-xs text-gray-600 font-mono text-center">GAMETOUT NETWORK // V 2.0</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};