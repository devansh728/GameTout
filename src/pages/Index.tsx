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
import { HeroCommandCenter } from "@/components/HeroCommandCenter";
import { PodcastSection } from "@/components/PodcastSection";
import { PortfolioRail } from "@/components/PortfolioRail";
import { NexusHub } from "@/components/NexusHub";

const Index = () => {
  // const [isAuthOpen, setIsAuthOpen] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const handleAuthSuccess = () => {
  //   setIsAuthenticated(true);
  //   setIsAuthOpen(false);
  //   // You can trigger a toast notification here: "Welcome back, Operative."
  // };
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFAB00] selection:text-black">

        {/* 1. The Global Header (Always Visible) */}
        {/* <HUDHeader
          onLoginClick={() => setIsAuthOpen(true)}
          isAuthenticated={isAuthenticated}
        /> */}

        {/* 2. The Modal (Hidden by default) */}
        {/* <SecurityAuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        /> */}
        {/* 3. News Ticker (Top Level Alert) */}
        <div className="pt-20">
          {/* pt-20 pushes content down so HUD doesn't overlap */}
          <BreakingNewsTicker />
        </div>

        {/* 4. THE COMMAND DECK (Replaces VideoHero) */}
        <HeroCommandCenter />

        {/* Feature 2: Mixed-Media Bento Grid */}
        <MixedMediaGrid />

        <NexusHub />

        {/* ZONE 3: Reviews (Swipeable) */}
        {/* <ReviewRail /> */}

        <PortfolioRail />

        {/* ZONE 4: Documentaries (Cinema Mode) */}
        <DocumentaryTheater />

        {/* 6. GAMETOUT GOSSIP (Podcast Zone) */}
        <PodcastSection />

        {/* <LaunchTrajectory />

        <CommunityGrid /> */}

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
