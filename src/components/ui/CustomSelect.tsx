// components/ui/CustomSelect.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-2
          bg-[#0a0a0a] border border-white/20 p-3 rounded-sm
          text-left font-mono text-sm cursor-pointer
          transition-colors duration-200
          hover:border-white/40
          focus:border-[#FFAB00] focus:outline-none
          ${isOpen ? "border-[#FFAB00]" : ""}
        `}
      >
        <span className={selectedOption ? "text-white" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 py-1 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Decorative top line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFAB00]/50 to-transparent" />
            
            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between gap-2
                    px-3 py-2.5 text-left font-mono text-sm
                    transition-colors duration-100
                    ${
                      value === option.value
                        ? "bg-[#FFAB00]/20 text-[#FFAB00]"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-[#FFAB00]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};