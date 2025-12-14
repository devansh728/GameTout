import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // IMPORT LINK
import { ArrowUpRight, Clock, User, Play, Zap } from "lucide-react";

interface MediaItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  readTime: string;
  isCoverStory?: boolean;
  type: "article" | "video";
  videoUrl?: string;
}

// Data restricted to Top 5 for the "Spotlight" zone
const spotlightItems: MediaItem[] = [
  {
    id: 1,
    title: "The Rise of Indian Game Studios: A New Era Begins",
    excerpt: "Exclusive: How homegrown developers are reshaping the global gaming landscape with innovative titles and unique storytelling.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200", 
    category: "Cover Story",
    author: "Arjun Mehta",
    readTime: "8 min",
    isCoverStory: true, 
    type: "video",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Mumbai's Largest Game Jam",
    excerpt: "72 hours. 200 developers. One incredible experience.",
    image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800",
    category: "Events",
    author: "Priya Sharma",
    readTime: "5 min",
    type: "article",
  },
  {
    id: 3,
    title: "Review: Raji - Still Holds Up?",
    excerpt: "Revisiting the groundbreaking Indian action-adventure.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    category: "Reviews",
    author: "Rahul Dev",
    readTime: "6 min",
    type: "video",
    videoUrl: "https://www.youtube.com/watch?v=QkkoHAzjnUs",
  },
  {
    id: 4,
    title: "Unity vs Unreal in 2025",
    excerpt: "Which engine dominates Indian studios?",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    category: "Tech",
    author: "Vikram Singh",
    readTime: "10 min",
    type: "article",
  },
  {
    id: 5,
    title: "Nodding Heads: The Interview",
    excerpt: "The creators of Raji share their story.",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800",
    category: "Interview",
    author: "Amit Patel",
    readTime: "12 min",
    type: "article",
  },
];

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

// Helper to generate slugs
const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const SpotlightCard = ({ item }: { item: MediaItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;
  const slug = generateSlug(item.title);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-card 
        ${item.isCoverStory ? "md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[600px]" : "min-h-[280px]"}`}
    >
      <Link to={`/content/${item.type}/${slug}`} className="block h-full w-full">
          
          {/* Media Background */}
          <div className="absolute inset-0 h-full w-full">
            {item.type === "video" && isHovered && videoId ? (
              <div className="absolute inset-0 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`}
                  className="w-full h-full opacity-80 scale-110 pointer-events-none"
                  allow="autoplay; encrypted-media"
                />
              </div>
            ) : (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75 group-hover:brightness-100"
              />
            )}
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          {/* Content Layer */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider 
                ${item.isCoverStory ? "bg-[#FFAB00] text-black" : "bg-white/10 text-white backdrop-blur-sm"}`}>
                {item.category}
              </span>
              {item.type === "video" && (
                <span className="px-3 py-1 rounded-sm text-xs font-bold bg-red-600 text-white flex items-center gap-1">
                  <Play className="w-3 h-3 fill-current" /> Play
                </span>
              )}
            </div>

            {/* Text Content */}
            <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className={`font-display font-bold text-white leading-tight mb-2
                ${item.isCoverStory ? "text-4xl md:text-5xl lg:text-6xl" : "text-xl md:text-2xl"}`}>
                {item.title}
              </h3>
              
              <p className={`text-gray-300 mb-4 line-clamp-2 ${item.isCoverStory ? "text-lg max-w-2xl" : "text-sm"}`}>
                {item.excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.readTime}</span>
              </div>
            </div>

            {/* Decorative Hover Element */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
               <ArrowUpRight className="w-6 h-6 text-[#FFAB00]" />
            </div>
          </div>
          
          {/* Selection Border Glow */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFAB00]/50 rounded-xl transition-colors duration-300 pointer-events-none" />
      
      </Link>
    </motion.article>
  );
};

export const MixedMediaGrid = () => {
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Zap className="w-6 h-6 text-[#FFAB00]" />
        <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
          The <span className="text-[#FFAB00]">Headlines</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {spotlightItems.map((item) => (
          <SpotlightCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};