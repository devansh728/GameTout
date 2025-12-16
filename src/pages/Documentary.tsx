import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Clock, User, ArrowRight, Film, ChevronDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { ThreeDCard } from "@/components/ThreeDCard"; // Using your uploaded component
import { Footer } from "@/components/Footer";

// --- MOCK DATA ---
const featuredDoc = {
  id: "ac-evolution",
  title: "The Assassin's Creed Evolution",
  subtitle: "17 Years of Stealth. One definitive history.",
  description: "From the Holy Land to the Shadows of feudal Japan. We break down every parkour mechanic, every hidden blade, and how Ubisoft changed open worlds forever.",
  videoId: "UgbO7pLn1Cg", // YouTube ID
  duration: "1H 09M",
  views: "2.4M",
};

const documentaries = [
  {
    id: "raji-story",
    title: "From Pixels to Glory: The Raji Story",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    duration: "32:15",
    author: "Nodding Heads",
    views: "890K",
    tag: "Indie Spotlight"
  },
  {
    id: "esports-underground",
    title: "Esports India: The Underground",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    duration: "28:45",
    author: "Mortal",
    views: "654K",
    tag: "Culture"
  },
  {
    id: "mobile-boom",
    title: "The Mobile Gaming Explosion",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    duration: "41:20",
    author: "GameTout Editorial",
    views: "1.1M",
    tag: "Industry"
  },
  {
    id: "indie-dreams",
    title: "Indie Dreams: Game Jam Stories",
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800",
    duration: "25:00",
    author: "IGDC",
    views: "432K",
    tag: "Events"
  },
  {
    id: "gta-6-leaks",
    title: "GTA VI: The Leaks Analysis",
    thumbnail: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800",
    duration: "18:30",
    author: "Rockstar Insider",
    views: "5.2M",
    tag: "Deep Dive"
  },
  {
    id: "unreal-5",
    title: "Unreal Engine 5: The Future",
    thumbnail: "https://images.unsplash.com/photo-1614726365723-49cfae92782f?w=800",
    duration: "35:10",
    author: "Tech Art",
    views: "900K",
    tag: "Tech"
  }
];

export default function Documentary() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Parallax for text
  const opacity = useTransform(scrollY, [0, 400], [1, 0]); // Fade out hero

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
        
        {/* =========================================
            1. HERO SECTION: CINEMATIC VIDEO HEADER
           ========================================= */}
        <section className="relative h-[90vh] overflow-hidden border-b border-border">
          
          {/* VIDEO WALLPAPER */}
          <div className="absolute inset-0 z-0 pointer-events-none scale-110">
             <iframe
                src={`https://www.youtube.com/embed/${featuredDoc.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${featuredDoc.videoId}&modestbranding=1&showinfo=0&rel=0`}
                className="w-full h-full object-cover opacity-60 grayscale-[30%] contrast-125"
                allow="autoplay; encrypted-media"
                style={{ pointerEvents: "none" }}
             />
             {/* Scanlines Effect */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_4px,3px_100%] pointer-events-none" />
          </div>

          {/* GRADIENTS & VIGNETTE */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-[2]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-[2]" />
          
          {/* CONTENT OVERLAY */}
          <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-12 max-w-7xl mx-auto pt-20">
            <motion.div style={{ y: y1, opacity }}>
                
                {/* Badge */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                    <span className="text-red-500 font-mono text-sm font-bold uppercase tracking-[0.3em]">
                        Featured Premiere
                    </span>
                </div>

                {/* Title */}
                <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white uppercase leading-[0.85] mb-6 drop-shadow-2xl tracking-tighter">
                    {featuredDoc.title.split(" ").map((word, i) => (
                        <span key={i} className="block">{word}</span>
                    ))}
                </h1>

                {/* Description */}
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-end max-w-4xl">
                    <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl border-l-4 border-primary pl-6 leading-relaxed">
                        {featuredDoc.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex gap-6 text-sm font-mono text-gray-400 uppercase tracking-widest bg-black/50 backdrop-blur px-4 py-2 rounded border border-white/10">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {featuredDoc.duration}</span>
                        <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {featuredDoc.views}</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-10 flex gap-4">
                    <Link 
                        to={`/content/documentary/${featuredDoc.id}`} 
                        className="group relative px-8 py-4 bg-primary text-black font-bold uppercase tracking-widest text-sm overflow-hidden rounded-sm flex items-center gap-3 hover:scale-105 transition-transform"
                    >
                        <Play className="w-5 h-5 fill-black" /> 
                        <span className="relative z-10">Watch Film</span>
                        <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 z-0" />
                    </Link>
                </div>
            </motion.div>
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
                <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
                    Select a file to declassify
                </p>
            </div>
            <Film className="w-12 h-12 text-primary opacity-20" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentaries.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/content/documentary/${doc.id}`}>
                    <ThreeDCard className="h-full bg-card border border-border group cursor-pointer relative overflow-visible">
                        
                        {/* Thumbnail Container */}
                        <div className="relative h-56 w-full overflow-hidden rounded-t-lg bg-black">
                            <img 
                                src={doc.thumbnail} 
                                alt={doc.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                            />
                            
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            
                            {/* Tag */}
                            <div className="absolute top-4 left-4">
                                <span className="px-2 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                    {doc.tag}
                                </span>
                            </div>

                            {/* Play Button Overlay (Reveals on Hover) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,171,0,0.5)]">
                                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 relative">
                            {/* Decorative Line */}
                            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <h3 className="font-display text-2xl text-foreground uppercase leading-none mb-3 group-hover:text-primary transition-colors">
                                {doc.title}
                            </h3>
                            
                            <div className="flex justify-between items-center text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                <span className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                                    <User className="w-3 h-3" /> {doc.author}
                                </span>
                                <span className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                                    <Clock className="w-3 h-3" /> {doc.duration}
                                </span>
                            </div>
                        </div>

                        {/* Hover Border Glow (Pseudo-element handled by ThreeDCard usually, but reinforcing here) */}
                    </ThreeDCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
        
        <Footer />
      </main>
    </PageTransition>
  );
}