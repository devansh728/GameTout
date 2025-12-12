import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Unlock, X, Terminal, Fingerprint, Mail, Key, Github, Chrome, ChevronRight, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SecurityAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SecurityAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
}: SecurityAuthModalProps) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const sliderRef = useRef<HTMLDivElement>(null);

  // --- SLIDER LOGIC ---
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current || isUnlocked) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderValue(percentage);
    if (percentage >= 95) handleUnlock();
  };

  const handleUnlock = async () => {
    // Play unlock sound effect logic here if needed
    setIsUnlocked(true);
  };

  const handleMouseUp = () => {
    if (sliderValue < 95 && !isUnlocked) setSliderValue(0);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API Login Delay
    setTimeout(() => {
        onSuccess(); // Close modal and update state
        resetState();
    }, 1500);
  };

  const resetState = () => {
    setSliderValue(0);
    setIsUnlocked(false);
    setAuthMode("login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); resetState(); }}>
      <DialogContent className="bg-[#0a0a0a] border border-[#FFAB00]/30 text-white max-w-md p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Background Scanline Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        <DialogHeader className="p-6 bg-white/5 border-b border-white/10">
          <DialogTitle className="font-display text-2xl flex items-center gap-3 uppercase tracking-wider text-white">
            <Shield className="w-6 h-6 text-[#FFAB00]" />
            {isUnlocked ? "Operative Access" : "Security Clearance"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 relative z-10">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: SLIDE TO UNLOCK */}
            {!isUnlocked ? (
              <motion.div
                key="lock-screen"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Terminal Status */}
                <div className="p-4 rounded bg-black/50 border border-white/10 font-mono text-xs space-y-2">
                  <p className="text-green-500 flex items-center gap-2"><Terminal className="w-3 h-3" /> SYSTEM_READY</p>
                  <p className="text-gray-500">{">"} Biometric Scan Required...</p>
                  <p className="text-[#FFAB00] animate-pulse">{">"} Awaiting manual override</p>
                </div>

                {/* Big Lock Icon */}
                <div className="flex justify-center py-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#FFAB00] blur-xl opacity-20 animate-pulse" />
                    <Lock className="w-16 h-16 text-gray-500" />
                  </div>
                </div>

                {/* The Slider */}
                <div className="space-y-3">
                  <p className="text-center text-xs font-mono text-gray-400 uppercase tracking-[0.2em]">
                    Slide to Initialize
                  </p>
                  
                  <div
                    ref={sliderRef}
                    className="relative h-14 rounded-full bg-black border border-white/20 overflow-hidden cursor-pointer shadow-inner"
                    onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e.clientX)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                    onTouchEnd={handleMouseUp}
                  >
                    {/* Track Text */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <div className="flex gap-1">
                            {[1,2,3].map(i => <ChevronRight key={i} className="w-4 h-4 text-white animate-pulse" style={{ animationDelay: `${i * 0.2}s`}} />)}
                        </div>
                    </div>

                    {/* Progress Fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-[#FFAB00]/20 transition-all border-r border-[#FFAB00]/50"
                      style={{ width: `${sliderValue}%` }}
                    />
                    
                    {/* Slider Handle (FIXED VISIBILITY) */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FFAB00] flex items-center justify-center shadow-[0_0_15px_#FFAB00] z-20"
                      style={{ left: `calc(${sliderValue}% - 24px)` }}
                    >
                      <ArrowRight className="w-6 h-6 text-black" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (

              /* STAGE 2: LOGIN FORM */
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Tabs */}
                <div className="flex bg-black/40 p-1 rounded border border-white/10">
                    <button 
                        onClick={() => setAuthMode("login")}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${authMode === "login" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => setAuthMode("register")}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${authMode === "register" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase">Agent ID / Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <input 
                                type="email" 
                                placeholder="name@gametout.com"
                                className="w-full bg-black border border-white/20 p-2.5 pl-10 text-sm text-white focus:border-[#FFAB00] focus:outline-none rounded-sm transition-colors font-mono"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase">Security Key</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-black border border-white/20 p-2.5 pl-10 text-sm text-white focus:border-[#FFAB00] focus:outline-none rounded-sm transition-colors font-mono"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-white hover:bg-[#FFAB00] text-black font-bold uppercase py-3 tracking-widest transition-colors duration-200">
                        {authMode === "login" ? "Establish Link" : "Create Dossier"}
                    </button>
                </form>

                {/* Social Login */}
                <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <span className="relative bg-[#0a0a0a] px-2 text-[10px] text-gray-500 uppercase tracking-widest">
                        Or Connect Via Protocol
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 p-2 border border-white/10 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group">
                        <Chrome className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 p-2 border border-white/10 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group">
                        <Github className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase">GitHub</span>
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};