import { useState } from "react";
import { MixedMediaGrid } from "@/components/MixedMediaGrid";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { KonamiEasterEgg } from "@/components/KonamiEasterEgg";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { DocumentaryTheater } from "@/components/DocumentaryTheater";
import { CommunityTerminal } from "@/components/CommunityTerminal";
import { HeroCommandCenter } from "@/components/HeroCommandCenter";
import { PodcastSection } from "@/components/PodcastSection";
import { PortfolioRail } from "@/components/PortfolioRail";
import { NexusHub } from "@/components/NexusHub";
import { HeroTagline } from "@/components/HeroTagline";

const Index = () => {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#FFAB00] selection:text-black">

        <div className="pt-20">
          {/* pt-20 pushes content down so HUD doesn't overlap */}
          <BreakingNewsTicker />
        </div>

        <HeroTagline />

        {/* 4. THE COMMAND DECK (Replaces VideoHero) */}
        <HeroCommandCenter />

        <NexusHub />

        <PortfolioRail />

        {/* Feature 2: Mixed-Media Bento Grid */}
        <MixedMediaGrid />

        

        

        {/* ZONE 3: Reviews (Swipeable) */}
        {/* <ReviewRail /> */}

        

        {/* ZONE 4: Documentaries (Cinema Mode) */}
        <DocumentaryTheater />

        {/* 6. GAMETOUT GOSSIP (Podcast Zone) */}
        <PodcastSection />

        <CommunityTerminal />

        <Footer />

        {/* Feature 12: Konami Code Easter Egg */}
        <KonamiEasterEgg />
      </main>
    </PageTransition>
  );
};

export default Index;
