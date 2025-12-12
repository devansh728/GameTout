import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface VideoHeroProps {
  videoUrl?: string;
  posterImage?: string;
  title?: React.ReactNode;
  subtitle?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export const VideoHero = ({
  videoUrl = "https://www.youtube.com/watch?v=QkkoHAzjnUs",
  posterImage = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920",
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: VideoHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] overflow-hidden vignette"
    >
      {/* Video Background */}
      <motion.div style={{ scale }} className="absolute inset-0">
        {isMobile ? (
          <img
            src={posterImage}
            alt="Hero"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {!isReady && (
              <img
                src={posterImage}
                alt="Hero Loading"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {videoId && (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  onLoad={() => setIsReady(true)}
                  style={{ border: 0, pointerEvents: 'none' }}
                />
              </div>
            )}
          </>
        )}
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center"
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
          className="font-display text-[clamp(3rem,10vw,9rem)] tracking-tight mb-6"
        >
          {title || (
            <>
              <span className="text-gradient-gold">GAME</span>
              <span className="text-foreground">TOUT</span>
            </>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl text-muted-foreground text-[clamp(1rem,2vw,1.25rem)] mb-10"
        >
          {subtitle || "Cinematic stories. Expert reviews. A professional network built for the next generation of Indian game developers."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {ctaPrimary && (
            <a
              href={ctaPrimary.href}
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105 animate-glow-pulse"
            >
              {ctaPrimary.label}
            </a>
          )}
          {ctaSecondary && (
            <a
              href={ctaSecondary.href}
              className="px-8 py-4 rounded-lg border border-border text-foreground font-medium hover:bg-muted/50 transition-all hover:scale-105"
            >
              {ctaSecondary.label}
            </a>
          )}
          {!ctaPrimary && !ctaSecondary && (
            <>
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
            </>
          )}
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
