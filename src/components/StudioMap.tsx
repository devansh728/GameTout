import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  MapPin, ExternalLink, Users, Building, Globe, Navigation, Search, 
  Radar, Wifi, Signal, Zap, ChevronRight, Play, X, Target
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { HealthBar } from "@/components/HealthBar";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";

// --- TYPES ---
interface Studio {
  id: number;
  name: string;
  logo: string;
  location: string;
  state?: string;
  geoIndia?: { x: number; y: number };
  geoWorld: { x: number; y: number };
  employees: string;
  rating: number;
  founded: string;
  website: string;
  description: string;
  games: string[];
  showreelUrl?: string;
  region: "India" | "Global";
}

// --- DATA: INDIA & GLOBAL STUDIOS ---
const studios: Studio[] = [
  // INDIA STUDIOS (Coordinates adjusted for accurate India SVG)
  {
    id: 1,
    name: "Nodding Heads Games",
    logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200",
    location: "Pune, India",
    state: "Maharashtra",
    geoIndia: { x: 35, y: 52 },
    geoWorld: { x: 72, y: 45 },
    employees: "20-50",
    rating: 92,
    founded: "2015",
    website: "https://noddingheadsgames.com",
    description: "The studio behind Raji: An Ancient Epic. Bringing Indian mythology to the global stage with stunning visuals and compelling narratives.",
    games: ["Raji: An Ancient Epic"],
    showreelUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    region: "India"
  },
  {
    id: 2,
    name: "Ubisoft India",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    location: "Mumbai, India",
    state: "Maharashtra",
    geoIndia: { x: 32, y: 50 },
    geoWorld: { x: 71, y: 44 },
    employees: "500+",
    rating: 85,
    founded: "2008",
    website: "https://ubisoft.com",
    description: "A major AAA support studio contributing to massive franchises like Assassin's Creed and Prince of Persia.",
    games: ["Assassin's Creed", "Prince of Persia"],
    showreelUrl: "https://www.youtube.com/watch?v=QkkoHAzjnUs",
    region: "India"
  },
  {
    id: 3,
    name: "Rockstar India",
    logo: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200",
    location: "Bangalore, India",
    state: "Karnataka",
    geoIndia: { x: 38, y: 68 },
    geoWorld: { x: 73, y: 50 },
    employees: "500+",
    rating: 88,
    founded: "2016",
    website: "https://rockstargames.com",
    description: "The dedicated art and animation unit for Rockstar's global hits including GTA and Red Dead Redemption.",
    games: ["GTA V", "RDR2"],
    region: "India"
  },
  {
    id: 4,
    name: "Dhruva Interactive",
    logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200",
    location: "Bangalore, India",
    state: "Karnataka",
    geoIndia: { x: 40, y: 70 },
    geoWorld: { x: 73, y: 51 },
    employees: "300+",
    rating: 82,
    founded: "1997",
    website: "https://dhruva.com",
    description: "India's oldest game studio, now part of Rockstar Games, specializing in art production.",
    games: ["Call of Duty", "Forza"],
    region: "India"
  },
  {
    id: 5,
    name: "Sumo Pune",
    logo: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=200",
    location: "Pune, India",
    state: "Maharashtra",
    geoIndia: { x: 34, y: 54 },
    geoWorld: { x: 72, y: 46 },
    employees: "200+",
    rating: 80,
    founded: "2019",
    website: "https://sumo-digital.com",
    description: "Part of Sumo Digital group, working on AAA co-development projects.",
    games: ["Sackboy", "Crackdown 3"],
    region: "India"
  },
  {
    id: 6,
    name: "Lakshya Digital",
    logo: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200",
    location: "Gurgaon, India",
    state: "Haryana",
    geoIndia: { x: 40, y: 22 },
    geoWorld: { x: 73, y: 38 },
    employees: "400+",
    rating: 86,
    founded: "2004",
    website: "https://lakshyadigital.com",
    description: "Premier art outsourcing studio working with top global publishers.",
    games: ["Uncharted", "Last of Us"],
    region: "India"
  },
  {
    id: 7,
    name: "Technicolor Games",
    logo: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=200",
    location: "Chennai, India",
    state: "Tamil Nadu",
    geoIndia: { x: 45, y: 75 },
    geoWorld: { x: 74, y: 52 },
    employees: "150+",
    rating: 78,
    founded: "2010",
    website: "https://technicolorgames.com",
    description: "Visual effects and game art production powerhouse in South India.",
    games: ["FIFA", "Madden"],
    region: "India"
  },
  {
    id: 8,
    name: "SuperGaming",
    logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200",
    location: "Pune, India",
    state: "Maharashtra",
    geoIndia: { x: 36, y: 53 },
    geoWorld: { x: 72, y: 45 },
    employees: "100+",
    rating: 84,
    founded: "2020",
    website: "https://supergaming.com",
    description: "Creators of Indus Battle Royale, India's homegrown AAA shooter.",
    games: ["Indus", "MaskGun"],
    region: "India"
  },

  // GLOBAL STUDIOS
  {
    id: 101,
    name: "Rockstar North",
    logo: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200",
    location: "Edinburgh, UK",
    geoWorld: { x: 47, y: 25 },
    employees: "600+",
    rating: 98,
    founded: "1988",
    website: "https://rockstargames.com",
    description: "The legendary creators of the Grand Theft Auto series and Red Dead Redemption.",
    games: ["GTA Series", "Manhunt", "RDR2"],
    region: "Global"
  },
  {
    id: 102,
    name: "Ubisoft Montreal",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    location: "Montreal, Canada",
    geoWorld: { x: 25, y: 28 },
    employees: "3000+",
    rating: 95,
    founded: "1997",
    website: "https://ubisoft.com",
    description: "One of the largest game development studios in the world.",
    games: ["Far Cry", "Watch Dogs", "Assassin's Creed"],
    region: "Global"
  },
  {
    id: 103,
    name: "CD Projekt Red",
    logo: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200",
    location: "Warsaw, Poland",
    geoWorld: { x: 52, y: 26 },
    employees: "1000+",
    rating: 90,
    founded: "1994",
    website: "https://cdprojekt.com",
    description: "Creators of The Witcher series and Cyberpunk 2077.",
    games: ["The Witcher 3", "Cyberpunk 2077"],
    region: "Global"
  },
  {
    id: 104,
    name: "Nintendo EPD",
    logo: "https://images.unsplash.com/photo-1609372332255-611485350f25?w=200",
    location: "Kyoto, Japan",
    geoWorld: { x: 82, y: 35 },
    employees: "800+",
    rating: 99,
    founded: "2015",
    website: "https://nintendo.com",
    description: "The masterminds behind Mario, Zelda, and Nintendo's first-party titles.",
    games: ["Zelda TOTK", "Mario Odyssey", "Splatoon"],
    region: "Global"
  },
  {
    id: 105,
    name: "Naughty Dog",
    logo: "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=200",
    location: "Santa Monica, USA",
    geoWorld: { x: 15, y: 38 },
    employees: "500+",
    rating: 97,
    founded: "1984",
    website: "https://naughtydog.com",
    description: "PlayStation's flagship studio known for cinematic masterpieces.",
    games: ["The Last of Us", "Uncharted"],
    region: "Global"
  },
  {
    id: 106,
    name: "Santa Monica Studio",
    logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200",
    location: "Los Angeles, USA",
    geoWorld: { x: 14, y: 36 },
    employees: "300+",
    rating: 96,
    founded: "1999",
    website: "https://sms.playstation.com",
    description: "Creators of the legendary God of War franchise.",
    games: ["God of War Ragnarök", "God of War 2018"],
    region: "Global"
  },
  {
    id: 107,
    name: "FromSoftware",
    logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200",
    location: "Tokyo, Japan",
    geoWorld: { x: 84, y: 36 },
    employees: "350+",
    rating: 95,
    founded: "1986",
    website: "https://fromsoftware.jp",
    description: "Masters of the Soulsborne genre and challenging action RPGs.",
    games: ["Elden Ring", "Dark Souls", "Sekiro"],
    region: "Global"
  },
  {
    id: 108,
    name: "Riot Games",
    logo: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=200",
    location: "Los Angeles, USA",
    geoWorld: { x: 16, y: 37 },
    employees: "4500+",
    rating: 92,
    founded: "2006",
    website: "https://riotgames.com",
    description: "Creators of League of Legends and Valorant esports phenomena.",
    games: ["League of Legends", "Valorant", "TFT"],
    region: "Global"
  }
];

// ============================================
// INDIA MAP SVG COMPONENT (Accurate with States)
// ============================================
const IndiaMapSVG = ({ hoveredState, onStateHover }: { 
  hoveredState: string | null; 
  onStateHover: (state: string | null) => void;
}) => {
  // Geographically accurate India state paths with corrected left/west side
  const states = [
    // NORTHERN STATES
    {
      id: "JK",
      name: "Jammu & Kashmir",
      d: "M42,4 L48,2 L56,4 L64,8 L72,14 L78,22 L80,32 L78,40 L72,46 L64,48 L56,46 L48,42 L42,36 L38,28 L36,20 L38,12 Z",
    },
    {
      id: "LA",
      name: "Ladakh",
      d: "M64,8 L72,6 L82,8 L90,14 L94,22 L92,30 L86,36 L78,40 L72,38 L66,32 L64,24 L64,16 Z",
    },
    {
      id: "HP",
      name: "Himachal Pradesh",
      d: "M56,46 L64,48 L72,46 L76,50 L78,56 L76,62 L70,66 L64,68 L58,66 L54,60 L52,54 L54,48 Z",
    },
    {
      id: "PB",
      name: "Punjab",
      d: "M42,42 L48,46 L54,48 L52,54 L50,60 L46,64 L40,66 L36,64 L34,58 L34,52 L36,46 Z",
    },
    {
      id: "HR",
      name: "Haryana",
      d: "M40,66 L46,64 L50,66 L52,70 L54,76 L52,82 L48,86 L42,88 L38,86 L36,80 L36,74 L38,70 Z",
    },
    {
      id: "DL",
      name: "Delhi",
      d: "M44,78 L48,76 L50,80 L48,84 L44,84 L42,80 Z",
    },
    {
      id: "UK",
      name: "Uttarakhand",
      d: "M58,66 L64,68 L70,66 L74,68 L78,72 L80,78 L76,80 L70,78 L64,76 L60,72 L56,68 Z",
    },

    // WESTERN STATES (CORRECTED)
    {
      id: "RJ",
      name: "Rajasthan",
      // Corrected: More accurate western border with Gujarat, proper Kutch region consideration
      d: "M8,72 L16,66 L24,62 L32,58 L36,58 L36,64 L38,70 L38,80 L40,88 L42,96 L42,106 L40,114 L36,120 L30,124 L24,124 L18,120 L14,114 L12,106 L10,96 L8,86 L6,78 Z",
    },
    {
      id: "GJ",
      name: "Gujarat",
      // Corrected: Accurate Kutch, Saurashtra peninsula, and Gulf of Khambhat
      d: "M2,96 L6,90 L8,86 L10,96 L12,106 L14,114 L16,118 L14,124 L10,130 L6,134 L4,138 Q2,142 4,146 L8,150 L14,152 L18,148 L22,144 L26,142 L28,136 L26,130 L24,124 L20,118 L18,112 L16,106 L14,100 L10,96 L6,94 L2,96 Z M4,104 Q0,108 2,114 L4,118 L6,114 L4,108 Z",
      // Saurashtra Peninsula (Kathiawar)
    },
    {
      id: "DD",
      name: "Daman & Diu",
      d: "M14,152 L18,150 L20,154 L18,156 L14,154 Z",
    },
    {
      id: "DNH",
      name: "Dadra & Nagar Haveli",
      d: "M18,156 L22,154 L24,158 L22,162 L18,160 Z",
    },
    {
      id: "MH",
      name: "Maharashtra",
      // Corrected: Accurate Konkan coast, proper shape along Arabian Sea
      d: "M18,160 L22,156 L26,152 L30,150 L34,148 L38,146 L42,144 L46,142 L50,144 L54,148 L58,154 L60,162 L58,170 L54,176 L50,182 L46,186 L40,190 L34,192 L28,190 L24,186 L20,180 L18,174 L16,168 L16,164 Z",
    },
    {
      id: "GA",
      name: "Goa",
      d: "M20,190 L24,188 L26,192 L26,198 L24,202 L20,202 L18,198 L18,194 Z",
    },

    // CENTRAL STATES
    {
      id: "MP",
      name: "Madhya Pradesh",
      d: "M30,124 L36,120 L42,118 L48,116 L54,114 L60,112 L66,114 L72,118 L74,124 L74,132 L72,140 L68,146 L62,150 L56,152 L50,150 L44,146 L38,144 L34,140 L30,134 L28,128 Z",
    },
    {
      id: "CG",
      name: "Chhattisgarh",
      d: "M68,146 L74,144 L80,146 L84,152 L86,160 L84,168 L80,174 L74,178 L68,176 L64,170 L62,162 L62,154 L64,148 Z",
    },
    {
      id: "UP",
      name: "Uttar Pradesh",
      d: "M42,88 L48,86 L54,84 L60,82 L68,80 L76,80 L82,82 L88,86 L92,92 L94,100 L92,108 L88,114 L82,118 L76,120 L70,120 L64,118 L58,116 L52,114 L48,112 L44,108 L42,102 L42,96 Z",
    },

    // EASTERN STATES
    {
      id: "BR",
      name: "Bihar",
      d: "M82,118 L88,114 L94,112 L100,114 L106,118 L110,124 L108,132 L104,138 L98,142 L92,142 L86,138 L82,132 L80,126 Z",
    },
    {
      id: "JH",
      name: "Jharkhand",
      d: "M80,132 L86,138 L92,142 L94,148 L92,156 L88,162 L82,166 L76,164 L72,158 L70,150 L72,144 L76,138 Z",
    },
    {
      id: "WB",
      name: "West Bengal",
      d: "M92,142 L98,142 L104,140 L108,144 L112,150 L114,158 L114,168 L112,178 L108,186 L102,192 L96,194 L92,190 L90,182 L88,174 L88,166 L90,158 L92,150 Z",
    },
    {
      id: "SK",
      name: "Sikkim",
      d: "M98,130 L102,128 L106,130 L108,136 L106,140 L102,142 L98,140 L96,136 Z",
    },
    {
      id: "NE",
      name: "Northeast",
      // Arunachal, Assam, Meghalaya, Tripura, Mizoram, Manipur, Nagaland combined
      d: "M106,130 L114,126 L124,128 L134,134 L140,144 L142,156 L140,168 L134,178 L126,184 L118,186 L112,182 L108,176 L108,166 L110,156 L112,146 L110,138 Z",
    },

    // EASTERN COASTAL
    {
      id: "OR",
      name: "Odisha",
      d: "M76,164 L82,166 L88,168 L92,172 L96,180 L96,190 L92,198 L86,206 L78,210 L70,210 L64,204 L60,196 L60,186 L62,178 L66,170 L72,166 Z",
    },

    // SOUTHERN STATES
    {
      id: "TG",
      name: "Telangana",
      d: "M54,176 L60,174 L66,176 L72,180 L74,188 L72,196 L68,202 L62,206 L56,206 L50,202 L46,196 L46,188 L48,182 Z",
    },
    {
      id: "AP",
      name: "Andhra Pradesh",
      d: "M56,206 L62,206 L68,208 L76,212 L82,218 L86,226 L86,236 L82,246 L76,254 L68,260 L60,262 L52,258 L46,250 L42,242 L42,232 L44,222 L48,214 Z",
    },
    {
      id: "KA",
      name: "Karnataka",
      d: "M26,192 L32,190 L38,190 L44,192 L50,196 L54,202 L56,210 L56,220 L54,230 L50,238 L44,244 L38,248 L32,250 L26,248 L22,242 L20,234 L18,224 L18,214 L20,206 L22,200 Z",
    },
    {
      id: "KL",
      name: "Kerala",
      d: "M26,248 L32,250 L36,256 L38,266 L38,278 L36,290 L32,300 L28,306 L24,308 L20,304 L18,296 L18,286 L20,276 L22,266 L24,258 Z",
    },
    {
      id: "TN",
      name: "Tamil Nadu",
      d: "M38,248 L44,246 L52,248 L60,252 L68,258 L74,266 L78,276 L78,288 L74,300 L68,310 L60,316 L52,318 L44,316 L38,310 L34,302 L32,292 L32,282 L34,272 L36,262 L36,254 Z",
    },
    {
      id: "PY",
      name: "Puducherry",
      d: "M58,272 L62,270 L64,274 L62,278 L58,278 L56,274 Z",
    },
    {
      id: "AN",
      name: "Andaman & Nicobar",
      d: "M130,220 L134,218 L136,224 L136,236 L134,248 L132,260 L130,268 L128,264 L128,252 L128,240 L128,230 L130,224 Z",
    },
    {
      id: "LK",
      name: "Lakshadweep",
      d: "M8,270 L12,268 L14,274 L12,280 L8,280 L6,276 Z",
    },
  ];

  return (
    <svg 
      viewBox="0 0 150 330" 
      className="h-full w-auto max-h-[500px]"
      style={{ filter: "drop-shadow(0 0 20px rgba(255,171,0,0.15))" }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradient for highlighted states */}
        <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFAB00" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.25"/>
        </linearGradient>

        {/* Animated background gradient */}
        <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFAB00" stopOpacity="0.6">
            <animate attributeName="stopOpacity" values="0.6;0.3;0.6" dur="3s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.3">
            <animate attributeName="stopOpacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>

        {/* Ocean pattern */}
        <pattern id="oceanPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.5" fill="#FFAB00" opacity="0.1"/>
        </pattern>

        {/* Glow for active states */}
        <filter id="activeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feFlood floodColor="#FFAB00" floodOpacity="0.6"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background glow ellipse */}
      <ellipse 
        cx="75" 
        cy="165" 
        rx="60" 
        ry="120" 
        fill="url(#animatedGradient)" 
        opacity="0.08"
      />

      {/* Ocean indicator (Arabian Sea side) */}
      <rect x="0" y="80" width="20" height="180" fill="url(#oceanPattern)" opacity="0.3"/>
      
      {/* Ocean indicator (Bay of Bengal side) */}
      <rect x="100" y="150" width="30" height="120" fill="url(#oceanPattern)" opacity="0.3"/>

      {/* State paths */}
      {states.map((state, index) => (
        <motion.path
          key={state.id}
          d={state.d}
          fill={hoveredState === state.name ? "url(#stateGradient)" : "rgba(255,171,0,0.05)"}
          stroke="#FFAB00"
          strokeWidth={hoveredState === state.name ? "1.2" : "0.5"}
          strokeOpacity={hoveredState === state.name ? 1 : 0.4}
          strokeLinejoin="round"
          className="cursor-pointer transition-all duration-300"
          onMouseEnter={() => onStateHover(state.name)}
          onMouseLeave={() => onStateHover(null)}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.02 * index }}
          whileHover={{ 
            fill: "url(#stateGradient)",
            strokeWidth: 1.5,
            filter: "url(#glow)"
          }}
        />
      ))}

      {/* Outer India border with glow animation */}
      <motion.path
        d="M42,4 L56,2 L72,6 L90,14 L94,30 L86,46 L78,56 L80,78 L92,92 L106,118 L140,144 L142,168 L126,186 L108,186 L96,194 L86,210 L68,260 L52,318 L38,310 L24,308 L18,286 L18,224 L20,190 L4,146 L2,96 L8,72 L36,46 L42,4 Z"
        fill="none"
        stroke="#FFAB00"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />

      {/* Animated scan line */}
      <motion.line
        x1="0"
        x2="150"
        stroke="#FFAB00"
        strokeWidth="1"
        strokeOpacity="0.3"
        initial={{ y1: 0, y2: 0 }}
        animate={{ y1: [0, 330, 0], y2: [0, 330, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Major city markers */}
      <g className="city-markers">
        {/* Mumbai */}
        <motion.circle 
          cx="22" cy="168" r="2" 
          fill="#FFAB00" 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Delhi */}
        <motion.circle 
          cx="46" cy="80" r="2" 
          fill="#FFAB00" 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        {/* Bangalore */}
        <motion.circle 
          cx="44" cy="232" r="2" 
          fill="#FFAB00" 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />
        {/* Chennai */}
        <motion.circle 
          cx="62" cy="268" r="2" 
          fill="#FFAB00" 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
        />
        {/* Kolkata */}
        <motion.circle 
          cx="98" cy="168" r="2" 
          fill="#FFAB00" 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        />
        {/* Hyderabad */}
        <motion.circle 
          cx="60" cy="194" r="2" 
          fill="#FFAB00" 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />
        {/* Pune */}
        <motion.circle 
          cx="30" cy="178" r="2" 
          fill="#FFAB00" 
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.8 }}
        />
      </g>

      {/* Compass indicator */}
      <g transform="translate(130, 20)">
        <motion.circle 
          cx="0" cy="0" r="10" 
          fill="none" 
          stroke="#FFAB00" 
          strokeOpacity="0.3"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <text x="0" y="-14" fill="#FFAB00" fontSize="6" textAnchor="middle" opacity="0.6">N</text>
        <motion.path 
          d="M0,-8 L2,0 L0,8 L-2,0 Z" 
          fill="#FFAB00" 
          opacity="0.5"
        />
      </g>

      {/* Scale indicator */}
      <g transform="translate(10, 320)">
        <line x1="0" y1="0" x2="30" y2="0" stroke="#FFAB00" strokeOpacity="0.4" strokeWidth="1"/>
        <line x1="0" y1="-2" x2="0" y2="2" stroke="#FFAB00" strokeOpacity="0.4" strokeWidth="1"/>
        <line x1="30" y1="-2" x2="30" y2="2" stroke="#FFAB00" strokeOpacity="0.4" strokeWidth="1"/>
        <text x="15" y="8" fill="#FFAB00" fontSize="4" textAnchor="middle" opacity="0.4">500 km</text>
      </g>
    </svg>
  );
};

// ============================================
// WORLD MAP SVG COMPONENT (More Accurate)
// ============================================
const WorldMapSVG = ({ activeRegions }: { activeRegions: string[] }) => {
  const continents = [
    {
      id: "north-america",
      name: "North America",
      d: "M50,60 L180,40 L200,80 L180,140 L140,160 L100,180 L60,160 L40,120 L30,90 Z",
      labelPos: { x: 110, y: 100 }
    },
    {
      id: "south-america",
      name: "South America",
      d: "M100,180 L140,160 L160,200 L150,280 L120,320 L90,300 L80,240 L85,200 Z",
      labelPos: { x: 120, y: 250 }
    },
    {
      id: "europe",
      name: "Europe",
      d: "M320,50 L400,40 L420,80 L400,120 L350,130 L310,100 L300,70 Z",
      labelPos: { x: 360, y: 85 }
    },
    {
      id: "africa",
      name: "Africa",
      d: "M310,130 L380,120 L420,160 L400,260 L350,300 L300,280 L280,200 L290,150 Z",
      labelPos: { x: 350, y: 210 }
    },
    {
      id: "asia",
      name: "Asia",
      d: "M400,40 L550,30 L620,60 L600,140 L550,180 L480,200 L420,160 L400,120 L420,80 Z",
      labelPos: { x: 500, y: 100 }
    },
    {
      id: "india-region",
      name: "India",
      d: "M480,140 L520,130 L540,170 L520,220 L490,230 L470,200 L465,160 Z",
      labelPos: { x: 500, y: 180 }
    },
    {
      id: "oceania",
      name: "Oceania",
      d: "M560,240 L620,230 L640,270 L620,310 L570,300 L550,270 Z",
      labelPos: { x: 590, y: 270 }
    },
    {
      id: "japan",
      name: "Japan",
      d: "M600,100 L620,95 L625,130 L610,140 L595,125 Z",
      labelPos: { x: 610, y: 115 }
    }
  ];

  return (
    <svg viewBox="0 0 700 360" className="w-full h-full">
      <defs>
        <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFAB00" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFAB00" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.3"/>
        </linearGradient>
        <filter id="worldGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {[...Array(18)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 20}
          x2="700"
          y2={i * 20}
          stroke="rgba(255,171,0,0.1)"
          strokeWidth="0.5"
        />
      ))}
      {[...Array(35)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 20}
          y1="0"
          x2={i * 20}
          y2="360"
          stroke="rgba(255,171,0,0.1)"
          strokeWidth="0.5"
        />
      ))}

      {/* Continents */}
      {continents.map((continent, index) => (
        <motion.g key={continent.id}>
          <motion.path
            d={continent.d}
            fill={continent.id === "india-region" ? "url(#activeGradient)" : "url(#continentGradient)"}
            stroke="#FFAB00"
            strokeWidth={continent.id === "india-region" ? "1.5" : "0.8"}
            strokeOpacity={continent.id === "india-region" ? 0.8 : 0.4}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              fill: "url(#activeGradient)",
              strokeOpacity: 1,
              filter: "url(#worldGlow)"
            }}
            className="cursor-pointer transition-all duration-300"
          />
        </motion.g>
      ))}

      {/* Connection lines between studios */}
      <motion.g opacity="0.3">
        {/* India to UK */}
        <motion.path
          d="M 500 180 Q 450 100, 360 85"
          fill="none"
          stroke="#FFAB00"
          strokeWidth="1"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        {/* India to USA */}
        <motion.path
          d="M 500 180 Q 300 150, 110 100"
          fill="none"
          stroke="#FFAB00"
          strokeWidth="1"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
        />
        {/* India to Japan */}
        <motion.path
          d="M 500 180 Q 550 140, 610 115"
          fill="none"
          stroke="#FFAB00"
          strokeWidth="1"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.4 }}
        />
      </motion.g>
    </svg>
  );
};

// ============================================
// STUDIO PIN COMPONENT (Enhanced)
// ============================================
const StudioPin = ({ 
  studio, 
  viewMode,
  isHovered,
  isSelected,
  onClick,
  onHover
}: {
  studio: Studio;
  viewMode: "india" | "world";
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}) => {
  const coords = viewMode === "india" ? studio.geoIndia : studio.geoWorld;
  if (!coords) return null;

  const pinColor = studio.region === "India" ? "#FFAB00" : "#06B6D4";

  return (
    <motion.button
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        left: `${coords.x}%`, 
        top: `${coords.y}%`,
        scale: 1, 
        opacity: 1 
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="relative cursor-pointer group">
        
        {/* Outer pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ 
            width: 40, 
            height: 40, 
            marginLeft: -12, 
            marginTop: -12,
            border: `2px solid ${pinColor}`,
            opacity: 0.3
          }}
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ 
            width: 40, 
            height: 40, 
            marginLeft: -12, 
            marginTop: -12,
            border: `2px solid ${pinColor}`,
            opacity: 0.3
          }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        />

        {/* Main pin */}
        <motion.div 
          className="relative w-4 h-4 rounded-full border-2 shadow-lg"
          style={{ 
            backgroundColor: pinColor,
            borderColor: "#0a0a0a",
            boxShadow: `0 0 15px ${pinColor}80`
          }}
          whileHover={{ scale: 1.5 }}
          animate={isSelected ? { scale: 1.3 } : { scale: 1 }}
        >
          {/* Inner glow */}
          <div 
            className="absolute inset-1 rounded-full"
            style={{ 
              background: `radial-gradient(circle, white 0%, ${pinColor} 100%)`
            }}
          />
        </motion.div>

        {/* Connecting line to ground */}
        <motion.div
          className="absolute left-1/2 top-full w-px h-6 -translate-x-1/2"
          style={{ 
            background: `linear-gradient(to bottom, ${pinColor}, transparent)`
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: -8, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
            >
              <div 
                className="px-4 py-3 bg-black/95 backdrop-blur-md border rounded-lg shadow-2xl min-w-[180px]"
                style={{ borderColor: `${pinColor}40` }}
              >
                {/* Studio logo */}
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-8 h-8 rounded-md overflow-hidden border"
                    style={{ borderColor: pinColor }}
                  >
                    <img 
                      src={studio.logo} 
                      alt={studio.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm leading-tight">{studio.name}</div>
                    <div className="text-gray-400 text-[10px] font-mono">{studio.employees} employees</div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs" style={{ color: pinColor }}>
                  <MapPin className="w-3 h-3" />
                  <span className="font-mono uppercase tracking-wider">{studio.location}</span>
                </div>

                {/* Rating bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: pinColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${studio.rating}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: pinColor }}>{studio.rating}%</span>
                </div>

                {/* Arrow pointer */}
                <div 
                  className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${pinColor}40`
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

// ============================================
// FLOATING PARTICLES
// ============================================
const FloatingParticles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(({ id, x, y, size, duration, delay }) => (
        <motion.div
          key={id}
          className="absolute rounded-full bg-[#FFAB00]"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            opacity: 0.2,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// RADAR OVERLAY
// ============================================
const RadarOverlay = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFAB00] to-transparent"
        style={{ boxShadow: '0 0 20px #FFAB00, 0 0 40px #FFAB00' }}
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Corner brackets */}
      {[
        "top-4 left-4",
        "top-4 right-4 rotate-90",
        "bottom-4 right-4 rotate-180",
        "bottom-4 left-4 -rotate-90"
      ].map((position, i) => (
        <div key={i} className={`absolute ${position} w-8 h-8 pointer-events-none`}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FFAB00]/50" />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-[#FFAB00]/50" />
        </div>
      ))}

      {/* Crosshair center (subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <div className="w-20 h-[1px] bg-[#FFAB00]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-20 bg-[#FFAB00]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-[#FFAB00] rounded-full" />
      </div>
    </div>
  );
};

// ============================================
// HUD ELEMENTS
// ============================================
const HUDElements = ({ studioCount, viewMode }: { studioCount: number; viewMode: string }) => {
  return (
    <>
      {/* Top left coordinates */}
      <div className="absolute top-4 left-4 z-30">
        <motion.div 
          className="text-[10px] font-mono text-[#FFAB00]/60 space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Radar className="w-3 h-3" />
            <span>SCAN: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3" />
            <span>MODE: {viewMode.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3 animate-pulse" />
            <span>SIGNAL: STRONG</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom left stats */}
      <div className="absolute bottom-4 left-4 z-30">
        <motion.div 
          className="flex items-center gap-4 text-[10px] font-mono text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#FFAB00] animate-pulse" />
            <span>INDIA OPS</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>GLOBAL NET</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom right timestamp */}
      <div className="absolute bottom-4 right-4 z-30">
        <motion.div 
          className="text-[10px] font-mono text-[#FFAB00]/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div>SYS.TIME: {new Date().toLocaleTimeString()}</div>
          <div>LAT: 20.5937° N</div>
          <div>LNG: 78.9629° E</div>
        </motion.div>
      </div>
    </>
  );
};

// ============================================
// MAIN STUDIO MAP COMPONENT
// ============================================
export const StudioMap = () => {
  const [viewMode, setViewMode] = useState<"india" | "world">("india");
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [hoveredStudio, setHoveredStudio] = useState<number | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const rotateX = useTransform(smoothMouseY, [0, 1], [2, -2]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const visibleStudios = viewMode === "india" 
    ? studios.filter(s => s.region === "India") 
    : studios;

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full aspect-[16/9] bg-[#030303] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#0a0a0a]" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,171,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,171,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Radar overlay */}
      <RadarOverlay isActive={true} />

      {/* HUD Elements */}
      <HUDElements studioCount={visibleStudios.length} viewMode={viewMode} />

      {/* Map Controls */}
      <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-3">
        <motion.div 
          className="flex bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-1.5 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button 
            onClick={() => setViewMode("india")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              viewMode === "india" 
                ? "bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] text-black shadow-lg shadow-[#FFAB00]/30" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MapPin className="w-4 h-4" /> India Ops
          </motion.button>
          <motion.button 
            onClick={() => setViewMode("world")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              viewMode === "world" 
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/30" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Globe className="w-4 h-4" /> Global Net
          </motion.button>
        </motion.div>
        
        {/* Status indicator */}
        <motion.div 
          className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-[11px] font-mono text-green-400 uppercase tracking-wider">
            {visibleStudios.length} Active Nodes
          </span>
        </motion.div>
      </div>

      {/* Map Container with 3D transform */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence mode="wait">
          {viewMode === "india" ? (
            <motion.div 
              key="india-map"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ duration: 0.6, type: "spring", damping: 20 }}
              className="relative w-full h-full flex items-center justify-center p-12"
            >
              <IndiaMapSVG 
                hoveredState={hoveredState}
                onStateHover={setHoveredState}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="world-map"
              initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              transition={{ duration: 0.6, type: "spring", damping: 20 }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <WorldMapSVG activeRegions={[]} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Studio Pins */}
        <AnimatePresence>
          {visibleStudios.map((studio) => (
            <StudioPin
              key={studio.id}
              studio={studio}
              viewMode={viewMode}
              isHovered={hoveredStudio === studio.id}
              isSelected={selectedStudio?.id === studio.id}
              onClick={() => setSelectedStudio(studio)}
              onHover={(hovered) => setHoveredStudio(hovered ? studio.id : null)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Studio Details Sheet */}
      <Sheet open={!!selectedStudio} onOpenChange={() => setSelectedStudio(null)}>
        <SheetContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-[#FFAB00]/20 text-white overflow-y-auto w-full sm:max-w-lg p-0">
          {selectedStudio && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              {/* Header Image */}
              <div className="relative h-56 bg-gray-900 overflow-hidden">
                <motion.div 
                  className="absolute inset-0"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div 
                    className="absolute inset-0 opacity-50 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800)` }}
                  />
                </motion.div>
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 to-transparent" />
                
                {/* Grid pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,171,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,171,0,0.3) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }}
                />

                {/* Logo */}
                <motion.div 
                  className="absolute -bottom-10 left-6 flex items-end gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#FFAB00] bg-black shadow-2xl shadow-[#FFAB00]/20">
                    <img 
                      src={selectedStudio.logo} 
                      alt={selectedStudio.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </motion.div>

                {/* Close button */}
                <button 
                  onClick={() => setSelectedStudio(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-[#FFAB00] hover:text-black rounded-full transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Region badge */}
                <div className="absolute top-4 left-4">
                  <span 
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedStudio.region === "India" 
                        ? "bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/30"
                        : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    {selectedStudio.region}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pt-14 pb-8 space-y-6">
                <SheetHeader>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <SheetTitle className="font-display text-3xl uppercase text-white leading-none mb-2">
                      {selectedStudio.name}
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-2 text-gray-400 font-mono text-xs uppercase tracking-wider">
                      <MapPin className="w-3 h-3 text-[#FFAB00]" /> {selectedStudio.location}
                    </SheetDescription>
                  </motion.div>
                </SheetHeader>

                {/* Stats Grid */}
                <motion.div 
                  className="grid grid-cols-3 gap-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { icon: Users, label: "Team Size", value: selectedStudio.employees },
                    { icon: Building, label: "Founded", value: selectedStudio.founded },
                    { icon: Zap, label: "Rating", value: `${selectedStudio.rating}%` }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#FFAB00]/30 transition-colors group"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <stat.icon className="w-4 h-4 text-[#FFAB00] mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{stat.label}</div>
                      <div className="font-bold text-white">{stat.value}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Rating Bar */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="text-xs font-bold text-[#FFAB00] uppercase mb-3 tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4" /> Reputation Score
                  </h4>
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FFAB00] to-[#FF6B00] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedStudio.rating}%` }}
                      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedStudio.rating}%` }}
                      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                      style={{ mixBlendMode: "overlay" }}
                    />
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div 
                  className="bg-white/5 p-5 rounded-xl border border-white/5"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedStudio.description}
                  </p>
                </motion.div>

                {/* Games */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Known For</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudio.games.map((game, i) => (
                      <motion.span 
                        key={game} 
                        className="px-4 py-2 bg-[#FFAB00]/10 border border-[#FFAB00]/30 text-[#FFAB00] text-xs font-bold uppercase rounded-lg hover:bg-[#FFAB00]/20 transition-colors cursor-default"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {game}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.a 
                  href={selectedStudio.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#FFAB00] to-[#FF8C00] hover:from-[#FFB820] hover:to-[#FFA000] text-black font-bold uppercase tracking-widest text-sm transition-all duration-300 rounded-xl shadow-lg shadow-[#FFAB00]/20 group"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
                  Visit Official Site
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

// ============================================
// INFO CARD COMPONENT
// ============================================
const InfoCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay: number;
}) => {
  return (
    <motion.div 
      className="group relative bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-[#FFAB00]/30 transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFAB00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon */}
      <motion.div
        className="relative z-10"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#FFAB00]/10 border border-[#FFAB00]/20 flex items-center justify-center mb-4 group-hover:bg-[#FFAB00]/20 transition-colors">
          <Icon className="w-6 h-6 text-[#FFAB00]" />
        </div>
      </motion.div>
      
      <h3 className="relative z-10 font-display text-xl uppercase mb-2 text-white group-hover:text-[#FFAB00] transition-colors">
        {title}
      </h3>
      <p className="relative z-10 text-sm text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-[#FFAB00]/50 to-transparent transform translate-x-0 group-hover:translate-x-0 transition-transform" />
        <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-[#FFAB00]/50 to-transparent" />
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN STUDIOS PAGE
// ============================================
const Studios = () => {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Hero Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-[#FFAB00] font-mono text-sm uppercase tracking-widest border border-[#FFAB00]/30 px-4 py-2 rounded-full mb-6 bg-[#FFAB00]/5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Radar className="w-4 h-4 animate-pulse" />
            Global Intelligence Network
          </motion.span>
          
          <h1 className="font-display text-5xl md:text-7xl uppercase mb-4">
            Studio{" "}
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] via-yellow-500 to-[#FF8C00]"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Atlas
            </motion.span>
          </h1>
          
          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            Real-time tracking of India's premier game development facilities and their global counterparts. 
            Explore the network of studios shaping the future of gaming.
          </p>
        </motion.div>

        {/* Map Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <StudioMap />
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <InfoCard
            icon={Navigation}
            title="Interactive Map"
            description="Toggle between regional India operations and the wider global network using the command switch. Zoom and pan to explore."
            delay={0.1}
          />
          <InfoCard
            icon={Search}
            title="Live Tracking"
            description="Click on any active node to reveal detailed dossier including showreels, reputation stats, and team composition."
            delay={0.2}
          />
          <InfoCard
            icon={Building}
            title="Add Your Studio"
            description="Is your facility missing from the atlas? Contact command to request a database update and join the network."
            delay={0.3}
          />
        </div>

        <div className="mt-20">
          <Footer />
        </div>
      </main>
    </PageTransition>
  );
};

export default Studios;