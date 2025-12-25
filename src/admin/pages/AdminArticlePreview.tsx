import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Calendar, User, Quote, Code, Minus, Link2, AlertTriangle } from "lucide-react";
import { usePreview } from "@/admin/context/PreviewContext";
import { PageTransition } from "@/components/PageTransition";
import { ContentBlock } from "@/lib/adminApi";

// ============================================
// CONTENT BLOCK RENDERER
// Maps ContentBlock types to ArticlePage-like rendering
// ============================================
const ContentRenderer = ({ block }: { block: ContentBlock }) => {
  // HEADING block
  if (block.blockType === "HEADING") {
    return (
      <h2 className="font-display text-3xl text-white mt-12 mb-6 uppercase border-l-4 border-[#FFAB00] pl-4">
        {block.textContent || "Untitled Section"}
      </h2>
    );
  }

  // TEXT block
  if (block.blockType === "TEXT") {
    return (
      <p className="font-serif text-lg text-gray-300 leading-relaxed mb-6">
        {block.textContent || ""}
      </p>
    );
  }

  // QUOTE block
  if (block.blockType === "QUOTE") {
    return (
      <blockquote className="my-10 p-8 bg-white/5 border border-white/10 rounded-xl relative">
        <Quote className="absolute top-4 left-4 w-8 h-8 text-[#FFAB00] opacity-20" />
        <p className="font-display text-2xl text-white text-center italic leading-normal">
          "{block.textContent || ""}"
        </p>
        {block.caption && (
          <footer className="text-center text-gray-500 mt-4 text-sm">
            — {block.caption}
          </footer>
        )}
      </blockquote>
    );
  }

  // IMAGE block
  if (block.blockType === "IMAGE") {
    if (!block.mediaUrl) {
      return (
        <div className="my-10 p-8 bg-white/5 border border-dashed border-white/20 rounded-xl text-center">
          <p className="text-gray-500">Image not uploaded</p>
        </div>
      );
    }
    return (
      <div className="my-10">
        <img 
          src={block.mediaUrl} 
          alt={block.caption || "Article visual"} 
          className="w-full rounded-lg border border-white/10" 
        />
        {block.caption && (
          <p className="text-xs text-center text-gray-500 mt-2 font-mono uppercase">
            {block.caption}
          </p>
        )}
      </div>
    );
  }

  // VIDEO block
  if (block.blockType === "VIDEO") {
    if (!block.mediaUrl) {
      return (
        <div className="my-10 p-8 bg-white/5 border border-dashed border-white/20 rounded-xl text-center">
          <p className="text-gray-500">Video not uploaded</p>
        </div>
      );
    }
    
    // Check if it's an embed URL (YouTube/Vimeo) or direct video
    const isEmbed = block.mediaUrl.includes("youtube") || block.mediaUrl.includes("vimeo");
    
    if (isEmbed) {
      // Extract embed URL
      let embedUrl = block.mediaUrl;
      const youtubeMatch = block.mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      if (youtubeMatch) {
        embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      const vimeoMatch = block.mediaUrl.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }

      return (
        <div className="my-10 aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <iframe 
            src={embedUrl} 
            title="Embedded Video" 
            className="w-full h-full" 
            allowFullScreen 
          />
        </div>
      );
    }

    // Direct video file
    return (
      <div className="my-10 aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
        <video 
          src={block.mediaUrl} 
          controls 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // CODE block
  if (block.blockType === "CODE") {
    return (
      <div className="my-10 relative rounded-xl overflow-hidden border border-white/10">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <span className="text-xs font-mono text-gray-500 flex items-center gap-2">
            <Code className="w-3 h-3" />
            Code
          </span>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
        </div>
        <pre className="p-4 bg-black/80 overflow-x-auto">
          <code className="text-green-400 text-sm font-mono">
            {block.textContent || "// No code"}
          </code>
        </pre>
      </div>
    );
  }

  // DIVIDER block
  if (block.blockType === "DIVIDER") {
    return (
      <div className="my-12 flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <Minus className="w-4 h-4 text-[#FFAB00]/50" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    );
  }

  // EMBED block
  if (block.blockType === "EMBED") {
    return (
      <div className="my-10 p-6 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Link2 className="w-5 h-5 text-[#FFAB00]" />
          <span className="text-sm text-gray-400">External Embed</span>
        </div>
        {block.mediaUrl ? (
          <a 
            href={block.mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#FFAB00] hover:underline text-sm font-mono break-all"
          >
            {block.mediaUrl}
          </a>
        ) : (
          <p className="text-gray-500 text-sm">No embed URL provided</p>
        )}
      </div>
    );
  }

  return null;
};

// ============================================
// MAIN ADMIN ARTICLE PREVIEW PAGE
// ============================================
const AdminArticlePreview = () => {
  const navigate = useNavigate();
  const { previewData, clearPreview } = usePreview();

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // If no preview data, show error
  if (!previewData) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-[#FFAB00] mx-auto mb-4" />
            <h1 className="text-2xl font-display text-white mb-2">No Preview Data</h1>
            <p className="text-gray-500 mb-6">Navigate here from the Create Post page to preview your content.</p>
            <button
              onClick={() => navigate("/admin")}
              className="px-6 py-3 bg-[#FFAB00] text-black font-bold rounded-xl hover:bg-[#FFD700] transition-colors"
            >
              Go to Create Post
            </button>
          </div>
        </main>
      </PageTransition>
    );
  }

  const { metadata, blocks } = previewData;
  const isReview = metadata.postType === "REVIEWS";

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a0a0a] selection:bg-[#FFAB00] selection:text-black">
        
        {/* Preview Mode Banner */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-[#FFAB00] text-black py-2 px-4 flex items-center justify-center gap-4"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">
            Preview Mode — This content is not published
          </span>
          <button
            onClick={handleBack}
            className="ml-4 px-3 py-1 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-900 transition-colors"
          >
            Close Preview
          </button>
        </motion.div>

        {/* Hero Section */}
        <div className="relative h-[80vh] overflow-hidden pt-10">
          {/* Parallax Background */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
            {metadata.thumbnailUrl ? (
              <img 
                src={metadata.thumbnailUrl} 
                className="w-full h-full object-cover" 
                alt="Hero" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <p className="text-gray-600 text-lg">No thumbnail uploaded</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          </motion.div>

          {/* Navigation Back */}
          <div className="absolute top-24 left-4 md:left-8 z-20">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-[#FFAB00] hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 
              <span className="text-xs font-bold uppercase">Back to Editor</span>
            </button>
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
                  ${isReview ? 'bg-[#FFAB00]' : 'bg-purple-600 text-white'}`}>
                  {metadata.postType}
                </span>
                <span className="flex items-center gap-2 text-xs font-mono text-gray-300 uppercase">
                  <Calendar className="w-3 h-3" /> 
                  {new Date(metadata.publishedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2 text-xs font-mono text-gray-300 uppercase">
                  <User className="w-3 h-3" /> Admin Preview
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-bold uppercase text-white leading-[0.9] mb-4 text-shadow-lg">
                {metadata.title || "Untitled Post"}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-serif italic border-l-4 border-[#FFAB00] pl-6">
                {metadata.description || "No description provided"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Article Body */}
        <article className="px-4 md:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            
            {/* Score Card for Reviews */}
            {isReview && (
              <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">
                    GameTout Verdict
                  </span>
                  <span className="text-white font-display text-xl uppercase">
                    Preview Score
                  </span>
                </div>
                <div className="w-20 h-20 bg-[#FFAB00] rounded-full flex items-center justify-center shadow-[0_0_20px_#FFAB00]">
                  <span className="text-3xl font-black text-black">?</span>
                </div>
              </div>
            )}

            {/* Content Blocks */}
            {blocks.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-500 text-lg">No content blocks added yet.</p>
                <p className="text-gray-600 text-sm mt-2">Add blocks in the editor to see them here.</p>
              </div>
            ) : (
              blocks
                .sort((a, b) => a.order - b.order)
                .map((block, i) => (
                  <ContentRenderer key={`${block.blockType}-${i}`} block={block} />
                ))
            )}

            {/* Author Signature */}
            <div className="mt-16 pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="text-white font-bold uppercase text-sm">Preview Author</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest">GameTout Editor</p>
              </div>
            </div>
          </div>
        </article>

        {/* Footer placeholder */}
        <div className="py-16 border-t border-white/10 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <p className="text-gray-600 text-sm">
              This is a preview. The actual article page may include related content and footer elements.
            </p>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default AdminArticlePreview;
