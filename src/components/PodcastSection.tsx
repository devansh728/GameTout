import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic, Music, Youtube,Headphones, Play, Clock, BarChart3, ChevronRight, Radio } from "lucide-react";

// --- MOCK DATA ---
const episodes = [
  {
    id: 1,
    title: "Zero to Zassar: The Dark Layers",
    guest: "Feat. Zassar",
    duration: "42 min",
    image: "https://img.youtube.com/vi/FKBwFAju-0o/maxresdefault.jpg",
    tags: ["Toxicity", "Streaming"],
    isLive: true
  },
  {
    id: 2,
    title: "The Indie Dev Nightmare",
    guest: "Feat. Nodding Heads",
    duration: "55 min",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    tags: ["DevLog", "Funding"],
    isLive: false
  },
  {
    id: 3,
    title: "Esports Economics 101",
    guest: "Feat. Mortal",
    duration: "38 min",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    tags: ["Business", "BGMI"],
    isLive: false
  }
];

export const PodcastSection = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050505] to-[#050505]" />
      <div className="absolute -left-20 top-20 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                    <span className="text-purple-400 font-mono text-xs uppercase tracking-widest">GameTout Frequency</span>
                </div>
                <h2 className="font-display text-5xl md:text-6xl text-white uppercase leading-none">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Gossip</span> Protocol
                </h2>
            </div>
            <Link to="/podcast" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                View All Transmissions 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: MAIN PLAYER (Featured Episode) */}
            <div className="lg:col-span-7">
                <motion.div 
                    className="relative h-[500px] rounded-2xl overflow-hidden border border-white/10 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <img 
                        src={episodes[0].image} 
                        alt="Featured Podcast" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm mb-3">
                                Latest Episode
                            </span>
                            <h3 className="font-display text-4xl md:text-5xl text-white uppercase leading-none mb-2 drop-shadow-lg">
                                {episodes[0].title}
                            </h3>
                            <p className="text-purple-300 font-mono text-sm uppercase tracking-wider mb-6">
                                {episodes[0].guest} // {episodes[0].duration}
                            </p>
                        </div>

                        {/* Audio Visualizer & Play Button */}
                        <div className="flex items-center gap-6">
                            
                            {/* HOVER REVEAL: Play Button becomes Spotify/YouTube */}
                            <div className="relative w-48 h-16 group/btn">
                                {/* Default State: Play Button */}
                                <button className="absolute inset-0 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 opacity-100 scale-100 group-hover/btn:opacity-0 group-hover/btn:scale-0">
                                    <Play className="w-6 h-6 fill-black ml-1" />
                                </button>

                                {/* Hover State: Split Action Buttons */}
                                <div className="absolute inset-0 flex gap-3 opacity-0 scale-90 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-300">
                                    <a href="#" className="w-16 h-16 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Listen on Spotify">
                                        <Headphones className="w-6 h-6 text-black" />
                                    </a>
                                    <a href="#" className="w-16 h-16 rounded-full bg-[#FF0000] flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Watch on YouTube">
                                        <Youtube className="w-6 h-6 text-white" />
                                    </a>
                                </div>
                            </div>
                            
                            {/* Animated Equalizer (Always Playing Visual) */}
                            <div className="flex items-end gap-1 h-12 flex-1 pb-2">
                                {[...Array(30)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        className="flex-1 bg-purple-500/50 rounded-t-sm"
                                        animate={{ height: ["10%", `${Math.random() * 80 + 20}%`, "10%"] }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            duration: 0.8, 
                                            delay: i * 0.05,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT: THE QUEUE (List) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2 text-gray-500 font-mono text-xs uppercase tracking-widest">
                    <Radio className="w-4 h-4" /> Up Next
                </div>

                {episodes.slice(1).map((ep, i) => (
                    <motion.div 
                        key={ep.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative bg-[#121212] border border-white/10 p-4 rounded-xl flex gap-4 cursor-pointer hover:border-purple-500/50 transition-colors"
                        onMouseEnter={() => setActiveId(ep.id)}
                    >
                        {/* Thumbnail */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <img src={ep.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-center">
                            <div className="flex gap-2 mb-1">
                                {ep.tags.map(tag => (
                                    <span key={tag} className="text-[9px] font-bold uppercase text-gray-500 border border-white/10 px-1.5 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h4 className="font-display text-xl text-white uppercase leading-none mb-1 group-hover:text-purple-400 transition-colors">
                                {ep.title}
                            </h4>
                            <p className="text-xs text-gray-400 font-mono">
                                {ep.guest}
                            </p>
                        </div>

                        {/* Duration (Right aligned) */}
                        <div className="ml-auto flex flex-col justify-between items-end py-1">
                            <span className="text-xs font-mono text-gray-600 group-hover:text-white transition-colors">{ep.duration}</span>
                            <BarChart3 className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>
                ))}

                {/* Show More Button Card */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-auto"
                >
                    <Link 
                        to="/podcast" 
                        className="flex items-center justify-center w-full py-6 border-2 border-dashed border-white/10 rounded-xl text-gray-500 font-bold uppercase tracking-widest hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition-all gap-2 group"
                    >
                        <Mic className="w-5 h-5 group-hover:animate-bounce" /> Access Full Archive
                    </Link>
                </motion.div>
            </div>

        </div>
      </div>
    </section>
  );
};