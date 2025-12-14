import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 1. Ensure Link is imported
import { Link } from "react-router-dom"; 
import { Mic, Play, User, Star, ArrowRight, ShieldCheck, Zap, ChevronLeft, ChevronRight, UserPlus, ExternalLink, List, Film } from "lucide-react";

// --- DUMMY DATA ---
const operatives = [
  { id: 1, type: "dev", name: "Aditya Kumar", role: "VFX Artist (Lvl 5)", rate: "$45/hr", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: 2, type: "dev", name: "Priya Nair", role: "3D Modeler (Lvl 4)", rate: "$35/hr", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: 3, type: "cta", name: "Recruitment Open", role: "Join The Network", rate: "Apply Now", img: "" },
  { id: 4, type: "dev", name: "Vikram Singh", role: "Unity Dev (Lvl 6)", rate: "$55/hr", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
];

// --- 1. PORTFOLIO DECK (Unchanged) ---
const PortfolioDeck = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % operatives.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + operatives.length) % operatives.length);
  };

  const currentOp = operatives[index];

  return (
    <div className="h-[500px] relative bg-[#050505] border border-white/10 flex flex-col group">
      <div className="absolute top-0 left-0 right-0 z-20 bg-[#050505] border-b border-white/10 h-16 flex justify-between items-center px-6">
         <div className="flex items-center gap-2 text-green-500 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Spotlight
         </div>
         <Link to="/portfolios" className="flex items-center gap-2 text-xs font-bold uppercase text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded hover:bg-[#FFAB00] hover:text-black hover:border-[#FFAB00] transition-all">
            View Roster <ArrowRight className="w-3 h-3" />
         </Link>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentOp.id}
            custom={direction}
            variants={{
                enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 pt-20 pb-20 px-6 flex flex-col group/card"
          >
            {currentOp.type === "dev" ? (
                <>
                    <div className="relative flex-1 bg-gray-900 border border-white/10 overflow-hidden mb-4 group-hover/card:border-[#FFAB00] transition-colors">
                        <img src={currentOp.img} alt={currentOp.name} className="w-full h-full object-cover grayscale contrast-125 group-hover/card:grayscale-0 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <h3 className="font-display text-2xl text-white uppercase leading-none drop-shadow-md">{currentOp.name}</h3>
                            <p className="text-[#FFAB00] text-xs font-bold mt-1 bg-black/50 inline-block px-1 rounded">{currentOp.role}</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFAB00]/10 to-transparent h-[10px] w-full animate-scan pointer-events-none" style={{ animation: 'scan 3s linear infinite' }} />
                    </div>
                    <Link to="/portfolios" className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-[#FFAB00] transition-colors shadow-lg flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 fill-black" /> Initiate Contact
                    </Link>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#FFAB00]/30 bg-[#FFAB00]/5 p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#FFAB00]/20 flex items-center justify-center mb-4 animate-pulse">
                        <UserPlus className="w-8 h-8 text-[#FFAB00]" />
                    </div>
                    <h3 className="font-display text-2xl text-white uppercase mb-2">Are you Next?</h3>
                    <p className="text-gray-400 text-xs mb-6">List your portfolio on GameTout and get discovered by top Indian studios.</p>
                    <Link to="/contact" className="px-6 py-2 bg-[#FFAB00] text-black font-bold uppercase text-xs rounded-sm hover:bg-white transition-colors">
                        Create Profile
                    </Link>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-white/10 bg-[#050505] flex items-center justify-between px-6 z-20">
         <button onClick={prevStep} className="flex items-center gap-2 text-xs font-mono uppercase text-gray-500 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /> Prev</button>
         <div className="flex gap-1">
            {operatives.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? "bg-[#FFAB00]" : "bg-white/20"}`} />
            ))}
         </div>
         <button onClick={nextStep} className="flex items-center gap-2 text-xs font-mono uppercase text-gray-500 hover:text-white transition-colors">Next <ChevronRight className="w-4 h-4" /></button>
      </div>
      
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFAB00] z-30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFAB00] z-30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFAB00] z-30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFAB00] z-30" />
    </div>
  );
};

// --- 2. MEDIA CARD (Correct Links) ---
const MediaCard = ({ title, subtitle, icon: Icon, image, label, cta, link, categoryLink, viewAllLabel }: any) => (
  <motion.div 
    className="group relative h-64 overflow-hidden border border-white/10 bg-[#0a0a0a] cursor-pointer block"
    initial="rest"
    whileHover="hover"
    animate="rest"
  >
    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-20 group-hover:scale-105 group-hover:blur-[2px] transition-all duration-500" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

    <div className="absolute inset-0 p-8 flex flex-col justify-end overflow-hidden">
      <div className="absolute top-0 right-0 bg-black/60 backdrop-blur-md px-4 py-2 border-b border-l border-white/10 z-20">
        <div className="flex items-center gap-2 text-[#FFAB00] text-xs font-mono font-bold uppercase tracking-wider">
          <Icon className="w-3 h-3" /> {label}
        </div>
      </div>

      <motion.div 
        className="relative z-10"
        variants={{ rest: { y: 0 }, hover: { y: -50 } }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h3 className="font-display text-2xl md:text-3xl text-white uppercase leading-none mb-2 drop-shadow-lg group-hover:text-white transition-colors">{title}</h3>
        <p className="text-gray-300 text-sm max-w-sm border-l-2 border-[#FFAB00] pl-3 drop-shadow-md line-clamp-2">{subtitle}</p>
      </motion.div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-6 flex gap-3 bg-gradient-to-t from-black to-transparent"
        variants={{ rest: { y: "100%", opacity: 0 }, hover: { y: 0, opacity: 1 } }}
        transition={{ duration: 0.3, ease: "circOut" }}
      >
        <Link to={link} className="flex-1 bg-[#FFAB00] text-black h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-lg rounded-sm">
            <Play className="w-4 h-4 fill-black" /> {cta}
        </Link>
        <Link to={categoryLink} className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all rounded-sm">
            <List className="w-4 h-4" /> {viewAllLabel}
        </Link>
      </motion.div>
    </div>
  </motion.div>
);

// --- 3. DOCUMENTARY CARD (FIXED LINKS) ---
const DocumentaryCard = () => (
    <motion.div 
        className="lg:col-span-8 h-[500px] relative rounded-sm overflow-hidden border border-white/10 group cursor-pointer"
        initial="rest"
        whileHover="hover"
        animate="rest"
    >
        <img src="https://img.youtube.com/vi/UgbO7pLn1Cg/maxresdefault.jpg" alt="AC Evolution" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-40 group-hover:blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <motion.div 
            className="absolute bottom-0 p-8 w-full bg-gradient-to-t from-black via-black/80 to-transparent z-10"
            variants={{ rest: { y: 0 }, hover: { y: -60 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex items-center gap-3 mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm animate-pulse">Featured Doc</span>
                <span className="text-gray-300 text-xs font-mono uppercase tracking-widest">1 HR 09 MIN WATCH</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white uppercase leading-none mb-2 group-hover:text-[#FFAB00] transition-colors">The Assassin's Creed Evolution</h2>
            <p className="text-gray-300 text-sm max-w-lg line-clamp-2 group-hover:text-white">From Altaïr to Shadows. An exhaustive analysis of 17 years of stealth, parkour, and RPG mechanics.</p>
        </motion.div>

        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a0a]/90 backdrop-blur border-t border-white/10 flex items-center justify-between px-8 z-20"
            variants={{ rest: { y: "100%" }, hover: { y: 0 } }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
            {/* 2. FIXED: Link to the Article Page, NOT /documentary/watch */}
            <Link to="/content/documentary/ac-evolution" className="flex items-center gap-4 group/btn">
                <div className="w-12 h-12 rounded-full bg-[#FFAB00] flex items-center justify-center shadow-[0_0_20px_#FFAB00]">
                    <Play className="w-5 h-5 text-black fill-black ml-1 group-hover/btn:scale-110 transition-transform" />
                </div>
                <div>
                    <span className="block text-white font-display text-lg uppercase leading-none group-hover/btn:text-[#FFAB00] transition-colors">Watch Now</span>
                    <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">Start Playback</span>
                </div>
            </Link>

            {/* 3. FIXED: Link using React Router */}
            <Link to="/documentary" className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-3 rounded hover:bg-white/5">
                <Film className="w-4 h-4" /> View Full Library
            </Link>
        </motion.div>
    </motion.div>
);

// --- MAIN COMPONENT ---
export const HeroCommandCenter = () => {
  return (
    <section className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <DocumentaryCard />
        <div className="lg:col-span-4">
            <PortfolioDeck />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MediaCard 
            title="The Dark Layers of Gaming"
            subtitle="Feat. Zassar. We discuss toxicity, trolls, and content creation struggles."
            image="https://img.youtube.com/vi/FKBwFAju-0o/maxresdefault.jpg"
            icon={Mic}
            label="On Air Now"
            cta="Listen"
            viewAllLabel="All Episodes"
            link="/content/podcast/dark-layers" // FIXED: Links to Article
            categoryLink="/podcast"
          />

          <MediaCard 
            title="Alba: A Wild Adventure"
            subtitle="A cozy masterpiece that proves you don't need violence to be impactful."
            image="https://img.youtube.com/vi/bssnEF16BTs/maxresdefault.jpg"
            icon={Star}
            label="Verdict: Masterpiece"
            cta="Read"
            viewAllLabel="All Reviews"
            link="/content/review/alba-adventure" // FIXED: Links to Article
            categoryLink="/reviews"
          />
      </div>
    </section>
  );
};