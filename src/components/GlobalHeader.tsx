import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown, User, ShieldCheck } from "lucide-react";

// --- NAVIGATION LINKS ---
const navItems = [
  { path: "/", label: "Featured" },
  { path: "/reviews", label: "Reviews" },
  { path: "/documentary", label: "Docs" },
  { path: "/podcast", label: "Podcast" },
  { path: "/portfolios", label: "Portfolio" },
  { path: "/studios", label: "Studios" },
  { path: "/contact", label: "Contact" },
  { path: "/opinion", label: "Opinion" },
  { path: "/about", label: "About" },
];

interface GlobalHeaderProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
}

export const GlobalHeader = ({ onLoginClick, isAuthenticated }: GlobalHeaderProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* --- MAIN HEADER BAR (Fixed Top) --- */}
      {/* Increased height to h-24 to accommodate larger logo */}
      <header className="fixed top-0 left-0 right-0 h-24 z-50 px-6 md:px-12 flex items-center justify-between pointer-events-none">
        
        {/* 1. LEFT: LOGO (Pointer Auto) */}
        <div className="pointer-events-auto flex items-center gap-6">
            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-3 bg-black/80 border border-white/20 rounded-full text-white hover:text-[#FFAB00] transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo - NOW LARGER */}
            <Link to="/" className="flex flex-col group relative z-50">
                <h1 className="font-display text-3xl md:text-5xl font-bold uppercase text-white leading-none tracking-tighter group-hover:text-[#FFAB00] transition-colors drop-shadow-xl">
                Game<span className="text-[#FFAB00] group-hover:text-white transition-colors">Tout</span>
                </h1>
            </Link>
        </div>

        {/* 2. CENTER: DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex pointer-events-auto bg-black/90 backdrop-blur-xl border border-white/10 px-10 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="relative group/link">
                <span className={`text-xs font-bold font-mono uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-[#FFAB00]" : "text-gray-400 group-hover/link:text-white"
                }`}>
                  {item.label}
                </span>
                {isActive && <motion.div layoutId="nav-dot" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFAB00] rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* 3. RIGHT: AUTH BUTTON (Pointer Auto) - NOW LARGER */}
        <div className="pointer-events-auto">
            <button
            onClick={onLoginClick}
            className="group relative flex items-center gap-3 bg-black/90 backdrop-blur-md border border-white/20 pl-1.5 pr-6 py-1.5 rounded-full hover:border-[#FFAB00] hover:shadow-[0_0_20px_rgba(255,171,0,0.3)] transition-all duration-300"
            >
            {/* Larger Icon Circle */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${isAuthenticated ? "bg-[#FFAB00] border-transparent" : "bg-white/10 border-white/20 group-hover:border-[#FFAB00]"}`}>
                {isAuthenticated ? <ShieldCheck className="w-5 h-5 text-black" /> : <User className="w-5 h-5 text-white group-hover:text-[#FFAB00]" />}
            </div>
            
            {/* Larger Text */}
            <span className="hidden md:block font-display text-sm font-bold text-white uppercase leading-none tracking-wider group-hover:text-[#FFAB00] transition-colors">
                {isAuthenticated ? "OP_ONLINE" : "SIGN IN"}
            </span>
            </button>
        </div>
      </header>

      {/* --- MOBILE MENU DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col p-6 lg:hidden"
            >
                {/* Drawer Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <span className="font-display text-3xl text-white uppercase tracking-tight">Navigation</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-3 border border-white/20 rounded-full hover:bg-white/10 text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Drawer Links */}
                <div className="flex flex-col gap-6 overflow-y-auto flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="group flex items-center justify-between py-2"
                        >
                            <span className={`font-display text-4xl uppercase transition-colors ${
                                location.pathname === item.path ? "text-[#FFAB00]" : "text-gray-500 group-hover:text-white"
                            }`}>
                                {item.label}
                            </span>
                            <ChevronDown className="w-6 h-6 -rotate-90 text-gray-700 group-hover:text-[#FFAB00] transition-colors" />
                        </Link>
                    ))}
                </div>

                {/* Drawer Footer */}
                <div className="pt-6 border-t border-white/10">
                    <button 
                        onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                        className="w-full py-5 bg-[#FFAB00] text-black font-display text-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-colors"
                    >
                        {isAuthenticated ? <ShieldCheck className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        {isAuthenticated ? "Access Dossier" : "Operative Login"}
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};