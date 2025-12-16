import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, ExternalLink, UserPlus, List, Grid, CheckCircle, Clock, XCircle, Award, Zap, Search, ChevronRight, ChevronLeft, Terminal, Filter, ArrowRight } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { EvervaultCard } from "@/components/EvervaultCard";
import { SkillBar } from "@/components/HealthBar";
import { Footer } from "@/components/Footer";
import { CreatePortfolioModal } from "@/components/CreatePortfolioModal";
import { ProfileViewModal } from "@/components/ProfileViewModal";
import { Link } from "react-router-dom";

// --- MOCK DATA ---
const roles = ["All", "Programmer", "Artist", "Designer", "Audio", "Producer"];
const availabilityOptions = ["All", "Open for Work", "Freelance", "Deployed"];

const generateDevs = (count: number) => Array.from({ length: count }).map((_, i) => ({
  id: i + 1,
  name: i % 2 === 0 ? "Aditya Kumar" : "Priya Nair",
  role: i % 3 === 0 ? "Senior Game Programmer" : (i % 3 === 1 ? "3D Character Artist" : "Level Designer"),
  location: i % 2 === 0 ? "Bangalore" : "Mumbai",
  avatar: i % 2 === 0 ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  portfolio: "#",
  status: i % 3 === 0 ? "Open for Work" : (i % 3 === 1 ? "Freelance" : "Deployed"),
  rate: i % 2 === 0 ? "$45/hr" : "$30/hr",
  exp: "5 Yrs",
  badges: i % 2 === 0 ? ["AAA Shipped", "Unity"] : ["ZBrush", "Indie"],
  skills: [{ name: "Unreal 5", level: 90 }, { name: "C++", level: 85 }],
  category: i % 3 === 0 ? "Programmer" : (i % 3 === 1 ? "Artist" : "Designer"),
}));

const developers = generateDevs(20);

// --- 3D TILT WRAPPER ---
const PerspectiveItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    // (Animation logic remains the same as previous)
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div ref={ref} className={`perspective-1000 ${className}`}>
            {children}
        </div>
    );
};

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  let color = "bg-gray-500";
  let icon = <Clock className="w-3 h-3" />;

  if (status === "Open for Work") {
    color = "bg-green-500 shadow-[0_0_10px_#22c55e]";
    icon = <CheckCircle className="w-3 h-3" />;
  } else if (status === "Freelance") {
    color = "bg-[#FFAB00] shadow-[0_0_10px_#FFAB00]";
    icon = <Zap className="w-3 h-3 text-black" />;
  } else if (status === "Deployed") {
    color = "bg-red-500";
    icon = <XCircle className="w-3 h-3" />;
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${color} bg-opacity-10 border border-current text-[10px] font-bold uppercase tracking-wider text-white`}>
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      {status}
    </div>
  );
};

// FIXED: Added onClick prop to interface
const TacticalRow = ({ dev, onClick }: { dev: any; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-black/40 border border-white/5 hover:border-[#FFAB00] rounded-sm transition-all duration-200 hover:bg-white/5 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-4 w-full md:w-1/4">
      <img src={dev.avatar} alt={dev.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
      <div>
        <h4 className="font-display text-white text-lg leading-none">{dev.name}</h4>
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
      <div className="text-gray-400">
        <span className="block text-[10px] uppercase">EXP</span>
        <span className="text-white">{dev.exp}</span>
      </div>
      <div className="text-gray-400">
        <span className="block text-[10px] uppercase">Rate</span>
        <span className="text-white">{dev.rate}</span>
      </div>
    </div>
    <div className="w-full md:w-1/3 flex items-center justify-between gap-4">
      <StatusBadge status={dev.status} />
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-white/5 hover:bg-[#FFAB00] hover:text-black text-xs font-bold uppercase border border-white/10 transition-colors">
          View
        </button>
      </div>
    </div>
  </motion.div>
);

const CategoryRail = ({ title, items, onSelect }: { title: string; items: any[]; onSelect: (dev: any) => void }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="mb-16 relative group/rail">
            <div className="flex items-end justify-between mb-6 px-1 border-b border-white/5 pb-2">
                <h3 className="font-display text-2xl md:text-4xl text-white uppercase flex items-center gap-3 tracking-wide">
                    <span className="w-1.5 h-8 bg-[#FFAB00] shadow-[0_0_10px_#FFAB00]" />
                    {title} 
                    <span className="text-white/20 text-lg font-mono tracking-widest">[{items.length}]</span>
                </h3>
                <div className="flex gap-1 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-300">
                    <button onClick={() => scroll("left")} className="p-3 bg-black border border-white/10 hover:bg-[#FFAB00] hover:text-black hover:border-[#FFAB00] transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => scroll("right")} className="p-3 bg-black border border-white/10 hover:bg-[#FFAB00] hover:text-black hover:border-[#FFAB00] transition-all"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-12 pt-4 px-2 scrollbar-none snap-x snap-mandatory mask-linear-fade-right"
                style={{ perspective: "1000px" }}
            >
                {items.map((dev, i) => (
                    <motion.div 
                        key={dev.id + title}
                        className="snap-center min-w-[340px] w-[340px] h-[480px] cursor-pointer"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        onClick={() => onSelect(dev)}
                    >
                        <PerspectiveItem className="h-full w-full">
                            {/* UPDATED VISUALS: Golden Tint in Resting State */}
                            <EvervaultCard className="h-full bg-gradient-to-b from-[#0a0a0a] to-[#12100b] border border-[#FFAB00]/10 hover:border-[#FFAB00]/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                <div className="p-8 flex flex-col h-full relative z-20">
                                    
                                    {/* Top Metadata */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex -space-x-2">
                                            {dev.badges.map((b: string, idx: number) => (
                                                <div key={idx} className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-[#FFAB00]" title={b}>
                                                    <Award className="w-3 h-3" />
                                                </div>
                                            ))}
                                        </div>
                                        <StatusBadge status={dev.status} />
                                    </div>

                                    {/* Identity Block */}
                                    <div className="text-center mb-6">
                                        <div className="relative inline-block mb-4">
                                            <div className="absolute inset-0 rounded-full bg-[#FFAB00] blur-md opacity-20 animate-pulse" />
                                            <img src={dev.avatar} alt={dev.name} className="relative w-24 h-24 rounded-full object-cover border-2 border-[#FFAB00]" />
                                        </div>
                                        <h3 className="font-display text-3xl text-white leading-none mb-1">{dev.name}</h3>
                                        <p className="text-[#FFAB00] text-xs font-bold uppercase tracking-widest">{dev.role}</p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded border border-white/10">
                                        <div className="text-center border-r border-white/10">
                                            <p className="text-[10px] text-gray-500 uppercase">Location</p>
                                            <p className="text-white text-xs font-bold flex justify-center items-center gap-1"><MapPin className="w-3 h-3" /> {dev.location}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-500 uppercase">Experience</p>
                                            <p className="text-white text-xs font-bold">{dev.exp}</p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex-1 space-y-3 mb-6">
                                        {dev.skills.slice(0, 2).map((skill: any, idx: number) => (
                                            <SkillBar key={idx} skill={skill.name} level={skill.level} />
                                        ))}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex gap-3 mt-auto">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FFAB00] text-black text-xs font-bold uppercase hover:bg-white transition-colors shadow-lg hover:shadow-[#FFAB00]/50 rounded-sm">
                                            <Briefcase className="w-4 h-4" /> View Dossier
                                        </button>
                                    </div>
                                </div>
                            </EvervaultCard>
                        </PerspectiveItem>
                    </motion.div>
                ))}
                
                {/* "View All" Card */}
                <div className="snap-center min-w-[200px] flex items-center justify-center">
                    <Link to="#" className="w-full h-[80%] flex flex-col items-center justify-center border border-dashed border-[#FFAB00]/20 hover:border-[#FFAB00] rounded-xl group transition-all hover:bg-[#FFAB00]/5">
                        <div className="w-16 h-16 rounded-full bg-[#FFAB00]/5 flex items-center justify-center group-hover:bg-[#FFAB00] transition-colors mb-4 shadow-lg group-hover:shadow-[#FFAB00]/50 group-hover:scale-110 duration-300">
                            <ArrowRight className="w-8 h-8 text-[#FFAB00] group-hover:text-black" />
                        </div>
                        <span className="font-display text-xl text-gray-500 group-hover:text-white uppercase tracking-wider">Expand {title}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Portfolios = () => {
  const [activeRole, setActiveRole] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDev, setSelectedDev] = useState<any>(null);

  // Filter Logic
  const getFilteredDevs = (category: string) => {
    return developers.filter((dev) => {
      const roleMatch = category === "All" || dev.category === category;
      const searchMatch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dev.role.toLowerCase().includes(searchQuery.toLowerCase());
      return roleMatch && searchMatch;
    });
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-20 selection:bg-[#FFAB00] selection:text-black relative overflow-hidden">

        {/* --- GLOBAL BG EFFECTS (Cyber Grid) --- */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(rgba(255, 171, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 171, 0, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-background via-transparent to-background"></div>

        {/* MODALS */}
        <CreatePortfolioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <ProfileViewModal isOpen={!!selectedDev} onClose={() => setSelectedDev(null)} developer={selectedDev} />

        {/* HEADER SECTION */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
          <FadeInView>
            <span className="inline-block px-4 py-1 rounded-full bg-[#FFAB00]/10 text-[#FFAB00] text-sm font-bold font-mono mb-4 border border-[#FFAB00]/20 animate-pulse">
              // SECURE_CONNECTION_ESTABLISHED
            </span>
            <h1 className="font-display text-6xl md:text-8xl mb-4 text-white uppercase tracking-tighter">
              Talent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] to-yellow-500">Network</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl font-mono">
              The centralized mainframe of India's elite game developers.
            </p>
          </FadeInView>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-4 bg-[#0a0a0a] border border-[#FFAB00] text-[#FFAB00] font-bold uppercase tracking-widest overflow-hidden hover:text-black transition-colors shadow-[0_0_30px_rgba(255,171,0,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              <UserPlus className="w-5 h-5" /> Initialize Profile
            </span>
            <div className="absolute inset-0 bg-[#FFAB00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </motion.button>
        </section>

        {/* CONTROL DECK */}
        <section className="sticky top-20 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-y border-white/10 py-4 mb-16 shadow-2xl">
          <div className="px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-center">
            
            {/* Search Module */}
            <div className="relative w-full lg:w-1/3 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FFAB00] transition-colors" />
                <input 
                    type="text" 
                    placeholder="SCAN DATABASE..." 
                    className="w-full bg-black/50 border border-white/10 rounded-none px-12 py-3 text-sm text-white focus:outline-none focus:border-[#FFAB00] focus:bg-black/80 transition-all font-mono uppercase placeholder:text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Terminal className="w-4 h-4 text-[#FFAB00] animate-pulse opacity-0 group-focus-within:opacity-100" />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex-1 w-full overflow-x-auto pb-1 scrollbar-none">
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 text-gray-500 border-r border-white/10 mr-2">
                    <Filter className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase">Division</span>
                </div>
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`whitespace-nowrap px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all skew-x-[-10deg] ${activeRole === role
                        ? "bg-[#FFAB00] text-black shadow-[0_0_15px_rgba(255,171,0,0.4)]"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <span className="skew-x-[10deg] inline-block">{role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-black border border-white/10 p-1 shrink-0 gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
                title="Gallery View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#FFAB00] text-black" : "text-gray-500 hover:text-white"}`}
                title="Tactical View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* DATABASE CONTENT */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20 min-h-[500px] relative z-10">
          <AnimatePresence mode="wait">

            {/* SCENARIO 1: "ALL" SELECTED (Netflix Style Rails) */}
            {activeRole === "All" && viewMode === "grid" && !searchQuery ? (
                <motion.div
                    key="netflix-view"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-8"
                >
                    <CategoryRail title="Elite Operatives" items={developers.slice(0, 6)} onSelect={setSelectedDev} />
                    <CategoryRail title="Engineering Division" items={developers.filter(d => d.category === "Programmer")} onSelect={setSelectedDev} />
                    <CategoryRail title="Visual Arts Corps" items={developers.filter(d => d.category === "Artist")} onSelect={setSelectedDev} />
                    <CategoryRail title="System Architects" items={developers.filter(d => d.category === "Designer")} onSelect={setSelectedDev} />
                </motion.div>
            ) : (

            /* SCENARIO 2: FILTERED GRID or SEARCH RESULTS */
            viewMode === "grid" ? (
              <motion.div
                key="filtered-grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                 <div className="flex items-center gap-2 mb-8 text-gray-500 font-mono text-sm uppercase border-b border-[#FFAB00]/30 pb-2 inline-block">
                    <Terminal className="w-4 h-4 text-[#FFAB00]" />
                    Targeting: <span className="text-white">{activeRole}</span> // Hits: <span className="text-[#FFAB00]">{getFilteredDevs(activeRole).length}</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {getFilteredDevs(activeRole).map((dev, index) => (
                    <FadeInView key={dev.id} delay={index * 0.05}>
                        <div onClick={() => setSelectedDev(dev)} className="cursor-pointer h-full">
                            <PerspectiveItem className="h-full">
                                <EvervaultCard className="h-full bg-[#0a0a0a]">
                                    {/* Same inner content as rail... duplicating for demo brevity */}
                                    <div className="p-8 flex flex-col h-full relative z-20">
                                        <div className="absolute top-4 right-4 text-right">
                                            <StatusBadge status={dev.status} />
                                        </div>
                                        <div className="flex items-start gap-4 mb-4 mt-2">
                                            <img src={dev.avatar} alt={dev.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#FFAB00]/50" />
                                            <div>
                                                <h3 className="font-display text-xl text-white leading-none mb-1">{dev.name}</h3>
                                                <p className="text-[#FFAB00] text-xs font-bold uppercase">{dev.role}</p>
                                                <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-1 font-mono uppercase">
                                                    <MapPin className="w-3 h-3" /> {dev.location}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-3 mb-6">
                                            {dev.skills.slice(0, 3).map((skill: any, idx: number) => (
                                                <SkillBar key={idx} skill={skill.name} level={skill.level} />
                                            ))}
                                        </div>
                                        <div className="flex gap-3 mt-auto">
                                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FFAB00] text-black rounded-sm text-xs font-bold uppercase hover:bg-white transition-colors">
                                                <Briefcase className="w-3 h-3" /> Dossier
                                            </button>
                                        </div>
                                    </div>
                                </EvervaultCard>
                            </PerspectiveItem>
                        </div>
                    </FadeInView>
                    ))}
                 </div>
              </motion.div>
            ) : (

              /* SCENARIO 3: LIST VIEW (Tactical Table) */
              <motion.div
                key="list"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="hidden md:flex px-4 py-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest border-b border-white/10 mb-2">
                  <div className="w-1/4">Operative ID</div>
                  <div className="w-1/4">Specialization</div>
                  <div className="w-1/6">Stats</div>
                  <div className="w-1/3">Status & Action</div>
                </div>

                {getFilteredDevs(activeRole).map((dev) => (
                  <TacticalRow key={dev.id} dev={dev} onClick={() => setSelectedDev(dev)} />
                ))}
              </motion.div>
            ))}

          </AnimatePresence>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
};

export default Portfolios;