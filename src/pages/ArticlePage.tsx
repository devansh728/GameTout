import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Clock, Calendar, Quote, ChevronRight , User} from "lucide-react";
import { ARTICLE_DATABASE } from "@/data/mockdata";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";

// --- HELPER: CONTENT BLOCK RENDERER ---
const ContentRenderer = ({ block }: { block: any }) => {
  if (block.type === "header") {
    return <h2 className="font-display text-3xl text-white mt-12 mb-6 uppercase border-l-4 border-[#FFAB00] pl-4">{block.content}</h2>;
  }
  if (block.type === "text") {
    return <p className="font-serif text-lg text-gray-300 leading-relaxed mb-6">{block.content}</p>;
  }
  if (block.type === "quote") {
    return (
      <blockquote className="my-10 p-8 bg-white/5 border border-white/10 rounded-xl relative">
        <Quote className="absolute top-4 left-4 w-8 h-8 text-[#FFAB00] opacity-20" />
        <p className="font-display text-2xl text-white text-center italic leading-normal">"{block.content}"</p>
      </blockquote>
    );
  }
  if (block.type === "image") {
    return (
      <div className="my-10">
        <img src={block.content} alt="Article visual" className="w-full rounded-lg border border-white/10" />
        {block.caption && <p className="text-xs text-center text-gray-500 mt-2 font-mono uppercase">{block.caption}</p>}
      </div>
    );
  }
  if (block.type === "video") {
    return (
      <div className="my-10 aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
        <iframe src={block.content} title="Embedded Video" className="w-full h-full" allowFullScreen />
      </div>
    );
  }
  return null;
};

const ArticlePage = () => {
  const { id } = useParams();
  const article = ARTICLE_DATABASE[id || ""] || ARTICLE_DATABASE["alba-adventure"]; // Fallback
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 200]); // Parallax effect
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  // Scroll to top on load
  useEffect(() => window.scrollTo(0, 0), [id]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a0a0a] selection:bg-[#FFAB00] selection:text-black">
        
        {/* --- 1. HERO SECTION (Immersive) --- */}
        <div className="relative h-[80vh] overflow-hidden">
          
          {/* Parallax Background */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
            <img src={article.heroImage} className="w-full h-full object-cover" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          </motion.div>

          {/* Navigation Back */}
          <div className="absolute top-24 left-4 md:left-8 z-20">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-[#FFAB00] hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Back to Base</span>
            </Link>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 max-w-5xl mx-auto">
             <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
             >
                {/* Meta Tags */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-black 
                        ${article.type === 'review' ? 'bg-[#FFAB00]' : 'bg-red-600 text-white'}`}>
                        {article.type}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-mono text-gray-300 uppercase">
                        <Calendar className="w-3 h-3" /> {article.date}
                    </span>
                    <span className="flex items-center gap-2 text-xs font-mono text-gray-300 uppercase">
                        <User className="w-3 h-3" /> {article.author}
                    </span>
                </div>

                <h1 className="font-display text-5xl md:text-7xl font-bold uppercase text-white leading-[0.9] mb-4 text-shadow-lg">
                    {article.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-serif italic border-l-4 border-[#FFAB00] pl-6">
                    {article.subtitle}
                </p>
             </motion.div>
          </div>
        </div>

        {/* --- 2. MAIN ARTICLE BODY --- */}
        <article className="px-4 md:px-8 py-16">
            <div className="max-w-3xl mx-auto">
                
                {/* Intro / Score Card (If Review) */}
                {article.type === 'review' && (
                    <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">GameTout Verdict</span>
                            <span className="text-white font-display text-xl uppercase">Masterpiece Status</span>
                        </div>
                        <div className="w-20 h-20 bg-[#FFAB00] rounded-full flex items-center justify-center shadow-[0_0_20px_#FFAB00]">
                            <span className="text-3xl font-black text-black">{article.score}</span>
                        </div>
                    </div>
                )}

                {/* Render Content Blocks */}
                {article.blocks.map((block, i) => (
                    <ContentRenderer key={i} block={block} />
                ))}

                {/* Author Signature */}
                <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                        <img src="https://github.com/shadcn.png" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white font-bold uppercase text-sm">Written By {article.author}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">GameTout Editor In Chief</p>
                    </div>
                </div>
            </div>
        </article>

        {/* --- 3. "READ NEXT" RAIL (Similar Content) --- */}
        <section className="py-16 border-t border-white/10 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h3 className="font-display text-3xl text-white uppercase mb-8">Related <span className="text-[#FFAB00]">Briefings</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dummy cards for now - in real app, map through article.relatedIds */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group relative h-64 rounded-lg overflow-hidden border border-white/10 cursor-pointer">
                            <img src={`https://images.unsplash.com/photo-${i === 1 ? '1605901309584-818e25960b8f' : '1627856014759-2a57fe5e577c'}?w=600`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="text-[#FFAB00] text-xs font-bold uppercase tracking-widest mb-2 block">Next Article</span>
                                <h4 className="font-display text-xl text-white uppercase leading-none group-hover:underline decoration-[#FFAB00]">
                                    Cyberpunk 2077: The Redemption Arc
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
};

export default ArticlePage;