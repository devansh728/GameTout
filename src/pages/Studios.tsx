import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, ExternalLink, Star, Building, Loader2, AlertCircle,
  Filter, Plus, Search, XCircle, Grid, List, Zap, Globe, ChevronDown,
  Terminal, Wifi, Radio
} from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
// STUDIO CARD COMPONENT
// ============================================
const StudioCard = ({
  studio,
  onClick,
  isAuthenticated,
  index
}: {
  studio: Studio;
  onClick: () => void;
  isAuthenticated: boolean;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group relative cursor-pointer"
  >
    <div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#111111] rounded-lg border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-[#FFAB00]/50 group-hover:shadow-[0_0_30px_rgba(255,171,0,0.15)]">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFAB00]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 group-hover:border-[#FFAB00]/30 transition-colors">
            {studio.studioLogoUrl ? (
              <img
                src={studio.studioLogoUrl}
                alt={studio.studioName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm sm:text-base text-white group-hover:text-[#FFAB00] transition-colors truncate">
              {studio.studioName}
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0 text-[#FFAB00]" />
              <span className="truncate">{studio.city}, {studio.country}</span>
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3 p-2 rounded bg-white/5 border border-white/5">
          <CompactStarRating rating={Math.round(studio.ratings)} size="sm" />
          <span className="text-xs font-mono text-[#FFAB00]">{studio.ratings.toFixed(1)}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            {formatEmployeeCount(studio.employeesCount)}
          </span>

          <motion.span
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2 py-1 text-[10px] bg-[#FFAB00]/10 text-[#FFAB00] rounded-full font-bold uppercase tracking-wide"
          >
            <Star className="w-3 h-3" />
            {isAuthenticated ? "Rate" : "View"}
          </motion.span>
        </div>
      </div>
    </div>
  </motion.div>
);

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    statsService.getStudiosCount().then(res => setTotalStudios(res.data.count));
  }, []);

  const { data, isLoading, isError, refetch } = useStudios(page, 12, filters);
  const { countries, cities } = useStudioFilters();
  const { createRequest, loading: submitting, error: submitError, success: submitSuccess, reset } = useStudioMutation();

  const studios = data?.content || [];

  // Filter studios by search query (client-side)
  const filteredStudios = searchQuery.trim()
    ? studios.filter(s =>
        s.studioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : studios;

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

  const hasActiveFilters = filters.country || filters.city || filters.ratings;

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-20 selection:bg-[#FFAB00] selection:text-black relative overflow-hidden">

        {/* HeroTagline */}
        <HeroTagline
          phrase="Register Your Studio for Free"
          size="sm"
          className="mb-4"
        />

        {/* Background Effects */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 171, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 171, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background" />

        {/* Compact Header */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Title & Stats */}
            <div className="flex items-center gap-4">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight">
                Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] via-yellow-400 to-[#FFAB00]">Studios</span>
              </h1>

              {/* Stats Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Building className="w-3 h-3 text-[#FFAB00]" />
                <span className="text-[10px] font-mono text-gray-400">
                  <span className="text-white font-bold"><AnimatedCounter value={totalStudios} /></span> Listed
                </span>
              </div>
            </div>

            {/* Right: Submit CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSubmitModalOpen(true)}
              className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] text-black font-bold uppercase text-xs tracking-wide overflow-hidden rounded-sm shadow-[0_0_20px_rgba(255,171,0,0.3)] hover:shadow-[0_0_30px_rgba(255,171,0,0.5)] transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Studio</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                animate={{ translateX: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.button>
          </div>

          {/* Tagline */}
          <p className="text-xs sm:text-sm text-gray-500 font-mono mt-2">
            {'>'} Discover India's thriving game development ecosystem
          </p>
        </section>

        {/* Control Deck - Sticky Filters */}
        <section className="sticky top-20 z-40 mb-6">
          <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFAB00]/30 to-transparent" />

          <div className="relative px-4 md:px-8 max-w-7xl mx-auto py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search studios..."
                  className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFAB00]/50 focus:bg-white/[0.06] transition-all duration-300 font-mono placeholder:text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-gray-500 hover:text-white" />
                  </motion.button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-gray-500">
                  <Filter className="w-3.5 h-3.5" />
                </div>

                {/* Country Filter */}
                <select
                  value={filters.country || ""}
                  onChange={(e) => handleFilterChange("country", e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFAB00]/50 focus:outline-none font-mono cursor-pointer"
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
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFAB00]/50 focus:outline-none font-mono cursor-pointer"
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
                  className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFAB00]/50 focus:outline-none font-mono cursor-pointer"
                >
                  <option value="">All Ratings</option>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>{rating}+ Stars</option>
                  ))}
                </select>

                {/* Clear Filters */}
                <AnimatePresence>
                  {hasActiveFilters && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={() => setFilters({})}
                      className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#FFAB00] hover:bg-[#FFAB00]/10 rounded-lg transition-colors"
                    >
                      <XCircle className="w-3 h-3" />
                      Clear
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Studio Grid */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20 min-h-[400px] relative z-10">

          {/* Section Header */}
          <div className="flex items-center gap-2 mb-4 text-gray-500 font-mono text-xs uppercase">
            <Terminal className="w-3 h-3 text-[#FFAB00]" />
            <span className="text-white">Studios</span>
            <span>•</span>
            <span className="text-[#FFAB00]">{filteredStudios.length}</span>
            <span>results</span>
            {isLoading && <Loader2 className="w-3 h-3 text-[#FFAB00] animate-spin ml-2" />}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="aspect-[4/3] bg-white/5 rounded-lg animate-pulse border border-white/5" />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="w-12 h-12 text-red-500/50 mb-4" />
              <h3 className="font-display text-xl text-white mb-2">CONNECTION FAILED</h3>
              <p className="text-gray-500 font-mono text-sm mb-6">Failed to load studios</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch()}
                className="px-6 py-2 bg-[#FFAB00] text-black font-bold uppercase text-sm rounded"
              >
                Retry
              </motion.button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && filteredStudios.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building className="w-12 h-12 text-gray-700 mb-4" />
              <h3 className="font-display text-xl text-white mb-2">NO STUDIOS FOUND</h3>
              <p className="text-gray-500 font-mono text-sm">
                {searchQuery ? `No results for "${searchQuery}"` : "Try adjusting your filters"}
              </p>
            </div>
          )}

          {/* Studios Grid */}
          {!isLoading && !isError && filteredStudios.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredStudios.map((studio, index) => (
                  <StudioCard
                    key={studio.id}
                    studio={studio}
                    onClick={() => setSelectedStudio(studio)}
                    isAuthenticated={isAuthenticated}
                    index={index}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:border-[#FFAB00]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </motion.button>
                  <span className="text-xs text-gray-500 font-mono">
                    {page + 1} / {data.totalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(p => p + 1)}
                    disabled={data.last}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:border-[#FFAB00]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Studio Details Sheet */}
        <Sheet open={!!selectedStudio} onOpenChange={() => setSelectedStudio(null)}>
          <SheetContent className="bg-[#0a0a0a] border-[#FFAB00]/20 overflow-y-auto">
            {selectedStudio && (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                      {selectedStudio.studioLogoUrl ? (
                        <img
                          src={selectedStudio.studioLogoUrl}
                          alt={selectedStudio.studioName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <SheetTitle className="font-display text-xl text-white">
                        {selectedStudio.studioName}
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3 text-[#FFAB00]" />
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
                      <h4 className="font-display text-base text-white mb-2">About</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {selectedStudio.description || selectedStudio.studioDescription}
                      </p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <Users className="w-4 h-4 text-[#FFAB00] mb-1" />
                      <p className="text-[10px] text-gray-500 uppercase">Employees</p>
                      <p className="text-sm font-medium text-white">{formatEmployeeCount(selectedStudio.employeesCount)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <MapPin className="w-4 h-4 text-[#FFAB00] mb-1" />
                      <p className="text-[10px] text-gray-500 uppercase">Location</p>
                      <p className="text-sm font-medium text-white">{selectedStudio.city}</p>
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
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FFAB00] text-black rounded-lg font-bold uppercase text-sm"
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