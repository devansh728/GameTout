import { motion } from "framer-motion";
import { ArrowUpRight, Clock, User } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  readTime: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "The Rise of Indian Game Studios: A New Era Begins",
    excerpt: "How homegrown developers are reshaping the global gaming landscape with innovative titles and unique storytelling.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    category: "Industry",
    author: "Arjun Mehta",
    readTime: "8 min",
    featured: true,
  },
  {
    id: 2,
    title: "Exclusive: Behind the Scenes of Mumbai's Largest Game Jam",
    excerpt: "72 hours. 200 developers. One incredible experience.",
    image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=800",
    category: "Events",
    author: "Priya Sharma",
    readTime: "5 min",
  },
  {
    id: 3,
    title: "Review: Raji - Ancient Epic Still Holds Up",
    excerpt: "Revisiting the groundbreaking Indian action-adventure.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    category: "Reviews",
    author: "Rahul Dev",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Unity vs Unreal: The Indian Dev Perspective",
    excerpt: "Which engine dominates in Indian studios and why?",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    category: "Tech",
    author: "Vikram Singh",
    readTime: "10 min",
  },
  {
    id: 5,
    title: "The Future of Esports in India",
    excerpt: "With massive investments flowing in, what's next for competitive gaming?",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800",
    category: "Esports",
    author: "Neha Kapoor",
    readTime: "7 min",
  },
  {
    id: 6,
    title: "Interview: Nodding Heads Games on Their Journey",
    excerpt: "The creators of Raji share their incredible story.",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800",
    category: "Interview",
    author: "Amit Patel",
    readTime: "12 min",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const BentoGrid = () => {
  return (
    <section id="featured" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          Latest <span className="text-gradient-gold">Stories</span>
        </h2>
        <p className="text-muted-foreground max-w-xl">
          Dive into the world of gaming with our curated collection of news, 
          reviews, and exclusive features.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {newsItems.map((item, index) => (
          <motion.article
            key={item.id}
            variants={itemVariants}
            className={`gaming-card group cursor-pointer ${
              item.featured ? "md:col-span-2 md:row-span-2" : ""
            }`}
          >
            <div className={`relative overflow-hidden ${item.featured ? "h-80 md:h-full" : "h-48"}`}>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              {/* Category Badge */}
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground">
                {item.category}
              </span>

              {/* Hover Arrow */}
              <motion.div
                initial={{ opacity: 0, x: -10, y: 10 }}
                whileHover={{ opacity: 1, x: 0, y: 0 }}
                className="absolute top-4 right-4 p-2 rounded-full bg-foreground/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>

            <div className="p-6">
              <h3 className={`font-display ${item.featured ? "text-3xl md:text-4xl" : "text-xl"} mb-3 group-hover:text-primary transition-colors`}>
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {item.excerpt}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {item.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.readTime}
                </span>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-lg" style={{ boxShadow: "0 0 40px hsl(43 100% 50% / 0.1)" }} />
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};
