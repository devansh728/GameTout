import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Clock, User, Film, ChevronDown, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { ThreeDCard } from "@/components/ThreeDCard";
import { Footer } from "@/components/Footer";
import { CardSkeleton } from "@/components/SkeletonLoader";
import { VideoPreviewCard } from "@/components/VideoPreviewCard";

// API Hooks and Utils
import { useDocumentaries, usePrefetchPost } from "@/hooks/useBlogPosts";
import { 
  getPostThumbnail, 
  hasVideoEmbed, 
  extractYouTubeId, 
  formatPublishedDate,
  formatLikes 
} from "@/utils/mediaUtils";
import { BlogPostFeed } from "@/types/api";
import { statsService } from "@/services/statsService";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { useState, useEffect } from "react";

export default function Documentary() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [totalDocs, setTotalDocs] = useState(0);

  useEffect(() => {
    statsService.getDocumentariesCount().then(res => setTotalDocs(res.data.count));
  }, []);

  // Fetch documentaries from API
  const { data: documentaries, isLoading, error, refetch } = useDocumentaries(20);
  const prefetchPost = usePrefetchPost();

  // Get featured doc (first one) and rest for grid
  const featuredDoc = documentaries?.[0];
  const archiveDocs = documentaries?.slice(1) || [];

  // Handle hover prefetch
  const handlePostHover = (postId: number) => {
    prefetchPost(postId);
  };

  // Get YouTube video ID for hero background
  const featuredVideoId = featuredDoc?.videoEmbedUrl 
    ? extractYouTubeId(featuredDoc.videoEmbedUrl) 
    : null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
        
        {/* =========================================
            1. HERO SECTION: CINEMATIC VIDEO HEADER
           ========================================= */}
        <section className="relative h-[90vh] overflow-hidden border-b border-border">
          
          {/* VIDEO WALLPAPER - Shows if featured doc has video embed */}
          {featuredDoc && featuredVideoId && (
            <div className="absolute inset-0 z-0 pointer-events-none scale-110">
               <iframe
                  src={`https://www.youtube.com/embed/${featuredVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${featuredVideoId}&modestbranding=1&showinfo=0&rel=0`}
                  className="w-full h-full object-cover opacity-60 grayscale-[30%] contrast-125"
                  allow="autoplay; encrypted-media"
                  style={{ pointerEvents: "none" }}
               />
               {/* Scanlines Effect */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_4px,3px_100%] pointer-events-none" />
            </div>
          )}

          {/* Fallback image if no video */}
          {featuredDoc && !featuredVideoId && (
            <div className="absolute inset-0 z-0">
              <img 
                src={getPostThumbnail(featuredDoc)} 
                alt={featuredDoc.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}

          {/* Loading State for Hero */}
          {isLoading && (
            <div className="absolute inset-0 z-0 bg-background animate-pulse" />
          )}

          {/* GRADIENTS & VIGNETTE */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-[2]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-[2]" />
          
          {/* CONTENT OVERLAY */}
          <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-4 md:px-12 max-w-7xl mx-auto pt-20">
            {featuredDoc ? (
              <motion.div style={{ y: y1, opacity }} className="flex flex-col gap-4">
                  
                  {/* Badge */}
                  <div className="flex items-center gap-3">
                      <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                      </span>
                      <span className="text-red-500 font-mono text-sm font-bold uppercase tracking-[0.3em]">
                          Featured Premiere
                      </span>
                  </div>

                  {/* Title - responsive with proper constraints */}
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.9] drop-shadow-2xl tracking-tighter line-clamp-3 max-w-4xl">
                      {featuredDoc.title}
                  </h1>

                  {/* Description */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end max-w-4xl">
                      <p className="text-gray-300 text-base md:text-lg font-medium max-w-xl border-l-4 border-primary pl-4 md:pl-6 leading-relaxed line-clamp-3">
                          {featuredDoc.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-mono text-gray-400 uppercase tracking-widest bg-black/50 backdrop-blur px-3 md:px-4 py-2 rounded border border-white/10 shrink-0">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" /> 
                            {formatPublishedDate(featuredDoc.publishedAt)}
                          </span>
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" /> 
                            {formatLikes(featuredDoc.likes)}
                          </span>
                      </div>
                  </div>

                  {/* CTA Buttons - always visible */}
                  <div className="mt-4 flex gap-4">
                      <Link 
                          to={`/content/documentary/${featuredDoc.id}`} 
                          className="group relative px-6 md:px-8 py-3 md:py-4 bg-primary text-black font-bold uppercase tracking-widest text-xs md:text-sm overflow-hidden rounded-sm flex items-center gap-3 hover:scale-105 transition-transform shrink-0"
                          onMouseEnter={() => handlePostHover(featuredDoc.id)}
                      >
                          <Play className="w-5 h-5 fill-black" /> 
                          <span className="relative z-10">Watch Film</span>
                          <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 z-0" />
                      </Link>
                  </div>
              </motion.div>
            ) : isLoading ? (
              <div className="space-y-4">
                <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
                <div className="h-24 w-96 bg-white/10 rounded animate-pulse" />
                <div className="h-16 w-80 bg-white/10 rounded animate-pulse" />
              </div>
            ) : null}
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 z-20 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll for Archive</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </section>


        {/* =========================================
            2. THE ARCHIVE: 3D CARD GRID
           ========================================= */}
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-20">
          
          {/* Section Header */}
          <div className="flex items-end justify-between mb-16">
            <div>
                <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase leading-none mb-2">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Archive</span>
                </h2>
                <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Accessing Database... <AnimatedCounter value={totalDocs} /> Files Declassified
                </p>
            </div>
            <Film className="w-12 h-12 text-primary opacity-20" />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="gaming-card p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-display text-white mb-2">Failed to Load Documentaries</h3>
              <p className="text-muted-foreground mb-4">
                There was an error fetching the documentaries. Please try again.
              </p>
              <button 
                onClick={() => refetch()}
                className="px-6 py-2 bg-primary text-black font-bold uppercase tracking-wider rounded hover:bg-primary/80 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && archiveDocs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {archiveDocs.map((doc: BlogPostFeed, index: number) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    to={`/content/documentary/${doc.id}`}
                    onMouseEnter={() => handlePostHover(doc.id)}
                  >
                      <ThreeDCard className="h-full bg-card border border-border group cursor-pointer relative overflow-visible">
                          
                          {/* Video Preview Container - Plays on hover */}
                          <VideoPreviewCard
                            videoUrl={doc.videoEmbedUrl}
                            thumbnailUrl={getPostThumbnail(doc)}
                            alt={doc.title}
                            className="relative h-56 w-full rounded-t-lg bg-black"
                            mediaClassName="transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                          >
                              {/* Dark Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                              
                              {/* Video indicator tag */}
                              <div className="absolute top-4 left-4">
                                  <span className="px-2 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                      {hasVideoEmbed(doc) ? "Video" : "Documentary"}
                                  </span>
                              </div>

                              {/* Play Button Overlay (Reveals on Hover) */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,171,0,0.5)]">
                                      <Play className="w-6 h-6 fill-white text-white ml-1" />
                                  </div>
                              </div>
                          </VideoPreviewCard>

                          {/* Content Body */}
                          <div className="p-6 relative">
                              {/* Decorative Line */}
                              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                              <h3 className="font-display text-2xl text-foreground uppercase leading-none mb-3 group-hover:text-primary transition-colors">
                                  {doc.title}
                              </h3>
                              
                              <div className="flex justify-between items-center text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                  <span className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                                      <User className="w-3 h-3" /> {formatLikes(doc.likes)} likes
                                  </span>
                                  <span className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                                      <Clock className="w-3 h-3" /> {formatPublishedDate(doc.publishedAt)}
                                  </span>
                              </div>
                          </div>
                      </ThreeDCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && archiveDocs.length === 0 && !featuredDoc && (
            <div className="gaming-card p-8 text-center">
              <h3 className="text-xl font-display text-white mb-2">No Documentaries Yet</h3>
              <p className="text-muted-foreground">
                Check back later for new documentaries!
              </p>
            </div>
          )}
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  );
}