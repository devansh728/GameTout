import { motion } from "framer-motion";
import { Play, Clock, User, ArrowRight } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { ThreeDCard } from "@/components/ThreeDCard";
import { Footer } from "@/components/Footer";
import { StickyVideoPlayer } from "@/components/StickyVideoPlayer";

const featuredDoc = {
  title: "The Making of Indian Gaming",
  description: "A deep dive into how Indian game developers are creating world-class games against all odds. From Mumbai basements to global recognition.",
  videoId: "dQw4w9WgXcQ",
  duration: "45:32",
  views: "1.2M",
};

const documentaries = [
  {
    id: 1,
    title: "From Pixels to Glory: The Raji Story",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
    duration: "32:15",
    author: "GameTout Originals",
    views: "890K",
  },
  {
    id: 2,
    title: "Esports India: The Underground Revolution",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
    duration: "28:45",
    author: "GameTout Originals",
    views: "654K",
  },
  {
    id: 3,
    title: "Mobile Gaming Boom: India's Secret Weapon",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600",
    duration: "41:20",
    author: "GameTout Originals",
    views: "1.1M",
  },
  {
    id: 4,
    title: "Indie Dreams: Stories from Game Jams",
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=600",
    duration: "25:00",
    author: "GameTout Originals",
    views: "432K",
  },
];

// Feature 3: Director's Mode scrollytelling chapters
const scrollytellingChapters = [
  {
    id: "chapter-1",
    title: "The Early Days",
    timestamp: 0,
    content: "In 2015, a small team of passionate developers gathered in a modest office in Pune. They had a dream: to create a game that would showcase Indian mythology to the world. With limited resources but unlimited ambition, they began their journey.",
  },
  {
    id: "chapter-2",
    title: "The Challenges",
    timestamp: 120,
    content: "Funding was scarce. International publishers didn't believe in Indian studios. The team worked long hours, often without pay, fueled only by their passion for gaming and their cultural heritage. Many doubted their vision.",
  },
  {
    id: "chapter-3",
    title: "The Breakthrough",
    timestamp: 240,
    content: "After years of development, Raji: An Ancient Epic was released. The response was overwhelming. Critics praised its beautiful visuals, engaging gameplay, and authentic representation of Indian mythology. The team had achieved the impossible.",
  },
  {
    id: "chapter-4",
    title: "The Legacy",
    timestamp: 360,
    content: "Today, Nodding Heads Games stands as a beacon of hope for aspiring Indian developers. Their success has inspired a new generation of creators to tell their own stories, proving that world-class games can come from anywhere.",
  },
];

const Documentary = () => {
  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        {/* Featured Documentary - Netflix Style */}
        <section className="relative h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920"
              alt="Featured Documentary"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex items-center px-4 md:px-16 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                Featured Documentary
              </span>
              <h1 className="font-display text-5xl md:text-7xl mb-6">
                {featuredDoc.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl">
                {featuredDoc.description}
              </p>
              
              <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {featuredDoc.duration}
                </span>
                <span>{featuredDoc.views} views</span>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-8 py-4 border border-border rounded-lg font-medium hover:bg-muted/50"
                >
                  More Info
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature 3: Director's Mode - Scrollytelling */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <FadeInView>
            <h2 className="font-display text-4xl mb-4">
              Director's <span className="text-gradient-gold">Mode</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-xl">
              An immersive scrollytelling experience. Watch as the story unfolds.
            </p>
          </FadeInView>

          <StickyVideoPlayer
            videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            chapters={scrollytellingChapters}
            title="The Raji Story: Behind the Scenes"
          />
        </section>

        {/* Documentary List */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <FadeInView>
            <h2 className="font-display text-4xl mb-4">
              All <span className="text-gradient-gold">Documentaries</span>
            </h2>
            <p className="text-muted-foreground mb-12 max-w-xl">
              Immersive stories from the heart of Indian gaming culture.
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {documentaries.map((doc, index) => (
              <FadeInView key={doc.id} delay={index * 0.1}>
                <ThreeDCard className="cursor-pointer group">
                  <div className="relative h-64 overflow-hidden rounded-t-lg">
                    <img
                      src={doc.thumbnail}
                      alt={doc.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    
                    {/* Play Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-6 h-6 fill-current text-primary-foreground ml-1" />
                      </div>
                    </motion.div>

                    <span className="absolute bottom-4 right-4 px-2 py-1 rounded bg-background/80 text-xs font-mono">
                      {doc.duration}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {doc.author}
                      </span>
                      <span>{doc.views} views</span>
                    </div>
                  </div>
                </ThreeDCard>
              </FadeInView>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Documentary;
