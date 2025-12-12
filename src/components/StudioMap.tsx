import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ExternalLink, Play, Users, Building } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { HealthBar } from "@/components/HealthBar";

interface Studio {
  id: number;
  name: string;
  logo: string;
  location: string;
  coordinates: { x: number; y: number };
  employees: string;
  rating: number;
  founded: string;
  website: string;
  description: string;
  games: string[];
  showreelUrl?: string;
}

// Helper to extract YouTube video ID
const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

const studios: Studio[] = [
  {
    id: 1,
    name: "Nodding Heads Games",
    logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200",
    location: "Pune, Maharashtra",
    coordinates: { x: 35, y: 52 },
    employees: "20-50",
    rating: 92,
    founded: "2015",
    website: "https://noddingheadsgames.com",
    description: "The studio behind Raji: An Ancient Epic. Known for bringing Indian mythology to the global gaming stage.",
    games: ["Raji: An Ancient Epic"],
    showreelUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    name: "Ubisoft India",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    location: "Mumbai, Maharashtra",
    coordinates: { x: 32, y: 50 },
    employees: "500+",
    rating: 85,
    founded: "2008",
    website: "https://ubisoft.com",
    description: "One of the largest AAA studios in India, contributing to major franchises.",
    games: ["Assassin's Creed (Support)", "Prince of Persia Remake"],
    showreelUrl: "https://www.youtube.com/watch?v=QkkoHAzjnUs",
  },
  {
    id: 3,
    name: "SuperGaming",
    logo: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200",
    location: "Pune, Maharashtra",
    coordinates: { x: 36, y: 53 },
    employees: "100-200",
    rating: 78,
    founded: "2016",
    website: "https://supergaming.co",
    description: "India's leading mobile game studio, creators of MaskGun and Indus.",
    games: ["MaskGun", "Indus"],
  },
  {
    id: 4,
    name: "Rockstar India",
    logo: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200",
    location: "Bangalore, Karnataka",
    coordinates: { x: 40, y: 70 },
    employees: "500+",
    rating: 88,
    founded: "2016",
    website: "https://rockstargames.com",
    description: "Support studio for Rockstar Games, contributing to GTA V and RDR2.",
    games: ["GTA V (Support)", "RDR2 (Support)"],
  },
  {
    id: 5,
    name: "Gametion Technologies",
    logo: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=200",
    location: "Mumbai, Maharashtra",
    coordinates: { x: 31, y: 51 },
    employees: "50-100",
    rating: 72,
    founded: "2010",
    website: "https://gametion.com",
    description: "Creators of Ludo King—the most downloaded Indian game ever.",
    games: ["Ludo King", "Carrom King"],
  },
  {
    id: 6,
    name: "Dhruva Interactive",
    logo: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=200",
    location: "Bangalore, Karnataka",
    coordinates: { x: 42, y: 68 },
    employees: "200+",
    rating: 80,
    founded: "1997",
    website: "https://dhruva.com",
    description: "One of India's oldest studios, now part of Rockstar.",
    games: ["Various AAA Support"],
  },
];

export const StudioMap = () => {
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [hoveredStudio, setHoveredStudio] = useState<number | null>(null);

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-video rounded-lg overflow-hidden bg-card border border-border">
      {/* Stylized India Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-dark to-background">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        
        {/* India outline (simplified SVG shape) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M25,20 L45,15 L55,20 L65,25 L70,35 L75,45 L70,55 L65,65 L55,75 L45,85 L35,80 L30,70 L25,60 L20,50 L22,40 L25,30 Z"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Studio Pins */}
      {studios.map((studio) => (
        <motion.button
          key={studio.id}
          className="absolute z-10"
          style={{
            left: `${studio.coordinates.x}%`,
            top: `${studio.coordinates.y}%`,
          }}
          onMouseEnter={() => setHoveredStudio(studio.id)}
          onMouseLeave={() => setHoveredStudio(null)}
          onClick={() => setSelectedStudio(studio)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 w-8 h-8 rounded-full bg-primary/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: studio.id * 0.3,
              }}
            />
            
            {/* Pin */}
            <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredStudio === studio.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-card border border-border whitespace-nowrap text-sm font-medium"
                >
                  {studio.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg glass text-xs">
        <span className="text-muted-foreground">Click pins to view studio details</span>
      </div>

      {/* Studio Details Sheet */}
      <Sheet open={!!selectedStudio} onOpenChange={() => setSelectedStudio(null)}>
        <SheetContent className="bg-card border-border overflow-y-auto">
          {selectedStudio && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
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
                {/* Showreel */}
                {selectedStudio.showreelUrl && (
                  <div>
                    <h4 className="font-display text-lg mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4 text-primary" />
                      Showreel
                    </h4>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      {(() => {
                        const videoId = getYouTubeId(selectedStudio.showreelUrl!);
                        return videoId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            style={{ border: 0 }}
                          />
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}

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
                  <div className="flex flex-wrap gap-2">
                    {selectedStudio.games.map((game) => (
                      <span
                        key={game}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                      >
                        {game}
                      </span>
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
    </div>
  );
};
