import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, User, ThumbsUp } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { HexagonBadge } from "@/components/HexagonBadge";
import { Footer } from "@/components/Footer";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { WeaponWheel } from "@/components/WeaponWheel";
import { MissionBriefingMode } from "@/components/MissionBriefingMode";

const reviews = [
  {
    id: 1,
    title: "Raji: An Ancient Epic - A Cultural Triumph",
    excerpt: "Nodding Heads Games delivers a stunning action-adventure that proves Indian mythology can rival any Western fantasy in video game form.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
    score: 8.5,
    author: "Arjun Mehta",
    readTime: "12 min",
    likes: 2340,
    platform: "PC, Switch, PS4, Xbox",
  },
  {
    id: 2,
    title: "Kena: Bridge of Spirits - Visual Masterpiece",
    excerpt: "Ember Lab's debut title sets a new standard for indie games with its Pixar-quality animation and heartfelt storytelling.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    score: 9.0,
    author: "Priya Sharma",
    readTime: "10 min",
    likes: 3120,
    platform: "PC, PS5, PS4",
  },
  {
    id: 3,
    title: "BGMI Season 3 - Still Dominating Mobile",
    excerpt: "Krafton's battle royale continues to evolve with new features and maps that keep millions of Indian players engaged.",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400",
    score: 7.5,
    author: "Vikram Singh",
    readTime: "8 min",
    likes: 1890,
    platform: "iOS, Android",
  },
  {
    id: 4,
    title: "Sifu - The Mastery of Martial Arts Games",
    excerpt: "Sloclap's roguelike brawler demands perfection and rewards patience with one of the most satisfying combat systems ever created.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
    score: 8.8,
    author: "Neha Kapoor",
    readTime: "15 min",
    likes: 2780,
    platform: "PC, PS5, PS4, Switch",
  },
  {
    id: 5,
    title: "Stray - A Cat's Eye View of the Apocalypse",
    excerpt: "BlueTwelve Studio crafts an unforgettable adventure that proves the best protagonists don't need to be human.",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400",
    score: 8.2,
    author: "Rahul Dev",
    readTime: "9 min",
    likes: 4210,
    platform: "PC, PS5, PS4",
  },
];

const Reviews = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const gameplayRef = useRef<HTMLDivElement>(null);
  const graphicsRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      story: storyRef,
      gameplay: gameplayRef,
      graphics: graphicsRef,
      verdict: verdictRef,
    };
    refs[sectionId]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageTransition>
      <MissionBriefingMode articleTitle="Game Reviews">
        <main className="min-h-screen bg-background pt-20">
          {/* Header */}
          <section className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
            <FadeInView>
              <h1 className="font-display text-5xl md:text-6xl mb-4">
                Expert <span className="text-gradient-gold">Reviews</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                In-depth analysis and honest opinions from our team of gaming journalists. 
                No sponsored scores, no bias—just the truth.
              </p>
            </FadeInView>
          </section>

          {/* Feature 4: Comparison Slider (RTX On/Off) */}
          <section className="px-4 md:px-8 max-w-5xl mx-auto mb-20">
            <FadeInView>
              <h2 className="font-display text-3xl mb-4">
                Graphics <span className="text-gradient-gold">Comparison</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Drag the slider to compare graphics quality. Touch-friendly on mobile!
              </p>
            </FadeInView>
            <ComparisonSlider
              beforeImage="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=60"
              afterImage="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=100"
              beforeLabel="QUALITY: LOW"
              afterLabel="QUALITY: ULTRA"
              className="aspect-video"
            />
          </section>

          {/* Review Sections with refs for Weapon Wheel navigation */}
          {/* <div ref={storyRef} id="story" className="px-4 md:px-8 max-w-5xl mx-auto mb-16">
            <FadeInView>
              <h2 className="font-display text-3xl mb-4 text-primary">STORY</h2>
              <p className="text-muted-foreground leading-relaxed">
                The narrative takes players on an emotional journey through ancient Indian mythology. 
                The storytelling is both authentic and accessible, weaving together classic tales 
                with modern game design sensibilities.
              </p>
            </FadeInView>
          </div> */}

          {/* <div ref={gameplayRef} id="gameplay" className="px-4 md:px-8 max-w-5xl mx-auto mb-16">
            <FadeInView>
              <h2 className="font-display text-3xl mb-4 text-primary">GAMEPLAY</h2>
              <p className="text-muted-foreground leading-relaxed">
                Combat feels responsive and satisfying, with a variety of weapons and abilities 
                that encourage experimentation. The difficulty curve is well-balanced, 
                challenging enough to engage without becoming frustrating.
              </p>
            </FadeInView>
          </div> */}

          {/* <div ref={graphicsRef} id="graphics" className="px-4 md:px-8 max-w-5xl mx-auto mb-16">
            <FadeInView>
              <h2 className="font-display text-3xl mb-4 text-primary">GRAPHICS</h2>
              <p className="text-muted-foreground leading-relaxed">
                Visually stunning environments bring the world to life with incredible detail. 
                The art direction perfectly captures the essence of Indian architecture and 
                mythology, creating a truly immersive experience.
              </p>
            </FadeInView>
          </div>

          <div ref={verdictRef} id="verdict" className="px-4 md:px-8 max-w-5xl mx-auto mb-16">
            <FadeInView>
              <h2 className="font-display text-3xl mb-4 text-primary">VERDICT</h2>
              <p className="text-muted-foreground leading-relaxed">
                A must-play for anyone interested in action-adventure games with a unique 
                cultural perspective. Despite minor technical issues, the overall experience 
                is highly recommended.
              </p>
            </FadeInView>
          </div> */}

          {/* Review Feed */}
          <section className="px-4 md:px-8 max-w-5xl mx-auto pb-20">
            <FadeInView>
              <h2 className="font-display text-3xl mb-8">
                Latest <span className="text-gradient-gold">Reviews</span>
              </h2>
            </FadeInView>
            <div className="space-y-8">
              {reviews.map((review, index) => (
                <FadeInView key={review.id} delay={index * 0.1}>
                  <motion.article
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="gaming-card p-6 cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Thumbnail */}
                      <div className="relative w-full md:w-40 h-48 md:h-56 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={review.image}
                          alt={review.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-xs text-primary font-medium uppercase tracking-wider">
                            {review.platform}
                          </span>
                          <h2 className="font-display text-2xl md:text-3xl mt-2 mb-3 group-hover:text-primary transition-colors">
                            {review.title}
                          </h2>
                          <p className="text-muted-foreground line-clamp-2 mb-4">
                            {review.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {review.author}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {review.readTime}
                          </span>
                          <span className="flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4" />
                            {review.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex md:block justify-center">
                        <HexagonBadge score={review.score} size="lg" />
                      </div>
                    </div>
                  </motion.article>
                </FadeInView>
              ))}
            </div>
          </section>

          <Footer />

          {/* Feature 5: Weapon Wheel Navigation */}
          <WeaponWheel onNavigate={handleNavigate} />
        </main>
      </MissionBriefingMode>
    </PageTransition>
  );
};

export default Reviews;
