import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  className = "",
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  
  // Use a spring for realistic counting effect
  const count = useSpring(0, { 
    stiffness: 50, 
    damping: 15, 
    duration: duration * 1000 
  });

  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (inView) {
      count.set(value);
    }
  }, [inView, value, count]);

  return (
    <span ref={ref} className={`inline-flex items-center ${className}`}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};
