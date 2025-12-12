import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, ExternalLink, Star, Building } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { HealthBar } from "@/components/HealthBar";
import { Footer } from "@/components/Footer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { StudioMap } from "@/components/StudioMap";

interface Studio {
  id: number;
  name: string;
  logo: string;
  location: string;
  employees: string;
  rating: number;
  founded: string;
  website: string;
  description: string;
  games: string[];
}

const studios: Studio[] = [
  {
    id: 1,
    name: "Nodding Heads Games",
    logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200",
    location: "Pune, India",
    employees: "20-50",
    rating: 92,
    founded: "2015",
    website: "https://noddingheadsgames.com",
    description: "The studio behind Raji: An Ancient Epic. Known for bringing Indian mythology to the global gaming stage with stunning visuals and heartfelt storytelling.",
    games: ["Raji: An Ancient Epic", "Unannounced Project"],
  },
  {
    id: 2,
    name: "Ubisoft India",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    location: "Mumbai, India",
    employees: "500+",
    rating: 85,
    founded: "2008",
    website: "https://ubisoft.com",
    description: "One of the largest AAA studios in India, contributing to major franchises like Assassin's Creed, Far Cry, and Prince of Persia.",
    games: ["Assassin's Creed (Support)", "Prince of Persia: Sands of Time Remake"],
  },
  {
    id: 3,
    name: "SuperGaming",
    logo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200",
    location: "Pune, India",
    employees: "100-200",
    rating: 78,
    founded: "2016",
    website: "https://supergaming.co",
    description: "India's leading mobile game studio, creators of MaskGun and PAC-MAN Party Royale. Pioneering competitive mobile gaming.",
    games: ["MaskGun", "PAC-MAN Party Royale", "Indus"],
  },
  {
    id: 4,
    name: "Rockstar India",
    logo: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200",
    location: "Bangalore, India",
    employees: "500+",
    rating: 88,
    founded: "2016",
    website: "https://rockstargames.com",
    description: "Support studio for Rockstar Games, contributing to GTA V, Red Dead Redemption 2, and other major titles.",
    games: ["GTA V (Support)", "Red Dead Redemption 2 (Support)"],
  },
  {
    id: 5,
    name: "Gametion Technologies",
    logo: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=200",
    location: "Mumbai, India",
    employees: "50-100",
    rating: 72,
    founded: "2010",
    website: "https://gametion.com",
    description: "India's casual gaming powerhouse, creators of Ludo King—the most downloaded Indian game of all time.",
    games: ["Ludo King", "Carrom King", "Pool King"],
  },
  {
    id: 6,
    name: "Ogre Head Studio",
    logo: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=200",
    location: "Bangalore, India",
    employees: "10-20",
    rating: 80,
    founded: "2018",
    website: "https://ogrehead.com",
    description: "Indie studio focused on narrative-driven horror games with a distinctly Indian flavor.",
    games: ["Asura", "In Development"],
  },
];

const Studios = () => {
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-20">
        {/* Header */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-12">
          <FadeInView>
            <h1 className="font-display text-5xl md:text-6xl mb-4">
              Game <span className="text-gradient-gold">Studios</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover India's thriving game development ecosystem. From indie darlings 
              to AAA support studios, these are the companies shaping the industry.
            </p>
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

        {/* Studio Grid */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
          <FadeInView>
            <h2 className="font-display text-3xl mb-8">
              All <span className="text-gradient-gold">Studios</span>
            </h2>
          </FadeInView>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio, index) => (
              <FadeInView key={studio.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedStudio(studio)}
                  className="gaming-card p-6 cursor-pointer group"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={studio.logo}
                        alt={studio.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl group-hover:text-primary transition-colors">
                        {studio.name}
                      </h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {studio.location}
                      </p>
                    </div>
                  </div>

                  {/* Rating as Health Bar */}
                  <div className="mb-4">
                    <HealthBar 
                      value={studio.rating} 
                      label="Community Rating" 
                      showValue={true}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {studio.employees}
                    </span>
                    <span>Est. {studio.founded}</span>
                  </div>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </section>

        {/* Studio Details Sheet */}
        <Sheet open={!!selectedStudio} onOpenChange={() => setSelectedStudio(null)}>
          <SheetContent className="bg-card border-border overflow-y-auto">
            {selectedStudio && (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={selectedStudio.logo}
                        alt={selectedStudio.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <SheetTitle className="font-display text-2xl text-foreground">
                        {selectedStudio.name}
                      </SheetTitle>
                      <SheetDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedStudio.location}
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Rating */}
                  <div>
                    <h4 className="font-display text-lg mb-3">Community Rating</h4>
                    <HealthBar value={selectedStudio.rating} />
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-display text-lg mb-3">About</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedStudio.description}
                    </p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <Users className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground">Employees</p>
                      <p className="font-medium">{selectedStudio.employees}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <Building className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground">Founded</p>
                      <p className="font-medium">{selectedStudio.founded}</p>
                    </div>
                  </div>

                  {/* Games */}
                  <div>
                    <h4 className="font-display text-lg mb-3">Notable Games</h4>
                    <div className="space-y-2">
                      {selectedStudio.games.map((game) => (
                        <div
                          key={game}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                        >
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-sm">{game}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.a
                    href={selectedStudio.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </motion.a>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Studios;
