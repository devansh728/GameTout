export interface ContentBlock {
  type: "text" | "image" | "video" | "quote" | "header";
  content: string;
  caption?: string;
}

export interface ArticleData {
  id: string;
  type: "review" | "documentary" | "podcast";
  title: string;
  subtitle: string;
  author: string;
  date: string;
  heroImage: string;
  videoUrl?: string; // For the hero video background
  score?: string; // Only for reviews
  blocks: ContentBlock[];
  relatedIds: string[];
}

export const ARTICLE_DATABASE: Record<string, ArticleData> = {
  "alba-adventure": {
    id: "alba-adventure",
    type: "review",
    title: "Alba: A Wild Adventure",
    subtitle: "A cozy masterpiece that proves you don't need violence to be impactful.",
    author: "Siddharth (GameTout)",
    date: "Oct 12, 2024",
    heroImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920",
    score: "9.0",
    blocks: [
      { type: "header", content: "The Anti-GTA Experience" },
      { type: "text", content: "In an industry obsessed with 4K textures and kill-streaks, Alba feels like a warm hug. It is not just a game; it is a manifesto for digital preservation." },
      { type: "quote", content: "It proves that saving a digital island can feel just as heroic as saving the galaxy." },
      { type: "image", content: "https://images.unsplash.com/photo-1552083375-1447ce886485?w=1200", caption: "The island visuals are breathtakingly simple." },
      { type: "text", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
      { type: "video", content: "https://www.youtube.com/embed/QkkoHAzjnUs" },
      { type: "text", content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident." }
    ],
    relatedIds: ["ac-evolution", "dark-layers"]
  },
  "ac-evolution": {
    id: "ac-evolution",
    type: "documentary",
    title: "Assassin's Creed: The 17-Year Leap",
    subtitle: "From Altaïr to Shadows. An exhaustive analysis of stealth mechanics.",
    author: "GameTout Editorial",
    date: "Nov 01, 2024",
    heroImage: "https://img.youtube.com/vi/UgbO7pLn1Cg/maxresdefault.jpg",
    blocks: [
      { type: "text", content: "Ubisoft's flagship franchise has seen many faces. We trace the lineage of the hidden blade." },
      { type: "image", content: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200", caption: "Parkour mechanics have evolved drastically." },
      { type: "text", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." }
    ],
    relatedIds: ["alba-adventure"]
  }
  // Add more entries here...
};