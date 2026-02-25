import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search } from "lucide-react";

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  searchable?: boolean;
  icon?: React.ReactNode;
  className?: string;
  dropdownClassName?: string;
  openUpward?: boolean;
}

export const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchable = false,
  icon,
  className = "",
  dropdownClassName = "",
  openUpward = false,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable && searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-white/[0.04] border border-white/[0.06] text-white text-sm font-mono py-2.5 px-3 hover:border-[#FFAB00]/50 transition-colors flex items-center justify-between rounded-lg ${
          isOpen ? "border-[#FFAB00]/50 bg-white/[0.06]" : ""
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-[#FFAB00] flex-shrink-0">{icon}</span>}
          <span className={selectedOption ? "text-white" : "text-gray-500"}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm("");
              }}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute left-0 right-0 ${
                openUpward ? "bottom-full mb-2" : "top-full mt-2"
              } bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl z-50 overflow-hidden ${dropdownClassName}`}
              style={{
                boxShadow: openUpward
                  ? "0 -10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)"
                  : "0 10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)",
              }}
            >
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.06] rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 font-mono placeholder:text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Options list */}
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                        value === option.value
                          ? "bg-[#FFAB00]/20 text-[#FFAB00]"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <span className="truncate">{option.label}</span>
                      {value === option.value && (
                        <Check className="w-4 h-4 flex-shrink-0 ml-2" />
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No options found
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;