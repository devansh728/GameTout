import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MapPin, UserPlus, List, Grid, CheckCircle, Clock, XCircle, Zap, Search, Terminal, Filter, Loader2, AlertCircle, RefreshCw, Crown, Sparkles, Shield, Lock, Calendar, Radio, Wifi, Cpu, Signal, Activity, Hexagon, Triangle, Circle } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { CreatePortfolioModal } from "@/components/CreatePortfolioModal";
import { ProfileViewModal } from "@/components/ProfileViewModal";
import { CompactHeader } from "@/components/CompactHeader";
// New Components for redesigned UI
import { BasicPortfolioCard } from "@/components/BasicPortfolioCard";
import { PremiumPortfolioCard } from "@/components/PremiumPortfolioCard";
import { ResponsiveMasonryGrid } from "@/components/MasonryGrid";
import { PricingModal } from "@/components/PricingModal";
import { ClassifiedOverlay } from "@/components/ClassifiedOverlay";

// API Hooks
import { usePortfolios, usePortfolioRails } from "@/hooks/usePortfolios";
import { usePortfolioSearch } from "@/hooks/usePortfolioSearch";
import { useEliteAccess } from "@/hooks/useEliteAccess";
import { Developer } from "@/types/portfolio";

// Demo Data for showcasing new design
import { demoPortfolios, getDemoByCategory } from "@/data/demoPortfolios";
import { toast } from "sonner";
// Portfolio Service for API calls
import { portfolioService } from "@/services/portfolioService";
import { HeroTagline } from "@/components/HeroTagline";
import { useAuth } from "@/context/AuthContext";

// --- FILTER OPTIONS ---
const roles = ["All", "Programmer", "Artist", "Designer", "Audio", "Producer"];

// Rotating categories for the animated tagline
const rotatingCategories = [
  { text: "Game Developers", color: "#FFAB00" },
  { text: "Programmers", color: "#00FF88" },
  { text: "3D Artists", color: "#FF6B6B" },
  { text: "Game Designers", color: "#00D4FF" },
  { text: "Audio Engineers", color: "#A855F7" },
  { text: "Producers", color: "#F97316" },
];

// --- ANIMATED TAGLINE COMPONENT ---
const AnimatedTagline = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % rotatingCategories.length);
        setIsGlitching(false);
      }, 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentCategory = rotatingCategories[currentIndex];

  return (
    <div className="flex items-center gap-2 text-xs md:text-sm font-mono">
      <span className="text-gray-500">{'>'} The centralized mainframe of India's elite</span>
      <div className="relative inline-flex items-center min-w-[140px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`font-bold uppercase tracking-wide ${isGlitching ? "animate-pulse" : ""}`}
            style={{
              color: currentCategory.color,
              textShadow: `0 0 10px ${currentCategory.color}50, 0 0 20px ${currentCategory.color}30`,
            }}
          >
            {currentCategory.text}
          </motion.span>
        </AnimatePresence>

        {/* Glitch overlay effect */}
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center"
          >
            <span
              className="font-bold uppercase tracking-wide opacity-50"
              style={{
                color: currentCategory.color,
                transform: "translateX(2px)",
                filter: "blur(1px)"
              }}
            >
              {currentCategory.text}
            </span>
          </motion.div>
        )}
      </div>

      {/* Blinking cursor */}
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        className="text-[#FFAB00] font-bold"
      >
        _
      </motion.span>
    </div>
  );
};

// --- COMPACT HEADER COMPONENT ---
const DCompactHeader = ({
  onCreateProfile,
  isDemoMode,
  onToggleDemo
}: {
  onCreateProfile: () => void;
  isDemoMode: boolean;
  onToggleDemo: () => void;
}) => {
  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto mb-6 relative z-10">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between gap-4 mb-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"
            />
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider">Live</span>
          </div>

          {/* Connection status */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-600">
            <Wifi className="w-3 h-3 text-[#FFAB00]" />
            <span>SECURE_CONNECTION</span>
            <span className="text-[#FFAB00]">//</span>
            <span>NODE_ACTIVE</span>
          </div>
        </div>

        {/* Demo Mode Toggle - positioned in corner */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleDemo}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${isDemoMode
            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
            : "bg-white/5 text-gray-600 border border-white/10 hover:text-white"
            }`}
        >
          <Radio className="w-3 h-3" />
          {isDemoMode ? "Demo" : "Live"}
        </motion.button>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        {/* Left: Title & Tagline */}
        <div className="flex-1">
          {/* Compact Title */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight leading-none">
              Talent
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] via-yellow-400 to-[#FFAB00] ml-2">
                Network
              </span>
            </h1>

            {/* Stats Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <Zap className="w-3 h-3 text-[#FFAB00]" />
              <span className="text-[10px] font-mono text-gray-400">
                <span className="text-white font-bold">847</span> Active Profiles
              </span>
            </div>
          </div>

          {/* Animated Tagline */}
          <AnimatedTagline />
        </div>

        {/* Right: CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreateProfile}
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] text-black font-bold uppercase text-sm tracking-wide overflow-hidden rounded-sm shadow-[0_0_20px_rgba(255,171,0,0.3)] hover:shadow-[0_0_30px_rgba(255,171,0,0.5)] transition-shadow"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Profile</span>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            animate={{ translateX: ["−100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.button>
      </div>
    </section>
  );
};

// --- COMPONENTS (keeping existing ones) ---

const StatusBadge = ({ status }: { status: string }) => {
  let color = "bg-gray-500";

  if (status === "Open for Work") {
    color = "bg-green-500 shadow-[0_0_10px_#22c55e]";
  } else if (status === "Freelance") {
    color = "bg-[#FFAB00] shadow-[0_0_10px_#FFAB00]";
  } else if (status === "Deployed") {
    color = "bg-red-500";
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${color} bg-opacity-10 border border-current text-[10px] font-bold uppercase tracking-wider text-white`}>
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      {status}
    </div>
  );
};

// Tactical Row for list view
const TacticalRow = ({ dev, onClick, isRestricted, onUnlock }: {
  dev: Developer;
  onClick: () => void;
  isRestricted?: boolean;
  onUnlock?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-black/40 border border-white/5 hover:border-[#FFAB00] rounded-sm transition-all duration-200 hover:bg-white/5 cursor-pointer relative"
    onClick={isRestricted ? onUnlock : onClick}
  >
    {dev.isPremium && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFAB00] shadow-[0_0_10px_#FFAB00]" />}
    <div className="flex items-center gap-4 w-full md:w-1/4">
      <img src={dev.avatar} alt={dev.name} className="w-10 h-10 rounded-full object-cover border border-white/20" loading="lazy" />
      <div>
        <h4 className="font-display text-white text-lg leading-none flex items-center gap-2">
          {dev.name}
          {dev.isPremium && <Crown className="w-4 h-4 text-[#FFAB00]" />}
        </h4>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin className="w-3 h-3" /> {dev.location}
        </div>
      </div>
    </div>
    <div className="w-full md:w-1/4">
      <div className="text-[#FFAB00] font-bold text-sm mb-1">{dev.role}</div>
      <div className="flex gap-1 flex-wrap">
        {dev.badges.map((b: string, i: number) => (
          <span key={i} className="text-[10px] bg-white/10 px-1 rounded text-gray-300">{b}</span>
        ))}
      </div>
    </div>
    <div className="w-full md:w-1/6 flex items-center gap-6 font-mono text-sm">
      {isRestricted ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Lock className="w-4 h-4" />
          <span className="text-xs">Classified</span>
        </div>
      ) : (
        <>
          <div className="text-gray-400">
            <span className="block text-[10px] uppercase">EXP</span>
            <span className="text-white">{dev.exp}</span>
          </div>
          <div className="text-gray-400">
            <span className="block text-[10px] uppercase">Rate</span>
            <span className="text-white">{dev.rate || "N/A"}</span>
          </div>
        </>
      )}
    </div>
    <div className="w-full md:w-1/3 flex items-center justify-between gap-4">
      <StatusBadge status={dev.status} />
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-white/5 hover:bg-[#FFAB00] hover:text-black text-xs font-bold uppercase border border-white/10 transition-colors">
          {isRestricted ? "Unlock" : "View"}
        </button>
      </div>
    </div>
  </motion.div>
);

// SKELETON LOADER for cards
const CardSkeleton = () => (
  <div className="w-[280px] h-[280px] bg-black/40 border border-white/5 rounded-xl animate-pulse">
    <div className="p-6 flex flex-col h-full items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-white/10 mb-4" />
      <div className="w-32 h-5 bg-white/10 rounded mb-2" />
      <div className="w-24 h-4 bg-white/10 rounded mb-4" />
      <div className="w-20 h-8 bg-white/10 rounded" />
    </div>
  </div>
);

// ERROR STATE component
const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <AlertCircle className="w-16 h-16 text-red-500/50 mb-4" />
    <h3 className="font-display text-2xl text-white mb-2">CONNECTION FAILED</h3>
    <p className="text-gray-500 font-mono mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 bg-[#FFAB00] text-black font-bold uppercase hover:bg-white transition-colors"
      >
        <RefreshCw className="w-4 h-4" /> Retry Connection
      </button>
    )}
  </div>
);

// EMPTY STATE component
const EmptyState = ({ category }: { category: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Terminal className="w-16 h-16 text-gray-700 mb-4" />
    <h3 className="font-display text-2xl text-white mb-2">NO OPERATIVES FOUND</h3>
    <p className="text-gray-500 font-mono">
      No portfolios in {category === "All" ? "the database" : `${category} division`} yet.
    </p>
  </div>
);

// Elite Access Banner (Compact version)
// const EliteAccessBanner = ({ 
//   isElite, 
//   onUpgrade,
//   daysRemaining = 0,
//   isExpiringSoon = false,
// }: { 
//   isElite: boolean; 
//   onUpgrade: () => void;
//   daysRemaining?: number;
//   isExpiringSoon?: boolean;
// }) => {
//   if (isElite) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={`flex items-center justify-between gap-3 px-4 py-2 mb-4 rounded-sm ${
//           isExpiringSoon 
//             ? "bg-gradient-to-r from-orange-500/10 to-transparent border-l-2 border-orange-500" 
//             : "bg-gradient-to-r from-[#FFAB00]/10 to-transparent border-l-2 border-[#FFAB00]"
//         }`}
//       >
//         <div className="flex items-center gap-2">
//           <Crown className={`w-4 h-4 ${isExpiringSoon ? "text-orange-500" : "text-[#FFAB00]"}`} />
//           <span className={`font-bold uppercase text-xs tracking-wide ${isExpiringSoon ? "text-orange-500" : "text-[#FFAB00]"}`}>
//             Elite Active
//           </span>
//         </div>
//         {daysRemaining > 0 && (
//           <div className="flex items-center gap-2 text-xs">
//             <span className={isExpiringSoon ? "text-orange-400" : "text-gray-400"}>
//               {daysRemaining}d left
//             </span>
//             {isExpiringSoon && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={onUpgrade}
//                 className="px-2 py-0.5 bg-orange-500 text-black text-[10px] font-bold uppercase rounded"
//               >
//                 Renew
//               </motion.button>
//             )}
//           </div>
//         )}
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="flex items-center justify-between gap-4 px-4 py-3 bg-gradient-to-r from-[#FFAB00]/5 via-[#FFAB00]/10 to-transparent border border-[#FFAB00]/20 rounded-sm mb-4"
//     >
//       <div className="flex items-center gap-3">
//         <Shield className="w-5 h-5 text-[#FFAB00]" />
//         <div>
//           <span className="text-white font-bold text-sm">Unlock Full Access</span>
//           <span className="text-gray-500 text-xs ml-2 hidden md:inline">• Complete profiles & contact info</span>
//         </div>
//       </div>
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={onUpgrade}
//         className="px-4 py-1.5 bg-gradient-to-r from-[#FFAB00] to-[#FFD700] text-black font-bold uppercase text-xs rounded-sm shadow-[0_0_15px_rgba(255,171,0,0.3)]"
//       >
//         <Crown className="w-3 h-3 inline mr-1" />
//         Get Elite
//       </motion.button>
//     </motion.div>
//   );
// };

const Portfolios = () => {
  const [activeRole, setActiveRole] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
  const [selectedDevId, setSelectedDevId] = useState<number | null>(null);
  const [showClassified, setShowClassified] = useState(false);

  const [myProfileData, setMyProfileData] = useState<any>(null);
  const [isFetchingMyProfile, setIsFetchingMyProfile] = useState(false);

  // Environment-controlled demo mode
  const showDemoFeature = import.meta.env.VITE_SHOW_DEMO === 'true';
  const [isDemoMode, setIsDemoMode] = useState(showDemoFeature);
  // Portfolio count state
  const [totalProfiles, setTotalProfiles] = useState(0);

  const { dbUser } = useAuth();
  // Elite Access Hook
  const {
    isElite,
    isAuthenticated,
    canViewFullProfile,
    upgradeToElite,
    refreshStatus,
    daysRemaining,
    isExpiringSoon,
  } = useEliteAccess({ demoMode: isDemoMode });

  // API Hooks
  const {
    developers: apiDevelopers,
    loading: listLoading,
    error: listError,
    getByCategory,
    fetchPortfolios,
    refresh: refreshList
  } = usePortfolios({ category: activeRole, autoFetch: !isDemoMode });

  const {
    rails,
    loading: railsLoading,
    error: railsError,
    refresh: refreshRails
  } = usePortfolioRails();

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    searchQuery,
    setSearchQuery,
    isSearching,
    totalResults,
    clear: clearSearch
  } = usePortfolioSearch({ debounceMs: 300, minChars: 2 });

  useEffect(() => {
    // Wipe local state clean
    setMyProfileData(null);
    setSelectedDev(null);
    setSelectedDevId(null);
    setShowClassified(false);
  }, [dbUser?.id, isAuthenticated]);

  // Fetch total portfolio count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (isDemoMode) {
          setTotalProfiles(demoPortfolios.length);
        } else {
          const { count } = await portfolioService.getCount();
          setTotalProfiles(count);
        }
      } catch (error) {
        // Fallback to demo count on error
        setTotalProfiles(demoPortfolios.length);
      }
    };
    fetchCount();
  }, [isDemoMode]);

  // Determine data source (demo or API)
  const developers = useMemo(() => {
    if (isDemoMode) {
      return activeRole === "All" ? demoPortfolios : getDemoByCategory(activeRole);
    }
    return apiDevelopers;
  }, [isDemoMode, activeRole, apiDevelopers]);

  // Determine which data to show
  const isSearchActive = searchQuery.length >= 2;
  const displayDevelopers = useMemo(() => {
    if (isSearchActive) {
      if (isDemoMode) {
        const query = searchQuery.toLowerCase();
        return demoPortfolios.filter(d =>
          d.name.toLowerCase().includes(query) ||
          d.role.toLowerCase().includes(query) ||
          d.badges.some(b => b.toLowerCase().includes(query))
        );
      }
      return searchResults;
    }
    return developers;
  }, [isSearchActive, isDemoMode, searchQuery, searchResults, developers]);

  const isRestricted = !isElite && isAuthenticated;

  const handleSelectDev = (dev: Developer) => {
    if (isRestricted && !canViewFullProfile(dev.id)) {
      setSelectedDev(dev);
      setShowClassified(true);
    } else {
      setSelectedDev(dev);
      setSelectedDevId(dev.id);
    }
  };

  const handleUnlockClick = () => {
    setIsPricingOpen(true);
  };

  const handlePlanSelect = async (plan: "viewer" | "creator") => {
    await upgradeToElite(plan);
    await refreshStatus();
    setShowClassified(false);
  };

  const handleCategoryChange = (category: string) => {
    setActiveRole(category);
    clearSearch();
    if (!isDemoMode && category !== "All") {
      fetchPortfolios(category, 0);
    }
  };

  const handleMyProfileClick = async () => {

    if (!isAuthenticated) {
      setMyProfileData(null);
      setIsModalOpen(true);
      return;
    }

    setIsFetchingMyProfile(true);

    try {
      const data = await portfolioService.getMyPortfolio();

      if (data === null) {
        // No existing portfolio - open CreatePortfolioModal in CREATE mode
        setMyProfileData(null);
      } else {
        // Portfolio exists - open in EDIT mode with existing data
        setMyProfileData(data);
      }

      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch your profile");
    } finally {
      setIsFetchingMyProfile(false);
    }
  };

  const isLoading = isDemoMode ? false : (activeRole === "All" && !isSearchActive) ? railsLoading : listLoading;
  const error = isDemoMode ? null : (activeRole === "All" && !isSearchActive) ? railsError : listError;

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-20 selection:bg-[#FFAB00] selection:text-black relative overflow-hidden">

        <HeroTagline
          phrase="Create your free portfolio"
          size="sm"
          className="mb-4"
        />

        {/* --- GLOBAL BG EFFECTS (Cyber Grid) --- */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(255, 171, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 171, 0, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background"></div>

        {/* MODALS */}
        <CreatePortfolioModal isOpen={isModalOpen} onClose={() => {
          setIsModalOpen(false);
          setMyProfileData(null);
        }}
          initialData={myProfileData}
          onSuccess={() => {
            if (activeRole === "All") refreshRails();
            else refreshList();
          }}
        />
        {/*<PricingModal 
          isOpen={isPricingOpen} 
          onClose={() => setIsPricingOpen(false)}
          onSelectPlan={handlePlanSelect}
          demoMode={isDemoMode}
        />*/}

        <ProfileViewModal
          isOpen={!!selectedDev && !showClassified}
          onClose={() => {
            setSelectedDev(null);
            setSelectedDevId(null);
          }}
          developer={selectedDev}
          portfolioId={selectedDevId}
        />

        {/* Classified Overlay Modal */}
        <AnimatePresence>
          {showClassified && selectedDev && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => {
                  setShowClassified(false);
                  setSelectedDev(null);
                }}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md"
              >
                <ClassifiedOverlay
                  developer={selectedDev}
                  onUnlock={handleUnlockClick}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NEW COMPACT HEADER */}
        <CompactHeader
          onMyProfileClick={handleMyProfileClick}
          isLoadingMyProfile={isFetchingMyProfile}
          isDemoMode={isDemoMode}
          onToggleDemo={() => setIsDemoMode(!isDemoMode)}
          totalProfiles={totalProfiles}
          showDemoToggle={showDemoFeature}
        />

        {/* CONTROL DECK */}
        <section className="sticky top-20 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-y border-white/10 py-3 mb-6 shadow-2xl">
          <div className="px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-center">

            {/* Search Module */}
            <div className="relative w-full lg:w-1/3 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FFAB00] transition-colors" />
              <input
                type="text"
                placeholder="Search talents..."
                className="w-full bg-black/50 border border-white/10 rounded-sm px-10 py-2 text-sm text-white focus:outline-none focus:border-[#FFAB00] focus:bg-black/80 transition-all font-mono placeholder:text-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isSearching && <Loader2 className="w-4 h-4 text-[#FFAB00] animate-spin" />}
                {searchQuery && !isSearching && (
                  <button
                    onClick={clearSearch}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              {isSearchActive && (
                <div className="absolute -bottom-5 left-0 text-[10px] font-mono text-gray-500">
                  <span className="text-[#FFAB00]">{isDemoMode ? displayDevelopers.length : totalResults}</span> results
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex-1 w-full overflow-x-auto pb-1 scrollbar-none">
              <div className="flex gap-1.5 items-center">
                <Filter className="w-4 h-4 text-gray-600 mr-2 shrink-0" />
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleCategoryChange(role)}
                    className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${activeRole === role
                      ? "bg-[#FFAB00] text-black shadow-[0_0_10px_rgba(255,171,0,0.4)]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-black/50 border border-white/10 p-0.5 shrink-0 gap-0.5 rounded-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === "grid" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === "list" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* DATABASE CONTENT */}
        <section className="px-4 md:px-8 max-w-[1600px] mx-auto pb-20 min-h-[500px] relative z-10">

          {/* Elite Access Banner */}
          {/* <EliteAccessBanner 
            isElite={isElite} 
            onUpgrade={handleUnlockClick} 
            daysRemaining={daysRemaining}
            isExpiringSoon={isExpiringSoon}
          /> */}

          <AnimatePresence mode="wait">

            {/* ERROR STATE */}
            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <ErrorState
                  message={error}
                  onRetry={() => activeRole === "All" ? refreshRails() : refreshList()}
                />
              </motion.div>
            )}

            {/* SEARCH ERROR */}
            {searchError && isSearchActive && !isDemoMode && (
              <motion.div
                key="search-error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <ErrorState message={searchError} onRetry={() => setSearchQuery(searchQuery)} />
              </motion.div>
            )}

            {/* MASONRY GRID VIEW */}
            {viewMode === "grid" && !error ? (
              <motion.div
                key="masonry-grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {/* Category Header - Compact */}
                <div className="flex items-center gap-2 mb-6 text-gray-500 font-mono text-xs uppercase">
                  <Terminal className="w-3 h-3 text-[#FFAB00]" />
                  {isSearchActive ? (
                    <>Searching: <span className="text-white">"{searchQuery}"</span></>
                  ) : (
                    <><span className="text-white">{activeRole}</span> • <span className="text-[#FFAB00]">{displayDevelopers.length}</span> profiles</>
                  )}
                  {isLoading && <Loader2 className="w-3 h-3 text-[#FFAB00] animate-spin ml-2" />}
                  {isDemoMode && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] rounded-full">DEMO</span>
                  )}
                </div>

                {/* Loading Skeletons */}
                {isLoading && displayDevelopers.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-center justify-center">
                        <CardSkeleton />
                      </div>
                    ))}
                  </div>
                ) : displayDevelopers.length === 0 ? (
                  <EmptyState category={isSearchActive ? `"${searchQuery}"` : activeRole} />
                ) : (
                  <ResponsiveMasonryGrid
                    developers={displayDevelopers}
                    onSelectDev={handleSelectDev}
                    isRestricted={isRestricted}
                    onUnlockClick={handleUnlockClick}
                  />
                )}
              </motion.div>
            ) : !error && (

              /* LIST VIEW */
              <motion.div
                key="list"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="hidden md:flex px-4 py-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest border-b border-white/10 mb-2">
                  <div className="w-1/4">Operative ID</div>
                  <div className="w-1/4">Specialization</div>
                  <div className="w-1/6">Stats {isRestricted && <Lock className="w-3 h-3 inline text-red-500 ml-1" />}</div>
                  <div className="w-1/3">Status & Action</div>
                </div>

                {isLoading && displayDevelopers.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#FFAB00] animate-spin" />
                  </div>
                ) : displayDevelopers.length === 0 ? (
                  <EmptyState category={isSearchActive ? `"${searchQuery}"` : activeRole} />
                ) : (
                  displayDevelopers.map((dev) => (
                    <TacticalRow
                      key={dev.id}
                      dev={dev}
                      onClick={() => handleSelectDev(dev)}
                      isRestricted={isRestricted}
                      onUnlock={handleUnlockClick}
                    />
                  ))
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Portfolios;