import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// Animation variant options
type AnimationType = "decode" | "flip" | "wave" | "typewriter" | "split" | "magnetic";

interface HeroTaglineProps {
  phrase: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const HeroTagline = ({ 
  phrase, 
  size = "md",
  className = "" 
}: HeroTaglineProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Size mappings
  const sizeClasses = {
    sm: "py-8 text-2xl sm:text-3xl md:text-4xl",
    md: "py-12 text-3xl sm:text-4xl md:text-5xl",
    lg: "py-16 text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`w-full flex flex-col justify-center items-center ${sizeClasses[size]} bg-[#0a0a0a] overflow-hidden relative z-30 group ${className}`}
    >
      {/* Ambient Background Effects */}
      <BackgroundEffects isHovered={isHovered} />

      {/* Main Content */}
      <div className="relative text-center px-4">
        
        {/* Decode Text - Static, only hover effect */}
        <DecodeText 
          text={phrase}
          isHovered={isHovered}
          mouseX={mouseX}
          mouseY={mouseY}
        />

        {/* Animated Underline */}
        <motion.div 
          className="mt-4 mx-auto h-0.5 bg-gradient-to-r from-transparent via-[#FFAB00] to-transparent relative overflow-hidden"
          initial={{ width: "20%" }}
          animate={{ 
            width: isHovered ? "60%" : "30%",
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// ============================================
// DECODE TEXT ANIMATION - STATIC VERSION
// ============================================
const DecodeText = ({ 
  text, 
  isHovered,
  mouseX,
  mouseY
}: { 
  text: string; 
  isHovered: boolean;
  mouseX: any;
  mouseY: any;
}) => {
  // Split text into words
  const words = useMemo(() => text.split(" "), [text]);
  
  return (
    <h2 className="font-display font-black uppercase tracking-wider text-center select-none relative leading-tight">
      {words.map((word, wordIndex) => (
        <span key={`${text}-${wordIndex}`} className="inline-block whitespace-nowrap mx-1 sm:mx-2">
          {word.split("").map((char, charIndex) => (
            <DecodeCharacter
              key={`${word}-${charIndex}`}
              char={char}
              index={wordIndex * 10 + charIndex}
              total={words.reduce((acc, w) => acc + w.length, 0)}
              isHovered={isHovered}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}
        </span>
      ))}
    </h2>
  );
};

// ============================================
// INDIVIDUAL CHARACTER WITH MAGNETIC EFFECT
// ============================================
const DecodeCharacter = ({ 
  char, 
  index, 
  total,
  isHovered,
  mouseX,
  mouseY
}: { 
  char: string; 
  index: number;
  total: number;
  isHovered: boolean;
  mouseX: any;
  mouseY: any;
}) => {
  const charRef = useRef<HTMLSpanElement>(null);
  
  // Magnetic effect - characters slightly attracted to cursor
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const rotateZ = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  // Update magnetic effect based on mouse position
  useEffect(() => {
    if (!isHovered || !charRef.current) {
      x.set(0);
      y.set(0);
      rotateZ.set(0);
      scale.set(1);
      return;
    }

    const unsubX = mouseX.on("change", (latestX: number) => {
      const rect = charRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const containerRect = charRef.current?.parentElement?.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      const relativeMouseX = latestX;
      const relativeCharX = rect.left + rect.width / 2 - containerRect.left - containerRect.width / 2;
      
      const distance = Math.abs(relativeMouseX - relativeCharX);
      const maxDistance = 200;
      const strength = Math.max(0, 1 - distance / maxDistance);
      
      x.set((relativeMouseX - relativeCharX) * strength * 0.15);
      rotateZ.set((relativeMouseX - relativeCharX) * strength * 0.1);
      scale.set(1 + strength * 0.2);
    });

    const unsubY = mouseY.on("change", (latestY: number) => {
      const rect = charRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const containerRect = charRef.current?.parentElement?.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      
      const relativeMouseY = latestY;
      const relativeCharY = rect.top + rect.height / 2 - containerRect.top - containerRect.height / 2;
      
      const distance = Math.abs(relativeMouseY - relativeCharY);
      const maxDistance = 150;
      const strength = Math.max(0, 1 - distance / maxDistance);
      
      y.set((relativeMouseY - relativeCharY) * strength * 0.15);
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [isHovered, mouseX, mouseY, x, y, rotateZ, scale]);

  if (char === " ") {
    return <span className="inline-block w-3 md:w-4">&nbsp;</span>;
  }

  return (
    <motion.span
      ref={charRef}
      className="inline-block relative"
      style={{ x, y, rotateZ, scale }}
    >
      {/* Main character */}
      <motion.span
        className="inline-block relative z-10 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          textShadow: isHovered 
            ? "0 0 10px rgba(255,171,0,0.3)"
            : "none"
        }}
        transition={{ 
          duration: 0.5,
          delay: index * 0.02,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{
          scale: 1.2,
          color: "#FFAB00",
          textShadow: "0 0 30px rgba(255,171,0,0.8)",
        }}
      >
        {char}
      </motion.span>

      {/* Character glow effect on hover */}
      {isHovered && (
        <motion.span
          className="absolute inset-0 z-0 text-[#FFAB00] blur-sm opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
        >
          {char}
        </motion.span>
      )}
    </motion.span>
  );
};

// ============================================
// BACKGROUND EFFECTS - SIMPLIFIED
// ============================================
const BackgroundEffects = ({ isHovered }: { isHovered: boolean }) => {
  return (
    <>
      {/* Grid pattern */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,171,0,0.03) 1px, transparent 1px),
            linear-gradient(rgba(255,171,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
        animate={{ 
          opacity: isHovered ? 0.4 : 0.15,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,171,0,0.05) 0%, transparent 50%)"
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.8 : 0.4
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Subtle floating particles on hover */}
      <FloatingParticles isActive={isHovered} />
    </>
  );
};

// ============================================
// FLOATING PARTICLES - SIMPLIFIED
// ============================================
const FloatingParticles = ({ isActive }: { isActive: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(({ id, initialX, initialY, size, duration, delay }) => (
        <motion.div
          key={id}
          className="absolute rounded-full"
          style={{
            left: `${initialX}%`,
            top: `${initialY}%`,
            width: size,
            height: size,
            background: "#FFAB00",
            boxShadow: `0 0 ${size * 2}px #FFAB00`
          }}
          initial={{ opacity: 0 }}
          animate={isActive ? {
            opacity: [0, 0.4, 0],
            y: [0, -30, -60],
            x: [0, Math.sin(id) * 10, Math.sin(id) * 20]
          } : {
            opacity: 0
          }}
          transition={{
            duration,
            delay,
            repeat: isActive ? Infinity : 0,
            repeatDelay: 1
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// SIMPLE STATIC VERSION (if you want even more minimal)
// ============================================
export const SimpleTagline = ({ 
  phrase, 
  size = "md",
  className = "" 
}: HeroTaglineProps) => {
  const sizeClasses = {
    sm: "py-6 text-xl sm:text-2xl md:text-3xl",
    md: "py-8 text-2xl sm:text-3xl md:text-4xl",
    lg: "py-10 text-3xl sm:text-4xl md:text-5xl"
  };

  return (
    <div className={`w-full flex flex-col justify-center items-center ${sizeClasses[size]} bg-[#0a0a0a] overflow-hidden relative ${className}`}>
      {/* Simple grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,171,0,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,171,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      <h2 className="font-display font-black uppercase tracking-wider text-center text-white relative z-10">
        {phrase}
      </h2>
      
      {/* Simple underline */}
      <div className="mt-2 w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FFAB00] to-transparent" />
    </div>
  );
};

export default HeroTagline;






// import { useState, useEffect, useRef, useMemo } from "react";
// import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

// const phrases = [
//   // "Are you making video games?",
//   // "Register Your Studio for Free",
//   // "Are you looking for work?",
//   "Create your free portfolio"
// ];

// // Animation variant options
// type AnimationType = "decode" | "flip" | "wave" | "typewriter" | "split" | "magnetic";

// export const HeroTagline = () => {
//   const [index, setIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   const currentPhrase = phrases[index];
//   const nextPhrase = phrases[(index + 1) % phrases.length];

//   // Automatic cycle
//   useEffect(() => {
//     const interval = setInterval(() => {
//       triggerAnimation();
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const triggerAnimation = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setIndex((prev) => (prev + 1) % phrases.length);
//       setTimeout(() => setIsAnimating(false), 800);
//     }, 600);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     mouseX.set(e.clientX - rect.left - rect.width / 2);
//     mouseY.set(e.clientY - rect.top - rect.height / 2);
//   };

//   return (
//     <div 
//       ref={containerRef}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onMouseMove={handleMouseMove}
//       onClick={triggerAnimation}
//       className="w-full flex flex-col justify-center items-center py-16 bg-[#0a0a0a] overflow-hidden relative z-30 cursor-pointer group"
//     >
//       {/* Ambient Background Effects */}
//       <BackgroundEffects isHovered={isHovered} isAnimating={isAnimating} />

//       {/* Main Content */}
//       <div className="relative text-center px-4">
        
//         {/* Decode Animation (Primary) */}
//         <DecodeText 
//           text={currentPhrase}
//           isAnimating={isAnimating}
//           isHovered={isHovered}
//           mouseX={mouseX}
//           mouseY={mouseY}
//         />

//         {/* Animated Underline */}
//         <motion.div 
//           className="mt-8 mx-auto h-1 bg-gradient-to-r from-transparent via-[#FFAB00] to-transparent relative overflow-hidden"
//           initial={{ width: "20%" }}
//           animate={{ 
//             width: isAnimating ? "80%" : isHovered ? "60%" : "30%",
//           }}
//           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
//         >
//           {/* Shimmer effect */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
//             animate={{ x: ["-100%", "100%"] }}
//             transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
//           />
//         </motion.div>

//         {/* Phrase indicator dots */}
//         <div className="flex justify-center gap-2 mt-6">
//           {phrases.map((_, i) => (
//             <motion.button
//               key={i}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (i !== index) {
//                   setIsAnimating(true);
//                   setTimeout(() => {
//                     setIndex(i);
//                     setTimeout(() => setIsAnimating(false), 800);
//                   }, 600);
//                 }
//               }}
//               className="relative w-2 h-2 rounded-full"
//               whileHover={{ scale: 1.5 }}
//               whileTap={{ scale: 0.9 }}
//             >
//               <motion.div
//                 className="absolute inset-0 rounded-full"
//                 animate={{
//                   backgroundColor: i === index ? "#FFAB00" : "rgba(255,255,255,0.2)",
//                   boxShadow: i === index ? "0 0 10px #FFAB00" : "none",
//                 }}
//                 transition={{ duration: 0.3 }}
//               />
//               {i === index && (
//                 <motion.div
//                   className="absolute inset-0 rounded-full border border-[#FFAB00]"
//                   initial={{ scale: 1, opacity: 1 }}
//                   animate={{ scale: 2, opacity: 0 }}
//                   transition={{ duration: 1, repeat: Infinity }}
//                 />
//               )}
//             </motion.button>
//           ))}
//         </div>
//       </div>

//       {/* Click hint */}
//       <motion.div
//         className="absolute bottom-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest"
//         animate={{ opacity: [0.3, 0.6, 0.3] }}
//         transition={{ duration: 2, repeat: Infinity }}
//       >
//         Click to shuffle
//       </motion.div>
//     </div>
//   );
// };

// // ============================================
// // DECODE TEXT ANIMATION
// // ============================================
// // ============================================
// // DECODE TEXT ANIMATION - FIXED FOR MOBILE
// // ============================================
// const DecodeText = ({ 
//   text, 
//   isAnimating, 
//   isHovered,
//   mouseX,
//   mouseY
// }: { 
//   text: string; 
//   isAnimating: boolean;
//   isHovered: boolean;
//   mouseX: any;
//   mouseY: any;
// }) => {
//   // Split text into words instead of characters
//   const words = useMemo(() => text.split(" "), [text]);
  
//   return (
//     <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-center select-none relative leading-tight">
//       {words.map((word, wordIndex) => (
//         <span key={`${text}-${wordIndex}`} className="inline-block whitespace-nowrap mx-1 sm:mx-2">
//           {word.split("").map((char, charIndex) => (
//             <DecodeCharacter
//               key={`${word}-${charIndex}`}
//               char={char}
//               index={wordIndex * 10 + charIndex} // Keep unique index
//               total={words.reduce((acc, w) => acc + w.length, 0)}
//               isAnimating={isAnimating}
//               isHovered={isHovered}
//               mouseX={mouseX}
//               mouseY={mouseY}
//             />
//           ))}
//         </span>
//       ))}
//     </h2>
//   );
// };

// // ============================================
// // INDIVIDUAL CHARACTER WITH DECODE + MAGNETIC
// // ============================================
// const DecodeCharacter = ({ 
//   char, 
//   index, 
//   total,
//   isAnimating,
//   isHovered,
//   mouseX,
//   mouseY
// }: { 
//   char: string; 
//   index: number;
//   total: number;
//   isAnimating: boolean;
//   isHovered: boolean;
//   mouseX: any;
//   mouseY: any;
// }) => {
//   const [displayChar, setDisplayChar] = useState(char);
//   const [isDecoding, setIsDecoding] = useState(false);
//   const charRef = useRef<HTMLSpanElement>(null);
  
//   const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  
//   // Magnetic effect - characters slightly attracted to cursor
//   const springConfig = { stiffness: 150, damping: 15 };
//   const x = useSpring(0, springConfig);
//   const y = useSpring(0, springConfig);
//   const rotateZ = useSpring(0, springConfig);
//   const scale = useSpring(1, springConfig);

//   // Update magnetic effect based on mouse position
//   useEffect(() => {
//     if (!isHovered || !charRef.current) {
//       x.set(0);
//       y.set(0);
//       rotateZ.set(0);
//       scale.set(1);
//       return;
//     }

//     const unsubX = mouseX.on("change", (latestX: number) => {
//       const rect = charRef.current?.getBoundingClientRect();
//       if (!rect) return;
      
//       const charCenterX = rect.left + rect.width / 2;
//       const containerRect = charRef.current?.parentElement?.parentElement?.getBoundingClientRect();
//       if (!containerRect) return;
      
//       const relativeMouseX = latestX;
//       const relativeCharX = charCenterX - containerRect.left - containerRect.width / 2;
      
//       const distance = Math.abs(relativeMouseX - relativeCharX);
//       const maxDistance = 200;
//       const strength = Math.max(0, 1 - distance / maxDistance);
      
//       x.set((relativeMouseX - relativeCharX) * strength * 0.15);
//       rotateZ.set((relativeMouseX - relativeCharX) * strength * 0.1);
//       scale.set(1 + strength * 0.2);
//     });

//     const unsubY = mouseY.on("change", (latestY: number) => {
//       const rect = charRef.current?.getBoundingClientRect();
//       if (!rect) return;
      
//       const charCenterY = rect.top + rect.height / 2;
//       const containerRect = charRef.current?.parentElement?.parentElement?.getBoundingClientRect();
//       if (!containerRect) return;
      
//       const relativeMouseY = latestY;
//       const relativeCharY = charCenterY - containerRect.top - containerRect.height / 2;
      
//       const distance = Math.abs(relativeMouseY - relativeCharY);
//       const maxDistance = 150;
//       const strength = Math.max(0, 1 - distance / maxDistance);
      
//       y.set((relativeMouseY - relativeCharY) * strength * 0.15);
//     });

//     return () => {
//       unsubX();
//       unsubY();
//     };
//   }, [isHovered, mouseX, mouseY, x, y, rotateZ, scale]);

//   // Decode animation on text change
//   useEffect(() => {
//     if (isAnimating && char !== " ") {
//       setIsDecoding(true);
//       const delay = index * 30; // Stagger effect
//       const duration = 400 + Math.random() * 300;
      
//       const startTime = Date.now();
//       const interval = setInterval(() => {
//         const elapsed = Date.now() - startTime - delay;
        
//         if (elapsed < 0) {
//           setDisplayChar(scrambleChars[Math.floor(Math.random() * scrambleChars.length)]);
//         } else if (elapsed < duration) {
//           // Gradually settle to final character
//           if (Math.random() < elapsed / duration) {
//             setDisplayChar(char);
//           } else {
//             setDisplayChar(scrambleChars[Math.floor(Math.random() * scrambleChars.length)]);
//           }
//         } else {
//           setDisplayChar(char);
//           setIsDecoding(false);
//           clearInterval(interval);
//         }
//       }, 50);

//       return () => clearInterval(interval);
//     } else {
//       setDisplayChar(char);
//     }
//   }, [char, isAnimating, index]);

//   if (char === " ") {
//     return <span className="inline-block w-4 md:w-6">&nbsp;</span>;
//   }

//   // Calculate color based on position for gradient effect
//   const hue = (index / total) * 30; // Slight hue variation
  
//   return (
//     <motion.span
//       ref={charRef}
//       className="inline-block relative"
//       style={{ x, y, rotateZ, scale }}
//     >
//       {/* Main character */}
//       <motion.span
//         className="inline-block relative z-10"
//         initial={{ opacity: 0, y: 20, rotateX: -90 }}
//         animate={{ 
//           opacity: 1, 
//           y: 0, 
//           rotateX: 0,
//           color: isDecoding ? "#FFAB00" : "white",
//           textShadow: isDecoding 
//             ? "0 0 20px rgba(255,171,0,0.8), 0 0 40px rgba(255,171,0,0.4)" 
//             : isHovered 
//               ? "0 0 10px rgba(255,171,0,0.3)"
//               : "none"
//         }}
//         transition={{ 
//           duration: 0.5,
//           delay: index * 0.02,
//           type: "spring",
//           stiffness: 200
//         }}
//         whileHover={{
//           scale: 1.2,
//           color: "#FFAB00",
//           textShadow: "0 0 30px rgba(255,171,0,0.8)",
//         }}
//       >
//         {displayChar}
//       </motion.span>

//       {/* Character glow effect on hover */}
//       {isHovered && (
//         <motion.span
//           className="absolute inset-0 z-0 text-[#FFAB00] blur-sm opacity-50"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.5 }}
//         >
//           {displayChar}
//         </motion.span>
//       )}

//       {/* Decode spark effect */}
//       {isDecoding && (
//         <motion.span
//           className="absolute -top-1 -right-1 w-1 h-1 bg-[#FFAB00] rounded-full"
//           initial={{ scale: 0, opacity: 1 }}
//           animate={{ scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
//           transition={{ duration: 0.3 }}
//         />
//       )}
//     </motion.span>
//   );
// };

// // ============================================
// // BACKGROUND EFFECTS
// // ============================================
// const BackgroundEffects = ({ isHovered, isAnimating }: { isHovered: boolean; isAnimating: boolean }) => {
//   return (
//     <>
//       {/* Grid pattern */}
//       <motion.div 
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `
//             linear-gradient(90deg, rgba(255,171,0,0.03) 1px, transparent 1px),
//             linear-gradient(rgba(255,171,0,0.03) 1px, transparent 1px)
//           `,
//           backgroundSize: '40px 40px'
//         }}
//         animate={{ 
//           opacity: isHovered ? 0.6 : 0.2,
//           backgroundSize: isAnimating ? '45px 45px' : '40px 40px'
//         }}
//         transition={{ duration: 0.5 }}
//       />

//       {/* Radial glow */}
//       <motion.div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           background: "radial-gradient(circle at 50% 50%, rgba(255,171,0,0.08) 0%, transparent 50%)"
//         }}
//         animate={{
//           scale: isHovered ? 1.2 : 1,
//           opacity: isHovered ? 1 : 0.5
//         }}
//         transition={{ duration: 0.8 }}
//       />

//       {/* Animated corner accents */}
//       {[
//         { position: "top-4 left-4", rotation: 0 },
//         { position: "top-4 right-4", rotation: 90 },
//         { position: "bottom-4 right-4", rotation: 180 },
//         { position: "bottom-4 left-4", rotation: 270 },
//       ].map((corner, i) => (
//         <motion.div
//           key={i}
//           className={`absolute ${corner.position} w-8 h-8 pointer-events-none`}
//           style={{ rotate: corner.rotation }}
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ 
//             opacity: isHovered ? 1 : 0.3,
//             scale: isHovered ? 1 : 0.8
//           }}
//           transition={{ duration: 0.3, delay: i * 0.05 }}
//         >
//           <div className="w-full h-[2px] bg-gradient-to-r from-[#FFAB00] to-transparent" />
//           <div className="w-[2px] h-full bg-gradient-to-b from-[#FFAB00] to-transparent" />
//         </motion.div>
//       ))}

//       {/* Floating particles */}
//       <FloatingParticles isActive={isHovered || isAnimating} />

//       {/* Horizontal scan line */}
//       <motion.div
//         className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFAB00]/30 to-transparent pointer-events-none"
//         initial={{ top: "0%", opacity: 0 }}
//         animate={isAnimating ? {
//           top: ["0%", "100%"],
//           opacity: [0, 1, 0]
//         } : {
//           top: "50%",
//           opacity: 0
//         }}
//         transition={{ duration: 0.6 }}
//       />

//       {/* Energy burst on animation */}
//       <AnimatePresence>
//         {isAnimating && (
//           <motion.div
//             className="absolute inset-0 pointer-events-none"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {/* Central burst */}
//             <motion.div
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FFAB00]"
//               initial={{ scale: 0, opacity: 1 }}
//               animate={{ scale: 30, opacity: 0 }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//             />
            
//             {/* Ring waves */}
//             {[0, 1, 2].map((i) => (
//               <motion.div
//                 key={i}
//                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFAB00]"
//                 initial={{ width: 0, height: 0, opacity: 0.8 }}
//                 animate={{ 
//                   width: 400 + i * 100, 
//                   height: 100 + i * 30, 
//                   opacity: 0 
//                 }}
//                 transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
//               />
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// // ============================================
// // FLOATING PARTICLES
// // ============================================
// const FloatingParticles = ({ isActive }: { isActive: boolean }) => {
//   const particles = useMemo(() => 
//     Array.from({ length: 20 }).map((_, i) => ({
//       id: i,
//       initialX: Math.random() * 100,
//       initialY: Math.random() * 100,
//       size: Math.random() * 3 + 1,
//       duration: Math.random() * 3 + 2,
//       delay: Math.random() * 2,
//     })),
//   []);

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {particles.map(({ id, initialX, initialY, size, duration, delay }) => (
//         <motion.div
//           key={id}
//           className="absolute rounded-full"
//           style={{
//             left: `${initialX}%`,
//             top: `${initialY}%`,
//             width: size,
//             height: size,
//             background: "#FFAB00",
//             boxShadow: `0 0 ${size * 2}px #FFAB00`
//           }}
//           initial={{ opacity: 0, scale: 0 }}
//           animate={isActive ? {
//             opacity: [0, 0.6, 0],
//             scale: [0, 1, 0],
//             y: [0, -50, -100],
//             x: [0, Math.sin(id) * 20, Math.sin(id) * 40]
//           } : {
//             opacity: 0,
//             scale: 0
//           }}
//           transition={{
//             duration,
//             delay,
//             repeat: isActive ? Infinity : 0,
//             repeatDelay: 1
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // ============================================
// // ALTERNATIVE: FLIP BOARD ANIMATION
// // ============================================
// // ============================================
// // ALTERNATIVE: FLIP BOARD ANIMATION - FIXED FOR MOBILE
// // ============================================
// export const FlipBoardTagline = () => {
//   const [index, setIndex] = useState(0);
//   const currentPhrase = phrases[index];
//   const words = useMemo(() => currentPhrase.split(" "), [currentPhrase]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % phrases.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="w-full flex flex-col justify-center items-center py-16 bg-[#0a0a0a] overflow-hidden relative">
//       <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 px-4">
//         {words.map((word, wordIndex) => (
//           <div key={wordIndex} className="flex gap-1 md:gap-2">
//             {word.split("").map((char, charIndex) => (
//               <FlipCard key={`${wordIndex}-${charIndex}`} char={char} delay={(wordIndex * 5 + charIndex) * 0.03} />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const FlipCard = ({ char, delay }: { char: string; delay: number }) => {
//   if (char === " ") return <div className="w-4" />;

//   return (
//     <motion.div
//       className="relative w-8 h-12 md:w-12 md:h-16 lg:w-14 lg:h-20 perspective-500"
//       initial={{ rotateX: -90 }}
//       animate={{ rotateX: 0 }}
//       transition={{ 
//         duration: 0.6, 
//         delay,
//         type: "spring",
//         stiffness: 200,
//         damping: 20
//       }}
//     >
//       {/* Card body */}
//       <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-sm border border-gray-700 shadow-lg flex items-center justify-center overflow-hidden">
//         {/* Divider line */}
//         <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/50" />
        
//         {/* Character */}
//         <span className="font-display text-2xl md:text-3xl lg:text-4xl text-white font-black">
//           {char}
//         </span>
        
//         {/* Top highlight */}
//         <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent" />
//       </div>
//     </motion.div>
//   );
// };

// // ============================================
// // ALTERNATIVE: WAVE TEXT ANIMATION
// // ============================================
// // ============================================
// // ALTERNATIVE: WAVE TEXT ANIMATION - FIXED FOR MOBILE
// // ============================================
// export const WaveTagline = () => {
//   const [index, setIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const currentPhrase = phrases[index];
//   const words = useMemo(() => currentPhrase.split(" "), [currentPhrase]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % phrases.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div 
//       className="w-full flex flex-col justify-center items-center py-16 bg-[#0a0a0a] overflow-hidden relative cursor-pointer"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-center">
//         <AnimatePresence mode="wait">
//           <motion.span
//             key={index}
//             className="inline-block"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             {words.map((word, wordIndex) => (
//               <span key={wordIndex} className="inline-block whitespace-nowrap mx-1 sm:mx-2">
//                 {word.split("").map((char, charIndex) => (
//                   <motion.span
//                     key={charIndex}
//                     className="inline-block text-white"
//                     style={{ 
//                       textShadow: isHovered ? "0 0 20px rgba(255,171,0,0.5)" : "none" 
//                     }}
//                     initial={{ y: 50, opacity: 0, rotateZ: -10 }}
//                     animate={{ 
//                       y: isHovered ? [0, -10, 0] : 0, 
//                       opacity: 1, 
//                       rotateZ: 0,
//                       color: isHovered ? "#FFAB00" : "#ffffff"
//                     }}
//                     transition={{
//                       y: {
//                         duration: 0.6,
//                         delay: isHovered ? (wordIndex * 5 + charIndex) * 0.02 : 0,
//                         repeat: isHovered ? Infinity : 0,
//                         repeatType: "reverse"
//                       },
//                       opacity: { duration: 0.3, delay: (wordIndex * 5 + charIndex) * 0.02 },
//                       rotateZ: { duration: 0.4, delay: (wordIndex * 5 + charIndex) * 0.02 },
//                       color: { duration: 0.3 }
//                     }}
//                   >
//                     {char}
//                   </motion.span>
//                 ))}
//               </span>
//             ))}
//           </motion.span>
//         </AnimatePresence>
//       </h2>
//     </div>
//   );
// };

// // ============================================
// // ALTERNATIVE: TYPEWRITER EFFECT
// // ============================================
// // ============================================
// // ALTERNATIVE: TYPEWRITER EFFECT - FIXED FOR MOBILE
// // ============================================
// export const TypewriterTagline = () => {
//   const [index, setIndex] = useState(0);
//   const [displayText, setDisplayText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const currentPhrase = phrases[index];

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (!isDeleting) {
//         if (displayText.length < currentPhrase.length) {
//           setDisplayText(currentPhrase.slice(0, displayText.length + 1));
//         } else {
//           setTimeout(() => setIsDeleting(true), 2000);
//         }
//       } else {
//         if (displayText.length > 0) {
//           setDisplayText(displayText.slice(0, -1));
//         } else {
//           setIsDeleting(false);
//           setIndex((prev) => (prev + 1) % phrases.length);
//         }
//       }
//     }, isDeleting ? 30 : 80);

//     return () => clearTimeout(timeout);
//   }, [displayText, isDeleting, currentPhrase]);

//   return (
//     <div className="w-full flex flex-col justify-center items-center py-16 bg-[#0a0a0a] overflow-hidden relative px-4">
//       <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-center text-white min-h-[1.2em] break-words">
//         {displayText}
//         <motion.span
//           className="inline-block w-[4px] h-[1em] bg-[#FFAB00] ml-2 align-middle"
//           animate={{ opacity: [1, 0, 1] }}
//           transition={{ duration: 0.8, repeat: Infinity }}
//         />
//       </h2>
      
//       {/* Typing sound visualization */}
//       <div className="flex gap-1 mt-6">
//         {[...Array(5)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="w-1 bg-[#FFAB00] rounded-full"
//             animate={{
//               height: displayText.length > 0 && !isDeleting 
//                 ? [4, 20, 4] 
//                 : 4
//             }}
//             transition={{
//               duration: 0.2,
//               delay: i * 0.05,
//               repeat: displayText.length > 0 && !isDeleting ? Infinity : 0
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeroTagline;


