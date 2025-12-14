import { motion } from "framer-motion";
import { Mic, Headphones, ExternalLink, PlayCircle } from "lucide-react";

export const PodcastSection = () => {
  return (
    <section className="py-20 bg-black border-t border-b border-white/10 relative overflow-hidden">
      
      {/* Background Waveform Effect (CSS Gradient trick) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            
            {/* Left: Branding */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono text-red-500 uppercase tracking-widest">On Air Now</span>
                </div>
                <h2 className="font-display text-5xl md:text-6xl font-bold uppercase text-white mb-6">
                    GameTout <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Gossip</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                    No scripts. No filters. Just raw, candid conversations with the creators and chaos-makers of the Indian Gaming Industry.
                </p>
                
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-sm">
                        <PlayCircle className="w-5 h-5" /> Listen on Spotify
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors rounded-sm">
                        <ExternalLink className="w-5 h-5" /> YouTube
                    </button>
                </div>
            </div>

            {/* Right: Featured Episode Card */}
            <div className="flex-1 w-full">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-[#121212] border border-white/10 rounded-xl p-6 relative group"
                >
                    <div className="flex gap-6 items-start">
                        <div className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                                src="https://img.youtube.com/vi/FKBwFAju-0o/maxresdefault.jpg" 
                                alt="Zassar Podcast" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-[#FFAB00] text-xs font-bold uppercase mb-1 block">Episode #42</span>
                            <h3 className="font-display text-2xl text-white leading-tight mb-2">
                                "Zero to Zassar: The Dark Layers of Indian Gaming"
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                We discuss toxicity, the 'Chhapri' setup comments, and the struggle of original content creation in India.
                            </p>
                            <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                                <Headphones className="w-3 h-3" /> 40 Min Listen
                            </div>
                        </div>
                    </div>
                    
                    {/* Animated Equalizer Bars */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end gap-1 px-6 pb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        {[...Array(20)].map((_, i) => (
                            <motion.div 
                                key={i}
                                className="w-full bg-purple-500/50 rounded-t"
                                animate={{ height: [5, Math.random() * 30, 5] }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

        </div>
      </div>
    </section>
  );
};