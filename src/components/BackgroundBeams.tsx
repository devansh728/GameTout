import { motion } from "framer-motion";

export const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Beam 1 */}
      <motion.div
        initial={{ x: "-100%", y: "-50%" }}
        animate={{ x: "200%", y: "150%" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear",
        }}
        className="absolute top-0 left-0 w-96 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rotate-45"
      />
      
      {/* Beam 2 */}
      <motion.div
        initial={{ x: "200%", y: "-100%" }}
        animate={{ x: "-100%", y: "200%" }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear",
          delay: 1,
        }}
        className="absolute top-0 right-0 w-[500px] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-45"
      />
      
      {/* Beam 3 */}
      <motion.div
        initial={{ x: "-50%", y: "-100%" }}
        animate={{ x: "150%", y: "200%" }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "linear",
          delay: 2,
        }}
        className="absolute top-0 left-1/4 w-72 h-0.5 bg-gradient-to-r from-transparent via-primary/25 to-transparent rotate-[30deg]"
      />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};
