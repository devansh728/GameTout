import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const parallaxImages = [
  {
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
    speed: 0.5,
    className: "w-64 h-40 md:w-80 md:h-52",
    position: "top-20 left-10",
  },
  {
    url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200",
    speed: 0.3,
    className: "w-72 h-48 md:w-96 md:h-64",
    position: "top-40 right-20",
  },
  {
    url: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=1200",
    speed: 0.7,
    className: "w-56 h-36 md:w-72 md:h-44",
    position: "bottom-40 left-1/4",
  },
  {
    url: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=1200",
    speed: 0.4,
    className: "w-60 h-40 md:w-80 md:h-52",
    position: "bottom-20 right-10",
  },
];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] overflow-hidden vignette"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-transparent" />
      
      {/* Parallax Images */}
      <div className="absolute inset-0">
        {parallaxImages.map((image, index) => (
          <motion.div
            key={index}
            style={{ y: index % 2 === 0 ? y1 : y2 }}
            className={`absolute ${image.position} ${image.className} rounded-lg overflow-hidden opacity-40 hover:opacity-70 transition-opacity duration-500`}
          >
            <img
              src={image.url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
            India's Premier Gaming Hub
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl tracking-tight mb-6"
        >
          <span className="text-gradient-gold">GAME</span>
          <span className="text-foreground">TOUT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl text-muted-foreground text-lg md:text-xl mb-10"
        >
          Cinematic stories. Expert reviews. A professional network built for the 
          next generation of Indian game developers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#featured"
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105 animate-glow-pulse"
          >
            Explore Stories
          </a>
          <a
            href="/portfolios"
            className="px-8 py-4 rounded-lg border border-border text-foreground font-medium hover:bg-muted/50 transition-all hover:scale-105"
          >
            Join the Network
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
