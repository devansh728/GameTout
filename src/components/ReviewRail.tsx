import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ReviewItem {
    id: number;
    title: string;
    verdict: string;
    score: string;
    image: string;
    platform: string;
}

const reviews: ReviewItem[] = [
    {
        id: 1,
        title: "Spider-Man 2",
        verdict: "A spectacular sequel that improves on every aspect.",
        score: "9.5",
        image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=600&q=80",
        platform: "PS5"
    },
    {
        id: 2,
        title: "Alan Wake 2",
        verdict: "A mind-bending survival horror masterpiece.",
        score: "10",
        image: "https://images.unsplash.com/photo-1627856014759-2a57fe5e577c?w=600&q=80",
        platform: "PC"
    },
    {
        id: 3,
        title: "Starfield",
        verdict: "Ambitious but flawed space exploration.",
        score: "7.0",
        image: "https://images.unsplash.com/photo-1614720368825-4100910b0cc8?w=600&q=80",
        platform: "Xbox"
    },
    {
        id: 4,
        title: "Assassin's Creed Mirage",
        verdict: "A welcome return to the series' roots.",
        score: "8.0",
        image: "https://images.unsplash.com/photo-1586182987320-9f1476819589?w=600&q=80",
        platform: "Multi"
    },
    {
        id: 5,
        title: "Baldur's Gate 3",
        verdict: "The new standard for RPGs.",
        score: "10",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
        platform: "PC"
    },
    {
        id: 6,
        title: "Cyberpunk 2077: Phantom Liberty",
        verdict: "The redemption arc is complete.",
        score: "9.0",
        image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80",
        platform: "PC"
    }
];

const HexagonScore = ({ score }: { score: string }) => (
    <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(255,171,0,0.5)]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <polygon
                points="50 1 95 25 95 75 50 99 5 75 5 25"
                className="fill-[#FFAB00] stroke-white/20 stroke-2"
            />
        </svg>
        <span className="relative z-10 text-xl md:text-2xl font-display font-black text-black tracking-tighter">{score}</span>
    </div>
);

export const ReviewRail = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 340; // Card width + gap
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-24 bg-[#0f0f0f] relative overflow-hidden border-t border-white/5">
            {/* Background Texture: Cyberpunk Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

                {/* Section Header with Navigation Controls */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-[2px] w-8 bg-[#FFAB00]" />
                            <span className="text-[#FFAB00] font-mono text-xs tracking-[0.2em] uppercase">Critical Analysis</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white tracking-tight">
                            Review <span className="text-outline-white text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Rack</span>
                        </h2>
                    </div>

                    {/* Custom Navigation Buttons */}
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="p-3 rounded-full border border-white/10 bg-black/50 hover:bg-[#FFAB00] hover:text-black hover:border-[#FFAB00] transition-all duration-300 group"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-3 rounded-full border border-white/10 bg-black/50 hover:bg-[#FFAB00] hover:text-black hover:border-[#FFAB00] transition-all duration-300 group"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-12 pt-4 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide default scrollbar
                >
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            className="relative group flex-shrink-0 w-[280px] md:w-[320px] aspect-[3/4] rounded-sm bg-gray-900 snap-center cursor-pointer perspective-1000"
                            whileHover={{ y: -15, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {/* Card Container (The Box) */}
                            <div className="absolute inset-0 rounded-sm overflow-hidden border border-white/10 group-hover:border-[#FFAB00]/50 transition-colors duration-500 bg-black shadow-2xl">

                                {/* Image */}
                                <img
                                    src={review.image}
                                    alt={review.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                                />

                                {/* Holographic Sheen Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-20" />

                                {/* Gradient Shade for Text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                                {/* Score Badge */}
                                <div className="absolute top-0 right-4 transform -translate-y-1/2 group-hover:translate-y-4 transition-transform duration-500 z-30">
                                    <HexagonScore score={review.score} />
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-bold text-black bg-[#FFAB00] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                            {review.platform}
                                        </span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-[#FFAB00] text-[#FFAB00]" />)}
                                        </div>
                                    </div>

                                    <h3 className="font-display text-3xl font-bold text-white mb-2 leading-[0.9] uppercase italic transform origin-left group-hover:scale-105 transition-transform">
                                        {review.title}
                                    </h3>

                                    {/* Expandable Verdict */}
                                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                                        <div className="overflow-hidden">
                                            <p className="text-gray-300 text-sm font-medium border-l-2 border-[#FFAB00] pl-3 py-1 mt-2 leading-relaxed">
                                                {review.verdict}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floor Reflection/Shadow */}
                            <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/50 blur-xl rounded-[100%] group-hover:bg-[#FFAB00]/20 transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>

                <a href="/reviews" className="mb-1 group flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-gray-400 hover:text-[#FFAB00] transition-colors uppercase">
                    <span className="hidden md:inline">View All Archive</span>
                    <span className="md:hidden">View All</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </section>
    );
};