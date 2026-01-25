import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Search, Trash2, Plus, Loader2, AlertCircle, 
  CheckCircle, RefreshCw, X, Sparkles, Film, Mic, 
  Users, Building2, Crown, ChevronLeft, ChevronRight,
  ExternalLink, Eye, Zap
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { ProfileViewModal } from "@/components/ProfileViewModal";
import {
  useFeaturedPosts,
  useAddToFeatured,
  useRemoveFromFeatured,
  useAdminPostsByType,
  useAdminStudios,
  useAdminPremiumPortfolios,
  useAdminPortfolioSearch,
  useFeaturedIds,
} from "@/hooks/useFeatured";
import {
  FeaturedPost,
  FeaturedPostType,
  getFeaturedDisplayName,
  getFeaturedThumbnail,
  getFeaturedEntityId,
  FEATURED_TYPE_LABELS,
  FEATURED_TYPE_COLORS,
} from "@/types/featured";
import { PostType } from "@/types/api";
import { useNavigate } from "react-router-dom";

// ============================================
// TAB CONFIG
// ============================================
const TABS = [
  { id: FeaturedPostType.REVIEWS, label: "Reviews", icon: Star, postType: PostType.REVIEWS },
  { id: FeaturedPostType.PODCASTS, label: "Podcasts", icon: Mic, postType: PostType.PODCASTS },
  { id: FeaturedPostType.DOCUMENTARIES, label: "Documentaries", icon: Film, postType: PostType.DOCUMENTARIES },
  { id: FeaturedPostType.STUDIOS, label: "Studios", icon: Building2, postType: null },
  { id: FeaturedPostType.PORTFOLIOS, label: "Portfolios", icon: Users, postType: null },
];

// ============================================
// FEATURED CARD COMPONENT
// ============================================
const FeaturedCard = ({ 
  featured, 
  onRemove, 
  onPreview,
  isRemoving 
}: { 
  featured: FeaturedPost; 
  onRemove: () => void;
  onPreview: () => void;
  isRemoving: boolean;
}) => {
  const thumbnail = getFeaturedThumbnail(featured);
  const name = getFeaturedDisplayName(featured);
  const color = FEATURED_TYPE_COLORS[featured.postType];
  const label = FEATURED_TYPE_LABELS[featured.postType];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group flex-shrink-0 w-64 h-80 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden cursor-pointer"
      style={{ boxShadow: `0 0 30px ${color}20` }}
    >
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${color}30, transparent 70%)` 
        }}
      />

      {/* Thumbnail */}
      <div className="relative h-40 bg-black/50 overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Sparkles className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Type Badge */}
        <div 
          className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {label}
        </div>

        {/* Premium Badge (for portfolios) */}
        {featured.portfolioDetails?.isPremium && (
          <div className="absolute top-3 right-3 p-1.5 bg-[#FFAB00]/20 rounded-full">
            <Crown className="w-4 h-4 text-[#FFAB00]" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg text-white truncate">{name}</h3>
        
        {/* Subtitle based on type */}
        <p className="text-sm text-gray-400 truncate">
          {featured.postDetails?.description || 
           featured.portfolioDetails?.shortDescription || 
           featured.studioDetails?.city || 
           "Featured item"}
        </p>

        {/* Featured At */}
        <p className="text-xs text-gray-500 font-mono">
          Featured: {new Date(featured.featuredAt).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          disabled={isRemoving}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors disabled:opacity-50"
          title="Remove from Featured"
        >
          {isRemoving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: color }} />
    </motion.div>
  );
};

// ============================================
// SELECTABLE ITEM CARD
// ============================================
const SelectableCard = ({
  id,
  title,
  subtitle,
  thumbnail,
  isFeatured,
  isPremium,
  onAdd,
  isAdding,
}: {
  id: number;
  title: string;
  subtitle: string;
  thumbnail: string | null;
  isFeatured: boolean;
  isPremium?: boolean;
  onAdd: () => void;
  isAdding: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className={`relative group bg-[#0a0a0a] border rounded-lg overflow-hidden transition-all ${
        isFeatured 
          ? "border-[#FFAB00]/50 opacity-60" 
          : "border-white/10 hover:border-[#FFAB00]/30"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-black/50 overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Sparkles className="w-8 h-8 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-2 right-2 p-1 bg-[#FFAB00]/20 rounded-full">
            <Crown className="w-3 h-3 text-[#FFAB00]" />
          </div>
        )}

        {/* Already Featured Indicator */}
        {isFeatured && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFAB00]/20 rounded-full text-[#FFAB00]">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Featured</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <h4 className="font-medium text-white text-sm truncate">{title}</h4>
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>

      {/* Add Button */}
      {!isFeatured && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          disabled={isAdding}
          className="absolute bottom-3 right-3 p-2 bg-[#FFAB00] hover:bg-white text-black rounded-lg transition-colors disabled:opacity-50"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminFeatured() {
  const navigate = useNavigate();
  
  // State
  const [activeTab, setActiveTab] = useState<FeaturedPostType>(FeaturedPostType.REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  
  // Portfolio Preview Modal
  const [previewPortfolioId, setPreviewPortfolioId] = useState<number | null>(null);
  const [previewDeveloper, setPreviewDeveloper] = useState<any>(null);

  // Fetch all featured posts
  const { data: allFeatured, isLoading: loadingFeatured, refetch: refetchFeatured } = useFeaturedPosts();
  
  // Mutations
  const addToFeatured = useAddToFeatured();
  const removeFromFeatured = useRemoveFromFeatured();
  
  // Get current tab config
  const currentTab = TABS.find(t => t.id === activeTab)!;
  
  // Fetch items for current tab
  const { data: posts, isLoading: loadingPosts } = useAdminPostsByType(
    currentTab.postType!,
    50,
    { enabled: !!currentTab.postType }
  );
  
  const { data: studiosData, isLoading: loadingStudios } = useAdminStudios(
    0, 50,
    { enabled: activeTab === FeaturedPostType.STUDIOS }
  );
  
  const { data: premiumPortfolios, isLoading: loadingPremium } = useAdminPremiumPortfolios(
    0, 50,
    { enabled: activeTab === FeaturedPostType.PORTFOLIOS }
  );
  
  const { data: searchResults, isLoading: loadingSearch } = useAdminPortfolioSearch(
    searchQuery,
    0, 20,
    { enabled: activeTab === FeaturedPostType.PORTFOLIOS && searchQuery.length >= 2 }
  );

  // Get featured IDs for current type
  const featuredIds = useFeaturedIds(activeTab);

  // Filter featured by current tab for the rail
  const currentFeatured = useMemo(() => {
    if (!allFeatured) return [];
    return allFeatured.filter(f => f.postType === activeTab);
  }, [allFeatured, activeTab]);

  // Get items for selection grid
  const selectableItems = useMemo(() => {
    if (activeTab === FeaturedPostType.STUDIOS) {
      return (studiosData?.content || []).map(s => ({
        id: s.id,
        title: s.studioName,
        subtitle: `${s.city}, ${s.country}`,
        thumbnail: s.studioLogoUrl || null,
        isPremium: false,
      }));
    }
    
    if (activeTab === FeaturedPostType.PORTFOLIOS) {
      // Show search results if searching, else show premium
      const items = searchQuery.length >= 2 
        ? (searchResults?.content || [])
        : (premiumPortfolios || []);
      
      return items.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: p.shortDescription || p.location || "",
        thumbnail: p.profilePhotoUrl,
        isPremium: p.isPremium,
      }));
    }
    
    // Blog posts
    return (posts || []).map(p => ({
      id: p.id,
      title: p.title,
      subtitle: p.description,
      thumbnail: p.thumbnailUrl,
      isPremium: false,
    }));
  }, [activeTab, posts, studiosData, premiumPortfolios, searchResults, searchQuery]);

  // Handle add to featured
  const handleAdd = async (id: number) => {
    setAddingId(id);
    try {
      await addToFeatured.mutateAsync({ type: activeTab, id });
    } finally {
      setAddingId(null);
    }
  };

  // Handle remove from featured
  const handleRemove = async (featured: FeaturedPost) => {
    const entityId = getFeaturedEntityId(featured);
    setRemovingId(entityId);
    try {
      await removeFromFeatured.mutateAsync({ type: featured.postType, id: entityId });
    } finally {
      setRemovingId(null);
    }
  };

  // Handle preview
  const handlePreview = (featured: FeaturedPost) => {
    if (featured.postDetails) {
      // Navigate to article page
      navigate(`/content/${featured.postType.toLowerCase()}/${featured.postDetails.id}`);
    } else if (featured.portfolioDetails) {
      // Open portfolio modal
      setPreviewPortfolioId(featured.portfolioDetails.id);
      setPreviewDeveloper({
        id: featured.portfolioDetails.id,
        name: featured.portfolioDetails.name,
        role: featured.portfolioDetails.shortDescription || "",
        location: featured.portfolioDetails.location || "",
        avatar: featured.portfolioDetails.profilePhotoUrl || "",
        status: featured.portfolioDetails.jobStatus || "",
        exp: featured.portfolioDetails.experienceYears ? `${featured.portfolioDetails.experienceYears} Yrs` : "",
        isPremium: featured.portfolioDetails.isPremium,
      });
    } else if (featured.studioDetails) {
      // Navigate to studios page (could open sheet)
      navigate("/studios");
    }
  };

  const isLoading = loadingPosts || loadingStudios || loadingPremium || loadingSearch;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-white flex items-center gap-3">
                <Zap className="w-10 h-10 text-[#FFAB00]" />
                Featured <span className="text-gradient-gold">Command Center</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Manage featured content displayed on the homepage hero section
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => refetchFeatured()}
              disabled={loadingFeatured}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loadingFeatured ? "animate-spin" : ""}`} />
              Refresh
            </motion.button>
          </motion.div>

          {/* Current Featured Rail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FFAB00]" />
                Currently Featured
                <span className="text-sm font-mono text-gray-500 ml-2">
                  ({allFeatured?.length || 0} items)
                </span>
              </h2>
            </div>

            {/* Horizontal Scrollable Rail */}
            <div className="relative">
              {/* Gradient Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              
              <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex gap-4">
                  {loadingFeatured ? (
                    // Loading skeletons
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-64 h-80 bg-white/5 rounded-xl animate-pulse" />
                    ))
                  ) : allFeatured && allFeatured.length > 0 ? (
                    allFeatured.map((featured) => (
                      <FeaturedCard
                        key={`${featured.postType}-${getFeaturedEntityId(featured)}`}
                        featured={featured}
                        onRemove={() => handleRemove(featured)}
                        onPreview={() => handlePreview(featured)}
                        isRemoving={removingId === getFeaturedEntityId(featured)}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center w-full py-16 text-gray-500">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>No featured content yet</p>
                        <p className="text-sm">Add items from the tabs below</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Add to Featured Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-display text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FFAB00]" />
                Add to Featured
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Select content to feature on the homepage
              </p>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-white/10 scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const count = allFeatured?.filter(f => f.postType === tab.id).length || 0;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchQuery("");
                    }}
                    className={`relative flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      isActive 
                        ? "text-[#FFAB00]" 
                        : "text-gray-400 hover:text-white"
                    }`}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {count > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#FFAB00]/20 text-[#FFAB00] rounded-full">
                        {count}
                      </span>
                    )}
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFAB00]"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Search Bar (for Portfolios) */}
            {activeTab === FeaturedPostType.PORTFOLIOS && (
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search portfolios by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 pl-10 pr-4 py-3 rounded-lg text-white placeholder:text-gray-500 focus:border-[#FFAB00] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Crown className="w-4 h-4 text-[#FFAB00]" />
                    <span>Showing premium portfolios by default</span>
                  </div>
                </div>
              </div>
            )}

            {/* Content Grid */}
            <div className="p-6">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-48 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : selectableItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <AnimatePresence mode="popLayout">
                    {selectableItems.map((item, index) => (
                      <SelectableCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        subtitle={item.subtitle}
                        thumbnail={item.thumbnail}
                        isFeatured={featuredIds.has(item.id)}
                        isPremium={item.isPremium}
                        onAdd={() => handleAdd(item.id)}
                        isAdding={addingId === item.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <AlertCircle className="w-12 h-12 mb-4 opacity-30" />
                  <p>No items found</p>
                  {activeTab === FeaturedPostType.PORTFOLIOS && searchQuery.length > 0 && searchQuery.length < 2 && (
                    <p className="text-sm">Type at least 2 characters to search</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Portfolio Preview Modal */}
          <ProfileViewModal
            isOpen={!!previewPortfolioId}
            onClose={() => {
              setPreviewPortfolioId(null);
              setPreviewDeveloper(null);
            }}
            developer={previewDeveloper}
            portfolioId={previewPortfolioId}
          />
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </PageTransition>
  );
}
