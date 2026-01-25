import { motion } from "framer-motion";
import { Lock, Eye, Shield, Zap, Crown, Sparkles } from "lucide-react";
import { Developer } from "@/types/portfolio";

interface ClassifiedOverlayProps {
  developer: Developer;
  onUnlock: () => void;
  visibleFields?: ("skills" | "bio" | "stats" | "contact")[];
}

export const ClassifiedOverlay = ({
  developer,
  onUnlock,
  visibleFields = [],
}: ClassifiedOverlayProps) => {
  const isFieldHidden = (field: "skills" | "bio" | "stats" | "contact") => {
    return !visibleFields.includes(field);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md rounded-xl overflow-hidden"
    >
      {/* Scan lines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Top section - Always visible info */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <img
            src={developer.avatar}
            alt={developer.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <h3 className="font-display text-xl text-white">{developer.name}</h3>
            <p className="text-gray-400 text-sm">{developer.role}</p>
          </div>
        </div>
      </div>

      {/* Classified content section */}
      <div className="flex-1 p-6 relative">
        {/* Blurred/redacted areas */}
        <div className="space-y-4">
          {/* Skills section */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Skills & Expertise</span>
              {isFieldHidden("skills") && <Lock className="w-3 h-3 text-red-500" />}
            </div>
            <div className={`p-3 rounded-lg ${isFieldHidden("skills") ? "bg-white/5 backdrop-blur-lg" : "bg-transparent"}`}>
              {isFieldHidden("skills") ? (
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse w-2/3" />
                </div>
              ) : (
                <div className="space-y-2">
                  {developer.skills.map((skill, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-white">{skill.name}</span>
                      <span className="text-[#FFAB00]">{skill.level}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats section */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Experience & Rate</span>
              {isFieldHidden("stats") && <Lock className="w-3 h-3 text-red-500" />}
            </div>
            <div className={`p-3 rounded-lg ${isFieldHidden("stats") ? "bg-white/5 backdrop-blur-lg" : "bg-transparent"}`}>
              {isFieldHidden("stats") ? (
                <div className="flex gap-4">
                  <div className="h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse w-24" />
                  <div className="h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse w-24" />
                </div>
              ) : (
                <div className="flex gap-4 text-sm">
                  <div className="text-white">Experience: {developer.exp}</div>
                  <div className="text-white">Rate: {developer.rate || "N/A"}</div>
                </div>
              )}
            </div>
          </div>

          {/* Contact section */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Contact Details</span>
              {isFieldHidden("contact") && <Lock className="w-3 h-3 text-red-500" />}
            </div>
            <div className={`p-3 rounded-lg ${isFieldHidden("contact") ? "bg-white/5 backdrop-blur-lg" : "bg-transparent"}`}>
              {isFieldHidden("contact") ? (
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse w-48" />
                  <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse w-36" />
                </div>
              ) : (
                <div className="text-sm text-white">Contact info visible</div>
              )}
            </div>
          </div>
        </div>

        {/* Central lock icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FFAB00]/10 to-transparent flex items-center justify-center"
          >
            <Shield className="w-16 h-16 text-[#FFAB00]/30" />
          </motion.div>
        </div>
      </div>

      {/* Unlock CTA */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent border-t border-white/10">
        <div className="text-center mb-4">
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(255, 171, 0, 0.3)",
                "0 0 40px rgba(255, 171, 0, 0.5)",
                "0 0 20px rgba(255, 171, 0, 0.3)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-3"
          >
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Classified Intel</span>
          </motion.div>
          <p className="text-gray-400 text-sm mb-4">
            Upgrade to Elite Access to view full profile details
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUnlock}
          className="w-full py-4 bg-gradient-to-r from-[#FFAB00] to-[#FFD700] text-black font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,171,0,0.3)] hover:shadow-[0_0_50px_rgba(255,171,0,0.5)] transition-all"
        >
          <Crown className="w-5 h-5" />
          Unlock Elite Access
          <Sparkles className="w-5 h-5" />
        </motion.button>

        <p className="text-center text-gray-600 text-xs mt-3">
          One-time payment • Lifetime access to all profiles
        </p>
      </div>
    </motion.div>
  );
};

export default ClassifiedOverlay;
