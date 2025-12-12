import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Film, ArrowRight } from "lucide-react";

interface DocuItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  desc: string;
}

const docs: DocuItem[] = [
  {
    id: "1",
    title: "The Making of Raji: An Ancient Epic",
    duration: "45:00",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    youtubeId: "QkkoHAzjnUs",
    desc: "A deep dive into the challenges faced by Nodding Heads Games."
  },
  {
    id: "2",
    title: "Indie Revolution: Mumbai",
    duration: "32:15",
    thumbnail: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800",
    youtubeId: "dQw4w9WgXcQ",
    desc: "Tracking the explosive growth of game jams in the city."
  },
  {
    id: "3",
    title: "Esports: The Billion Dollar Dream",
    duration: "28:50",
    thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800",
    youtubeId: "QkkoHAzjnUs",
    desc: "Behind the scenes with India's top CS2 teams."
  },
];

export const DocumentaryTheater = () => {
  const [activeDoc, setActiveDoc] = useState(docs[0]);

  return (
    <section className="py-24 bg-black relative">
      {/* Lights Out Effect: This section is pure black to focus attention */}

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* --- HEADER SECTION (FIXED) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          
          {/* Left: Title & Icon */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFAB00]/10 rounded-lg">
                <Film className="w-6 h-6 text-[#FFAB00]" />
            </div>
            <div>
                <h2 className="font-display text-4xl font-bold text-white uppercase tracking-tight leading-none">
                Documentary <span className="text-[#FFAB00]">Theater</span>
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-1 tracking-widest uppercase">
                    Original Programming & Deep Dives
                </p>
            </div>
          </div>

          {/* Right: Stunning 'View All' Button */}
          <a href="/documentary" className="group flex items-center gap-3 pb-1 transition-all">
            <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
              Full Library
            </span>
            <div className="relative w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FFAB00] group-hover:bg-[#FFAB00] transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-white group-hover:text-black transition-colors transform group-hover:-rotate-45" />
            </div>
          </a>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">

          {/* Main Stage (Video Player) */}
          <div className="lg:col-span-2 relative bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
            <iframe
              src={`https://www.youtube.com/embed/${activeDoc.youtubeId}?autoplay=0&rel=0`}
              title="YouTube video player"
              className="w-full h-full absolute inset-0 object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Cinematic Border Glow */}
            <div className="absolute inset-0 border border-white/5 group-hover:border-[#FFAB00]/30 transition-colors pointer-events-none rounded-xl" />
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest">Up Next</h3>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
            </div>

            {docs.map((doc) => (
              <motion.div
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                whileHover={{ x: 5 }}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border flex gap-4 group relative overflow-hidden
                  ${activeDoc.id === doc.id
                    ? "bg-[#1a1a1a] border-[#FFAB00] shadow-[0_0_15px_rgba(255,171,0,0.1)]"
                    : "bg-transparent border-white/5 hover:bg-white/5"
                  }`}
              >
                {/* Active Indicator Bar */}
                {activeDoc.id === doc.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFAB00]" />
                )}

                {/* Thumbnail */}
                <div className="relative w-32 h-20 flex-shrink-0 rounded bg-gray-800 overflow-hidden border border-white/10">
                  <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                    <Play className={`w-8 h-8 drop-shadow-lg ${activeDoc.id === doc.id ? "text-[#FFAB00] fill-[#FFAB00]" : "text-white fill-white/50"}`} />
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className={`font-bold text-sm leading-tight mb-1 truncate pr-2 ${activeDoc.id === doc.id ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono uppercase">
                    <Clock className="w-3 h-3" />
                    <span>{doc.duration}</span>
                  </div>
                  {activeDoc.id === doc.id && (
                    <p className="text-[10px] text-[#FFAB00] mt-2 font-bold tracking-wider animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFAB00]" /> NOW PLAYING
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};