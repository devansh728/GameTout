import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-full border border-border bg-background text-foreground hover:border-primary/50 transition-colors shadow-sm overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className="relative z-10 w-5 h-5">
        <motion.div
            initial={false}
            animate={{ 
                scale: theme === "dark" ? 0 : 1,
                rotate: theme === "dark" ? 90 : 0
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
        >
            <Sun className="w-5 h-5 text-orange-500" />
        </motion.div>
        
        <motion.div
            initial={false}
            animate={{ 
                scale: theme === "dark" ? 1 : 0,
                rotate: theme === "dark" ? 0 : -90
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
        >
            <Moon className="w-5 h-5 text-primary" />
        </motion.div>
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}