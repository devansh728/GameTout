import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, ThumbsUp, AlertCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { HexagonBadge } from "@/components/HexagonBadge";
import { Footer } from "@/components/Footer";
import { WeaponWheel } from "@/components/WeaponWheel";
import { MissionBriefingMode } from "@/components/MissionBriefingMode";
import { ReviewSkeleton } from "@/components/SkeletonLoader";
import { VideoPreviewCard } from "@/components/VideoPreviewCard";
import { useReviews, usePrefetchPost } from "@/hooks/useBlogPosts";
import { getPostThumbnail, formatPublishedDate, formatLikes } from "@/utils/mediaUtils";
import { BlogPostFeed } from "@/types/api";
import { statsService } from "@/services/statsService";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const Reviews = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const gameplayRef = useRef<HTMLDivElement>(null);
  const graphicsRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch total count
  useEffect(() => {
    statsService.getReviewsCount().then(res => setTotalReviews(res.data.count));
  }, []);

  // Fetch reviews from API
  const { data: reviews, isLoading, error, refetch } = useReviews(20);
  const prefetchPost = usePrefetchPost();

  const handleNavigate = (sectionId: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      story: storyRef,
      gameplay: gameplayRef,
      graphics: graphicsRef,
      verdict: verdictRef,
    };
    refs[sectionId]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle hover prefetch for better UX
  const handlePostHover = (postId: number) => {
    prefetchPost(postId);
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
              <div className="flex items-center gap-3 mb-6 text-sm font-mono uppercase tracking-widest text-[#FFAB00]">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#FFAB00]/30 bg-[#FFAB00]/10">
                  <Star className="w-4 h-4" />
                </div>
                <span>
                  <AnimatedCounter value={totalReviews} /> Articles Published
                </span>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                In-depth analysis and honest opinions from our team of gaming journalists. 
                No sponsored scores, no bias—just the truth.
              </p>
            </FadeInView>
          </section>

          {/* Feature 4: Comparison Slider (RTX On/Off) */}
          {/* <section className="px-4 md:px-8 max-w-5xl mx-auto mb-20">
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
          </section> */}

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

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <ReviewSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="gaming-card p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-display text-white mb-2">Failed to Load Reviews</h3>
                <p className="text-muted-foreground mb-4">
                  There was an error fetching the reviews. Please try again.
                </p>
                <button 
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-primary text-black font-bold uppercase tracking-wider rounded hover:bg-primary/80 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Reviews List */}
            {!isLoading && !error && reviews && (
              <div className="space-y-8">
                {reviews.map((review: BlogPostFeed, index: number) => (
                  <FadeInView key={review.id} delay={index * 0.1}>
                    <Link to={`/content/review/${review.id}`}>
                      <motion.article
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="gaming-card p-6 cursor-pointer group"
                        onMouseEnter={() => handlePostHover(review.id)}
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Video Preview - Plays video on hover if available, else shows thumbnail */}
                          <VideoPreviewCard
                            videoUrl={review.videoEmbedUrl}
                            thumbnailUrl={getPostThumbnail(review)}
                            alt={review.title}
                            className="relative w-full md:w-40 h-48 md:h-56 rounded-lg shrink-0"
                            mediaClassName="transition-transform duration-500 group-hover:scale-110"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          </VideoPreviewCard>

                          {/* Content */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-xs text-primary font-medium uppercase tracking-wider">
                                {review.postType}
                              </span>
                              <h2 className="font-display text-2xl md:text-3xl mt-2 mb-3 group-hover:text-primary transition-colors">
                                {review.title}
                              </h2>
                              <p className="text-muted-foreground line-clamp-2 mb-4">
                                {review.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {formatPublishedDate(review.publishedAt)}
                              </span>
                              <span className="flex items-center gap-2">
                                <ThumbsUp className="w-4 h-4" />
                                {formatLikes(review.likes)}
                              </span>
                            </div>
                          </div>

                          {/* Score Badge - Using rates as score */}
                          <div className="flex md:block justify-center">
                            <HexagonBadge score={review.rates / 10} size="lg" />
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  </FadeInView>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && reviews?.length === 0 && (
              <div className="gaming-card p-8 text-center">
                <h3 className="text-xl font-display text-white mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground">
                  Check back later for fresh reviews!
                </p>
              </div>
            )}
          </section>

          <Footer />

          {/* Weapon Wheel Navigation */}
          <WeaponWheel onNavigate={handleNavigate} />
        </main>
      </MissionBriefingMode>
    </PageTransition>
  );
};

export default Reviews;
