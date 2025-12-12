import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

interface Chapter {
  id: string;
  title: string;
  timestamp: number;
  content: string;
}

interface StickyVideoPlayerProps {
  videoUrl: string;
  chapters: Chapter[];
  title: string;
}

// Helper to extract YouTube video ID
const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

export const StickyVideoPlayer = ({
  videoUrl,
  chapters,
  title,
}: StickyVideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoId = getYouTubeId(videoUrl);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Update active chapter based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const chapterIndex = Math.min(
        Math.floor(value * chapters.length),
        chapters.length - 1
      );
      if (chapterIndex !== activeChapter && chapterIndex >= 0) {
        setActiveChapter(chapterIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, chapters, activeChapter]);

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky Video Container */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:float-left lg:pr-8">
        <div className="h-[50vh] lg:h-screen flex flex-col justify-center py-8">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-card border border-border">
            {videoId && (
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${chapters[activeChapter]?.timestamp || 0}`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: 0 }}
              />
            )}
          </div>
          
          {/* Chapter Indicator */}
          <div className="mt-4 flex items-center gap-2">
            {chapters.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1 rounded-full flex-1 transition-colors ${
                  index <= activeChapter ? "bg-primary" : "bg-muted"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: index <= activeChapter ? 1 : 0.3 }}
              />
            ))}
          </div>
          
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            Chapter {activeChapter + 1} of {chapters.length}
          </p>
        </div>
      </div>

      {/* Scrolling Text Content */}
      <div className="lg:w-1/2 lg:float-right lg:pl-8">
        <div className="py-8 lg:py-[50vh]">
          <h2 className="font-display text-4xl mb-8">{title}</h2>
          
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0.3 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-40% 0px -40% 0px" }}
              className={`mb-24 transition-opacity ${
                index === activeChapter ? "opacity-100" : "opacity-30"
              }`}
            >
              <h3 className="font-display text-2xl text-primary mb-4">
                {chapter.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {chapter.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="clear-both" />
    </div>
  );
};
