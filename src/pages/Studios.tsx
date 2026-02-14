import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, ExternalLink, Star, Building, Loader2, AlertCircle, Filter, Plus } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { StudioMap } from "@/components/StudioMap";
import { UserStudioFormModal } from "@/components/UserStudioFormModal";
import { StarRating, CompactStarRating } from "@/components/StarRating";
import { useStudios, useStudioFilters, useStudioMutation } from "@/hooks/useStudios";
import { useStudioRating } from "@/hooks/useStudioRating";
import { Studio, StudioFilters, StudioRequest, formatEmployeeCount } from "@/types/studio";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { statsService } from "@/services/statsService";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroTagline } from "@/components/HeroTagline";

// ============================================
// STUDIO RATING SECTION COMPONENT
// ============================================
interface StudioRatingSectionProps {
  studioId: number;
  initialRating: number;
  initialRatingCount?: number;
  isAuthenticated: boolean;
}

const StudioRatingSection = ({
  studioId,
  initialRating,
  initialRatingCount = 0,
  isAuthenticated,
}: StudioRatingSectionProps) => {
  const { toast } = useToast();
  const {
    myRating,
    stats,
    isLoading,
    isSubmitting,
    submitRating,
    hasRated,
  } = useStudioRating({ studioId, autoFetch: isAuthenticated });

  // Use stats from hook if available, otherwise use initial values
  const averageRating = stats?.averageRating ?? initialRating;
  const ratingCount = stats?.ratingCount ?? initialRatingCount;

  const handleRate = async (rating: number) => {
    try {
      await submitRating(rating);
      toast({
        title: hasRated ? "⭐ Rating Updated!" : "⭐ Rating Submitted!",
        description: `You rated this studio ${rating} star${rating > 1 ? "s" : ""}.`,
      });
    } catch {
      toast({
        title: "❌ Rating Failed",
        description: "Failed to submit your rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h4 className="font-display text-lg mb-3">Community Rating</h4>
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <CompactStarRating rating={Math.round(averageRating)} size="md" />
            {ratingCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
              </span>
            )}
          </div>
          <span className="text-lg font-bold text-primary">
            {averageRating.toFixed(1)}/5
          </span>
        </div>

        {/* Interactive Rating for Authenticated Users */}
        {isAuthenticated ? (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">
                {hasRated ? "Your rating (click to update):" : "Rate this studio:"}
              </p>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
            </div>
            <StarRating
              rating={myRating ?? 0}
              size="lg"
              interactive={!isSubmitting}
              onRate={handleRate}
            />
            {hasRated && myRating && (
              <p className="text-xs text-primary mt-2">
                You rated: {myRating} star{myRating > 1 ? "s" : ""}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground pt-3 border-t border-border/50">
            <span className="text-primary">Login</span> to rate this studio
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Studios = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<StudioFilters>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [totalStudios, setTotalStudios] = useState(0);

  useEffect(() => {
    statsService.getStudiosCount().then(res => setTotalStudios(res.data.count));
  }, []);

  // Fetch studios from API
  const { data, isLoading, isError, refetch } = useStudios(page, 12, filters);
  const { countries, cities } = useStudioFilters();
  const { createRequest, loading: submitting, error: submitError, success: submitSuccess, reset } = useStudioMutation();

  const studios = data?.content || [];

  const handleFilterChange = (key: keyof StudioFilters, value: string) => {
    setPage(0);
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSubmitStudio = async (studioData: StudioRequest) => {
    try {
      await createRequest(studioData);
      toast({
        title: "🎮 Studio Submitted!",
        description: "Your studio has been submitted for review. We'll notify you once it's approved.",
      });
    } catch (err) {
      toast({
        title: "❌ Submission Failed",
        description: "Failed to submit studio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
    reset();
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-20">
        <HeroTagline
          phrase="Register Your Studio for Free"
          size="sm"
          className="mb-4"
        />
        {/* Header */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-12">
          <FadeInView>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="font-display text-5xl md:text-6xl mb-4">
                  Game <span className="text-gradient-gold">Studios</span>
                </h1>
                <div className="flex items-center gap-2 mb-4 text-sm font-mono text-muted-foreground">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary">
                    <Building className="w-3 h-3" />
                  </span>
                  <span className="uppercase tracking-wider">
                    <AnimatedCounter value={totalStudios} /> Studios Listed
                  </span>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Discover India's thriving game development ecosystem. From indie darlings
                  to AAA support studios, these are the companies shaping the industry.
                </p>
              </div>

              {/* Submit Studio CTA */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSubmitModalOpen(true)}
                className="group relative flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/20 to-yellow-500/20 border border-primary/50 rounded-lg hover:border-primary transition-all duration-300 overflow-hidden flex-shrink-0"
              >
                {/* Animated background */}
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                />

                <div className="relative flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-sm text-white group-hover:text-primary transition-colors">
                      Submit Your Studio
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Get listed on GameTout
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>
          </FadeInView>
        </section>

        {/* Feature 7: Interactive Studio Map */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
          <FadeInView>
            <h2 className="font-display text-3xl mb-4">
              Studio <span className="text-gradient-gold">Map</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore game studios across India. Click on the pins to view details.
            </p>
          </FadeInView>
          <StudioMap />
        </section>

        {/* Filters */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
          <FadeInView>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>

              {/* Country Filter */}
              <select
                value={filters.country || ""}
                onChange={(e) => handleFilterChange("country", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Rating Filter */}
              <select
                value={filters.ratings || ""}
                onChange={(e) => handleFilterChange("ratings", e.target.value)}
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Ratings</option>
                {[5, 4, 3, 2, 1].map(rating => (
                  <option key={rating} value={rating}>{rating}+ Stars</option>
                ))}
              </select>

              {(filters.country || filters.city || filters.ratings) && (
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-primary hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </FadeInView>
        </section>

        {/* Studio Grid */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
          <FadeInView>
            <h2 className="font-display text-3xl mb-8">
              All <span className="text-gradient-gold">Studios</span>
              {data && (
                <span className="text-lg text-muted-foreground font-normal ml-3">
                  ({data.totalElements} total)
                </span>
              )}
            </h2>
          </FadeInView>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p className="text-lg mb-4">Failed to load studios</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && studios.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Building className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">No studios found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}

          {/* Studios Grid */}
          {!isLoading && !isError && studios.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studios.map((studio, index) => (
                  <FadeInView key={studio.id} delay={index * 0.05}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedStudio(studio)}
                      className="gaming-card p-6 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {studio.studioLogoUrl ? (
                            <img
                              src={studio.studioLogoUrl}
                              alt={studio.studioName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-xl group-hover:text-primary transition-colors truncate">
                            {studio.studioName}
                          </h3>
                          <p className="text-muted-foreground text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{studio.city}, {studio.country}</span>
                          </p>
                        </div>
                      </div>

                      {/* Rating as Stars */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Community Rating</span>
                          <span className="text-xs font-mono text-primary">{studio.ratings.toFixed(1)}/5</span>
                        </div>
                        <CompactStarRating rating={Math.round(studio.ratings)} size="md" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {formatEmployeeCount(studio.employeesCount)}
                        </span>
                        {isAuthenticated && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudio(studio);
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                          >
                            <Star className="w-3 h-3" />
                            Rate
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  </FadeInView>
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-muted-foreground">
                    Page {page + 1} of {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={data.last}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Studio Details Sheet */}
        <Sheet open={!!selectedStudio} onOpenChange={() => setSelectedStudio(null)}>
          <SheetContent className="bg-card border-border overflow-y-auto">
            {selectedStudio && (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {selectedStudio.studioLogoUrl ? (
                        <img
                          src={selectedStudio.studioLogoUrl}
                          alt={selectedStudio.studioName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <SheetTitle className="font-display text-2xl text-foreground">
                        {selectedStudio.studioName}
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedStudio.city}, {selectedStudio.country}
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Rating Section */}
                  <StudioRatingSection
                    studioId={selectedStudio.id}
                    initialRating={selectedStudio.ratings}
                    initialRatingCount={selectedStudio.ratingCount}
                    isAuthenticated={isAuthenticated}
                  />

                  {/* Description */}
                  {(selectedStudio.description || selectedStudio.studioDescription) && (
                    <div>
                      <h4 className="font-display text-lg mb-3">About</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {selectedStudio.description || selectedStudio.studioDescription}
                      </p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <Users className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="font-medium">{formatEmployeeCount(selectedStudio.employeesCount)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <MapPin className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedStudio.city}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  {selectedStudio.studioWebsiteUrl && (
                    <motion.a
                      href={selectedStudio.studioWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </motion.a>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* User Studio Submit Modal */}
        <UserStudioFormModal
          isOpen={isSubmitModalOpen}
          onClose={handleCloseSubmitModal}
          onSubmit={handleSubmitStudio}
          isSubmitting={submitting}
          error={submitError}
          success={submitSuccess}
        />

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Studios;
