import { useState } from "react";
import { VideoHero } from "@/components/VideoHero";
import { MixedMediaGrid } from "@/components/MixedMediaGrid";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { KonamiEasterEgg } from "@/components/KonamiEasterEgg";
import { LootDropReward } from "@/components/LootDropReward";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { ReviewRail } from "@/components/ReviewRail";
import { DocumentaryTheater } from "@/components/DocumentaryTheater";
import { CommunityTerminal } from "@/components/CommunityTerminal";
import { LaunchTrajectory } from "@/components/LaunchTrajectory";
import { CommunityGrid } from "@/components/CommunityGrid";
import { HUDHeader } from "@/components/HUDHeader"; 
import { SecurityAuthModal } from "@/components/SecurityAuthModal";

const Index = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthOpen(false);
    // You can trigger a toast notification here: "Welcome back, Operative."
  };
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFAB00] selection:text-black">

        {/* 1. The Global Header (Always Visible) */}
        <HUDHeader
          onLoginClick={() => setIsAuthOpen(true)}
          isAuthenticated={isAuthenticated}
        />

        {/* 2. The Modal (Hidden by default) */}
        <SecurityAuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
        {/* Feature 1: Cinematic Hero with YouTube Background */}
        <div className="relative">
          <VideoHero
            videoUrl="https://www.youtube.com/watch?v=QkkoHAzjnUs"
            posterImage="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <BreakingNewsTicker />
          </div>
        </div>

        {/* Feature 2: Mixed-Media Bento Grid */}
        <MixedMediaGrid />

        {/* ZONE 3: Reviews (Swipeable) */}
        <ReviewRail />

        {/* ZONE 4: Documentaries (Cinema Mode) */}
        <DocumentaryTheater />

        <LaunchTrajectory />

        <CommunityGrid />

        <CommunityTerminal />

        <Footer />

        {/* Feature 11: Loot Drop Rewards */}
        <LootDropReward />

        {/* Feature 12: Konami Code Easter Egg */}
        <KonamiEasterEgg />
      </main>
    </PageTransition>
  );
};

export default Index;
