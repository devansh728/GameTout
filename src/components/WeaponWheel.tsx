import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, BookOpen, Gamepad2, Scale, X } from "lucide-react";

interface WheelSection {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const sections: WheelSection[] = [
  { id: "story", label: "Story", icon: BookOpen, color: "from-blue-500 to-blue-600" },
  { id: "gameplay", label: "Gameplay", icon: Gamepad2, color: "from-green-500 to-green-600" },
  { id: "graphics", label: "Graphics", icon: Target, color: "from-purple-500 to-purple-600" },
  { id: "verdict", label: "Verdict", icon: Scale, color: "from-primary to-primary/80" },
];

interface WeaponWheelProps {
  onNavigate: (sectionId: string) => void;
}

export const WeaponWheel = ({ onNavigate }: WeaponWheelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleSelect = (sectionId: string) => {
    onNavigate(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 0 30px hsl(43 100% 50% / 0.4)" }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Target className="w-6 h-6" />}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Radial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <div className="relative w-64 h-64 -translate-x-1/2 translate-y-1/2">
              {sections.map((section, index) => {
                const angle = (index * 360) / sections.length - 90;
                const radius = 100;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const Icon = section.icon;

                return (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 1, x, y }}
                    exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => handleSelect(section.id)}
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br ${section.color} flex flex-col items-center justify-center text-foreground shadow-lg transition-transform hover:scale-110`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.button>
                );
              })}

              {/* Center Label */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <AnimatePresence mode="wait">
                  {hoveredSection && (
                    <motion.span
                      key={hoveredSection}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="font-display text-lg text-primary"
                    >
                      {sections.find((s) => s.id === hoveredSection)?.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
