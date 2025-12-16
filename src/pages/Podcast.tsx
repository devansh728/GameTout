import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Mic, Headphones, Clock, Calendar, Youtube, Music, ArrowRight, Radio, Share2 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

// --- MOCK DATA ---
const featuredEpisode = {
  id: "ep-42",
  title: "The Dark Layers of Indian Gaming",
  guest: "Mortal & Thug",
  description: "We dive deep into the toxicity of chat, the pressure of maintaining numbers, and the unseen mental toll of being India's biggest esports creators.",
  image: "https://img.youtube.com/vi/FKBwFAju-0o/maxresdefault.jpg",
  duration: "1h 12m",
  date: "Oct 12, 2024",
  spotifyUrl: "#",
  youtubeUrl: "#",
};

const episodes = [
  {
    id: 1,
    title: "Indie Devs vs The World",
    guest: "Nodding Heads",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    duration: "55m",
    date: "Oct 05, 2024",
    tag: "DevLog"
  },
  {
    id: 2,
    title: "The PS5 Pro: Worth the Hype?",
    guest: "Tech Roundtable",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800",
    duration: "45m",
    date: "Sep 28, 2024",
    tag: "Hardware"
  },
  {
    id: 3,
    title: "Voice Acting as a Career",
    guest: "Payal & Shagufta",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=800",
    duration: "1h 05m",
    date: "Sep 21, 2024",
    tag: "Industry"
  },
  {
    id: 4,
    title: "Esports Economics Explained",
    guest: "Global Esports CEO",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    duration: "50m",
    date: "Sep 14, 2024",
    tag: "Business"
  },
  {
    id: 5,
    title: "The Rise of Mobile Gaming",
    guest: "Jonathan Gaming",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    duration: "1h 10m",
    date: "Sep 07, 2024",
    tag: "Mobile"
  },
  {
    id: 6,
    title: "Game Journalism in 2025",
    guest: "Rishi Alwani",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
    duration: "40m",
    date: "Aug 30, 2024",
    tag: "Media"
  }
];

export default function Podcast() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground selection:bg-purple-500 selection:text-white">
        
        {/* =========================================
            1. HERO: THE BROADCAST STUDIO
           ========================================= */}
        <section className="relative min-h-[90vh] flex flex-col justify-center border-b border-white/5 overflow-hidden pt-20">
          
          {/* Animated Background Ambience */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/30 via-background to-background" />
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full py-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* TEXT CONTENT */}
                <motion.div 
                    className="lg:col-span-7"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Live Badge */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                        <span className="text-red-500 font-mono text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                            Live Signal <span className="w-8 h-[1px] bg-red-500/50" />
                        </span>
                    </div>

                    <h1 className="font-display text-6xl md:text-8xl text-white uppercase leading-[0.9] mb-6 tracking-tighter">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Gossip</span> Protocol
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-400 font-serif italic mb-8 max-w-2xl border-l-4 border-purple-500 pl-6">
                        "{featuredEpisode.description}"
                    </p>

                    {/* Featured Episode Card (Mini) */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <span className="text-[#FFAB00] text-xs font-bold uppercase tracking-widest mb-1 block">Latest Episode</span>
                                <h3 className="text-2xl font-display text-white uppercase mb-2">{featuredEpisode.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
                                    <span className="flex items-center gap-2"><Mic className="w-4 h-4 text-purple-400" /> {featuredEpisode.guest}</span>
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" /> {featuredEpisode.duration}</span>
                                </div>
                            </div>
                            
                            {/* Visualizer Animation */}
                            <div className="flex items-end gap-1 h-12">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        className="w-2 bg-purple-500 rounded-t-sm"
                                        animate={{ height: ["20%", `${Math.random() * 80 + 20}%`, "20%"] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.05 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-4">
                        <a href={featuredEpisode.spotifyUrl} className="flex items-center gap-3 px-8 py-4 bg-[#1DB954] text-black font-bold uppercase tracking-widest rounded-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(29,185,84,0.3)]">
                            <Music className="w-5 h-5" /> Listen on Spotify
                        </a>
                        <a href={featuredEpisode.youtubeUrl} className="flex items-center gap-3 px-8 py-4 bg-[#FF0000] text-white font-bold uppercase tracking-widest rounded-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                            <Youtube className="w-5 h-5" /> Watch on YouTube
                        </a>
                    </div>
                </motion.div>

                {/* HERO IMAGE (Right Side) */}
                <motion.div 
                    className="lg:col-span-5 relative"
                    style={{ y: y1 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                        <img 
                            src={featuredEpisode.image} 
                            alt="Featured" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        
                        {/* Floating Badge */}
                        <div className="absolute top-6 right-6 bg-black/80 backdrop-blur border border-purple-500/30 p-3 rounded-lg flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">12</span>
                            <span className="text-[10px] uppercase text-purple-400 font-bold">OCT</span>
                        </div>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_white]">
                                <Play className="w-8 h-8 fill-black text-black ml-1" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -z-10 -bottom-10 -right-10 w-full h-full border-2 border-purple-500/20 rounded-2xl" />
                    <div className="absolute -z-20 -bottom-20 -right-20 w-full h-full border-2 border-purple-500/10 rounded-2xl" />
                </motion.div>

            </div>
          </div>
        </section>


        {/* =========================================
            2. THE ARCHIVE (Masonry Grid)
           ========================================= */}
        <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-20">
            
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <h2 className="font-display text-4xl md:text-5xl text-white uppercase leading-none mb-3">
                        Transmission <span className="text-purple-500">Archive</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                        Accessing Database... 42 Entries Found
                    </p>
                </div>
                
                {/* Filter Tabs (Visual Only for now) */}
                <div className="flex gap-2">
                    {["All", "DevLog", "Hardware", "Business"].map((tab, i) => (
                        <button key={tab} className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${i === 0 ? "bg-purple-500 border-purple-500 text-white" : "border-white/10 text-gray-500 hover:text-white hover:border-white/30"}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {episodes.map((ep, i) => (
                    <motion.div
                        key={ep.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link to={`/content/podcast/${ep.id}`} className="group block h-full">
                            <div className="relative h-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col">
                                
                                {/* Image Area */}
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={ep.image} 
                                        alt={ep.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                                    
                                    {/* Tag Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-1 bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                                            {ep.tag}
                                        </span>
                                    </div>

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                                            <Play className="w-5 h-5 fill-white text-white ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-3 text-xs font-mono text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ep.date}</span>
                                        <span className="flex items-center gap-1 text-purple-400"><Clock className="w-3 h-3" /> {ep.duration}</span>
                                    </div>

                                    <h3 className="font-display text-2xl text-white uppercase leading-none mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                                        {ep.title}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-400 font-mono mb-4">
                                        Guest: <span className="text-white">{ep.guest}</span>
                                    </p>

                                    {/* Footer Actions */}
                                    <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase text-gray-600 group-hover:text-white transition-colors flex items-center gap-2">
                                            Listen Now <ArrowRight className="w-3 h-3" />
                                        </span>
                                        <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Load More Trigger */}
            <div className="mt-16 flex justify-center">
                <button className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all rounded-sm flex items-center gap-2 group">
                    <Radio className="w-4 h-4 group-hover:animate-pulse" /> Load Older Signals
                </button>
            </div>

        </section>

        <Footer />
      </main>
    </PageTransition>
  );
}