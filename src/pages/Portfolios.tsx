import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, ExternalLink, UserPlus, List, Grid, CheckCircle, Clock, XCircle, Award, Zap } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { EvervaultCard } from "@/components/EvervaultCard";
import { SkillBar } from "@/components/HealthBar";
import { Footer } from "@/components/Footer";
import { WantedStars } from "@/components/WantedStars";
import { CreatePortfolioModal } from "@/components/CreatePortfolioModal";

// --- ENHANCED DATA STRUCTURE ---
const roles = ["All", "Programmer", "Artist", "Designer", "Producer", "Audio"];
const availabilityOptions = ["All", "Open for Work", "Freelance", "Deployed"];

const developers = [
  {
    id: 1,
    name: "Aditya Kumar",
    role: "Senior Game Programmer",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    portfolio: "#",
    reputation: 5,
    status: "Open for Work", // NEW: Status
    rate: "$45/hr", // NEW: Recruiter Info
    exp: "6 Yrs",   // NEW: Experience
    badges: ["AAA Shipped", "Unity Certified"], // NEW: Badges
    skills: [
      { name: "Unity", level: 95 },
      { name: "C#", level: 90 },
    ],
    category: "Programmer",
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "3D Character Artist",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    portfolio: "#",
    reputation: 4,
    status: "Freelance",
    rate: "$30/hr",
    exp: "4 Yrs",
    badges: ["ZBrush Master"],
    skills: [
      { name: "ZBrush", level: 92 },
      { name: "Maya", level: 88 },
    ],
    category: "Artist",
  },
  {
    id: 3,
    name: "Rahul Sharma",
    role: "Game Designer",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    portfolio: "#",
    reputation: 3,
    status: "Deployed", // Hired
    rate: "N/A",
    exp: "2 Yrs",
    badges: ["Game Jam Winner"],
    skills: [
      { name: "Level Design", level: 88 },
    ],
    category: "Designer",
  },
  // ... add more as needed
];

// --- HELPER COMPONENT: STATUS BADGE ---
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

// --- HELPER COMPONENT: TACTICAL LIST ROW (For Recruiters) ---
const TacticalRow = ({ dev }: { dev: any }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-black/40 border border-white/5 hover:border-[#FFAB00] rounded-sm transition-all duration-200"
  >
    {/* Avatar & Name */}
    <div className="flex items-center gap-4 w-full md:w-1/4">
      <img src={dev.avatar} alt={dev.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
      <div>
        <h4 className="font-display text-white text-lg leading-none">{dev.name}</h4>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin className="w-3 h-3" /> {dev.location}
        </div>
      </div>
    </div>

    {/* Role & Badges */}
    <div className="w-full md:w-1/4">
      <div className="text-[#FFAB00] font-bold text-sm mb-1">{dev.role}</div>
      <div className="flex gap-1 flex-wrap">
        {dev.badges.map((b: string) => (
          <span key={b} className="text-[10px] bg-white/10 px-1 rounded text-gray-300">{b}</span>
        ))}
      </div>
    </div>

    {/* Stats (XP / Rate) */}
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

    {/* Status & Action */}
    <div className="w-full md:w-1/3 flex items-center justify-between gap-4">
      <StatusBadge status={dev.status} />
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-white/5 hover:bg-[#FFAB00] hover:text-black text-xs font-bold uppercase border border-white/10 transition-colors">
          View
        </button>
        <button className="px-3 py-1 bg-[#FFAB00]/10 text-[#FFAB00] hover:bg-[#FFAB00] hover:text-black text-xs font-bold uppercase border border-[#FFAB00]/50 transition-colors">
          Contact
        </button>
      </div>
    </div>
  </motion.div>
);

const Portfolios = () => {
  const [activeRole, setActiveRole] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All"); // NEW: Filter by Status
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // NEW: Toggle State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter Logic
  const filteredDevelopers = developers.filter((dev) => {
    const roleMatch = activeRole === "All" || dev.category === activeRole;
    const statusMatch = activeStatus === "All" || dev.status === activeStatus; // Simple matching logic
    // For real app, map "Open for Work" to data status more carefully if needed
    if (activeStatus === "Open for Work") return roleMatch && dev.status === "Open for Work";
    if (activeStatus === "Freelance") return roleMatch && dev.status === "Freelance";
    if (activeStatus === "Deployed") return roleMatch && dev.status === "Deployed";
    return roleMatch;
  });

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pt-20 selection:bg-[#FFAB00] selection:text-black">

        <CreatePortfolioModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Header Section */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <FadeInView>
            <span className="inline-block px-4 py-1 rounded-full bg-[#FFAB00]/10 text-[#FFAB00] text-sm font-bold font-mono mb-4 border border-[#FFAB00]/20">
              // OPERATIVE_DATABASE
            </span>
            <h1 className="font-display text-5xl md:text-6xl mb-4 text-white">
              Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFAB00] to-yellow-200">Roster</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Access the dossier of India's elite game developers. Filter by specialization, clearance level, and availability status.
            </p>
          </FadeInView>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="group relative px-6 py-3 bg-[#0a0a0a] border border-[#FFAB00] text-[#FFAB00] font-bold uppercase tracking-widest overflow-hidden hover:text-black transition-colors shadow-[0_0_20px_rgba(255,171,0,0.2)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> Enlist Now
            </span>
            <div className="absolute inset-0 bg-[#FFAB00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </motion.button>
        </section>

        {/* CONTROL BAR (Filters + View Toggle) */}
        <section className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-y border-white/5 py-4 mb-12">
          <div className="px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">

            {/* Filters */}
            <div className="flex flex-col gap-2">
              {/* Role Filter */}
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all border ${activeRole === role
                        ? "bg-[#FFAB00] text-black border-[#FFAB00]"
                        : "bg-black/50 text-gray-500 border-white/10 hover:border-white/30"
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Status Filter (New) */}
              <div className="flex gap-4 items-center">
                <span className="text-[10px] font-mono text-gray-600 uppercase">Availability:</span>
                {availabilityOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`text-xs font-medium transition-colors hover:text-white ${activeStatus === status ? "text-[#FFAB00] underline underline-offset-4" : "text-gray-500"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-black/50 border border-white/10 rounded p-1 self-start md:self-center">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                title="Gallery View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-gray-500 hover:text-white"}`}
                title="Tactical View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* CONTENT AREA */}
        <section className="px-4 md:px-8 max-w-7xl mx-auto pb-20 min-h-[500px]">
          <AnimatePresence mode="wait">

            {/* GRID VIEW (Visual) */}
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredDevelopers.map((dev, index) => (
                  <FadeInView key={dev.id} delay={index * 0.1}>
                    <EvervaultCard className="h-full">
                      <div className="p-6 flex flex-col h-full relative">
                        {/* Recruiter Quick Info (Top Right) */}
                        <div className="absolute top-4 right-4 text-right">
                          <StatusBadge status={dev.status} />
                        </div>

                        {/* Avatar */}
                        <div className="flex items-start gap-4 mb-4 mt-2">
                          <div className="relative">
                            <img
                              src={dev.avatar}
                              alt={dev.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-[#FFAB00]/50"
                            />
                          </div>
                          <div>
                            <h3 className="font-display text-xl text-white leading-none mb-1">{dev.name}</h3>
                            <p className="text-[#FFAB00] text-xs font-bold uppercase">{dev.role}</p>
                            <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-1 font-mono uppercase">
                              <MapPin className="w-3 h-3" /> {dev.location}
                            </p>
                          </div>
                        </div>

                        {/* Badges Row */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
                          {dev.badges.map((b) => (
                            <span key={b} className="flex-shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-300">
                              <Award className="w-3 h-3 text-[#FFAB00]" /> {b}
                            </span>
                          ))}
                        </div>

                        <div className="flex-1 space-y-3 mb-6">
                          {dev.skills.slice(0, 3).map((skill) => (
                            <SkillBar key={skill.name} skill={skill.name} level={skill.level} />
                          ))}
                        </div>

                        <div className="flex gap-3 mt-auto">
                          <motion.a href={dev.portfolio} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#FFAB00] text-black rounded-sm text-xs font-bold uppercase hover:bg-white transition-colors">
                            <Briefcase className="w-3 h-3" /> Dossier
                          </motion.a>
                          <motion.a href="#" className="p-2 border border-white/10 rounded-sm hover:bg-white/10 text-white">
                            <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        </div>
                      </div>
                    </EvervaultCard>
                  </FadeInView>
                ))}
              </motion.div>
            ) : (

              /* LIST VIEW (Tactical) */
              <motion.div
                key="list"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                {/* List Header */}
                <div className="hidden md:flex px-4 py-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest border-b border-white/10 mb-2">
                  <div className="w-1/4">Operative ID</div>
                  <div className="w-1/4">Specialization</div>
                  <div className="w-1/6">Stats</div>
                  <div className="w-1/3">Status & Action</div>
                </div>

                {filteredDevelopers.map((dev) => (
                  <TacticalRow key={dev.id} dev={dev} />
                ))}
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