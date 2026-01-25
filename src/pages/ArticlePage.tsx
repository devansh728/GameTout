import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Quote, Calendar, User, ThumbsUp, AlertCircle, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/SkeletonLoader";

// API Hooks and Utils
import { useBlogPost, useLikePost } from "@/hooks/useBlogPosts";
import { 
  getPostThumbnail, 
  hasVideoEmbed, 
  getYouTubeEmbedUrl,
  formatPublishedDate,
  formatLikes 
} from "@/utils/mediaUtils";
import { ContentBlock, BlockType, PostType } from "@/types/api";

// --- HELPER: CONTENT BLOCK RENDERER ---
const ContentBlockRenderer = ({ block }: { block: ContentBlock }) => {
  switch (block.blockType) {
    case BlockType.HEADING:
      return (
        <h2 className="font-display text-3xl text-white mt-12 mb-6 uppercase border-l-4 border-[#FFAB00] pl-4">
          {block.textContent}
        </h2>
      );
    
    case BlockType.TEXT:
      return (
        <div 
          className="font-serif text-lg text-gray-300 leading-relaxed mb-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: block.textContent || "" }}
        />
      );
    
    case BlockType.QUOTE:
      return (
        <blockquote className="my-10 p-8 bg-white/5 border border-white/10 rounded-xl relative">
          <Quote className="absolute top-4 left-4 w-8 h-8 text-[#FFAB00] opacity-20" />
          <p className="font-display text-2xl text-white text-center italic leading-normal">
            "{block.textContent}"
          </p>
        </blockquote>
      );
    
    case BlockType.IMAGE:
      return (
        <div className="my-10">
          <img 
            src={block.mediaUrl || ""} 
            alt={block.caption || "Article visual"} 
            className="w-full rounded-lg border border-white/10"
            loading="lazy"
          />
          {block.caption && (
            <p className="text-xs text-center text-gray-500 mt-2 font-mono uppercase">
              {block.caption}
            </p>
          )}
        </div>
      );
    
    case BlockType.VIDEO:
      return (
        <div className="my-10 aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <iframe 
            src={block.mediaUrl || ""} 
            title="Embedded Video" 
            className="w-full h-full" 
            allowFullScreen 
          />
        </div>
      );
    
    case BlockType.EMBED:
      return (
        <div className="my-10 aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <iframe 
            src={block.mediaUrl || ""} 
            title="Embedded Content" 
            className="w-full h-full" 
            allowFullScreen 
          />
        </div>
      );
    
    case BlockType.CODE:
      return (
        <pre className="my-6 p-4 bg-black/50 border border-white/10 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono text-green-400">
            {block.textContent}
          </code>
        </pre>
      );
    
    case BlockType.DIVIDER:
      return (
        <hr className="my-12 border-white/10" />
      );
    
    default:
      return null;
  }
};

// Loading skeleton for article
const ArticleSkeleton = () => (
  <div className="px-4 md:px-8 py-16">
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  </div>
);

const ArticlePage = () => {
  const { type, id } = useParams();
  const postId = parseInt(id || "0", 10);
  
  // Fetch post data
  const { data: post, isLoading, error } = useBlogPost(postId);
  const likeMutation = useLikePost();
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  // Scroll to top on load
  useEffect(() => window.scrollTo(0, 0), [id]);

  // Handle like button click
  const handleLike = () => {
    if (post && !likeMutation.isPending) {
      likeMutation.mutate(post.id);
    }
  };

  // Determine if we should render content blocks
  // REVIEWS and DOCUMENTARIES have content blocks, PODCASTS do not
  const shouldRenderBlocks = post && (
    post.postType === PostType.REVIEWS || 
    post.postType === PostType.DOCUMENTARIES
  );

  // For PODCASTS, redirect to video embed if available
  if (post?.postType === PostType.PODCASTS && hasVideoEmbed(post)) {
    // Open video in new tab and go back
    window.open(post.videoEmbedUrl || "", "_blank");
    return <Navigate to="/podcast" replace />;
  }

  // Get hero media - prioritize video embed with autoplay
  const heroImage = post ? getPostThumbnail(post) : "";
  const heroVideoEmbedUrl = post?.videoEmbedUrl 
    ? getYouTubeEmbedUrl(post.videoEmbedUrl, { autoplay: true, mute: true, controls: false, loop: true })
    : null;
  const videoEmbedUrl = post?.videoEmbedUrl 
    ? getYouTubeEmbedUrl(post.videoEmbedUrl, { autoplay: false, controls: true })
    : null;

  // Error state
  if (error) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="font-display text-3xl text-white mb-2">Article Not Found</h1>
            <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/" 
              className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider rounded hover:bg-primary/80 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a0a0a] selection:bg-[#FFAB00] selection:text-black">
        
        {/* --- 1. HERO SECTION (Immersive) --- */}
        <div className="relative h-[80vh] overflow-hidden">
          
          {/* Parallax Background */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
            {isLoading ? (
              <div className="w-full h-full bg-gray-900 animate-pulse" />
            ) : heroVideoEmbedUrl ? (
              /* Autoplay video background if video embed exists */
              <div className="w-full h-full relative">
                <iframe
                  src={heroVideoEmbedUrl}
                  title={post?.title || "Hero Video"}
                  className="w-full h-full object-cover scale-125"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            ) : (
              <img src={heroImage} className="w-full h-full object-cover" alt={post?.title || "Hero"} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          </motion.div>

          {/* Navigation Back */}
          <div className="absolute top-24 left-4 md:left-8 z-20">
            <Link 
              to={type === "review" ? "/reviews" : type === "documentary" ? "/documentary" : "/"}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-[#FFAB00] hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 
              <span className="text-xs font-bold uppercase">Back</span>
            </Link>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 max-w-5xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ) : post && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Meta Tags */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-black 
                    ${post.postType === PostType.REVIEWS ? 'bg-[#FFAB00]' : 'bg-red-600 text-white'}`}>
                    {post.postType}
                  </span>
                  <span className="flex items-center gap-2 text-xs font-mono text-gray-300 uppercase">
                    <Calendar className="w-3 h-3" /> {formatPublishedDate(post.publishedAt)}
                  </span>
                  {post.category && (
                    <span className="flex items-center gap-2 text-xs font-mono text-gray-300 uppercase">
                      <User className="w-3 h-3" /> {post.category}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-5xl md:text-7xl font-bold uppercase text-white leading-[0.9] mb-4 text-shadow-lg">
                  {post.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-serif italic border-l-4 border-[#FFAB00] pl-6">
                  {post.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* --- 2. MAIN ARTICLE BODY --- */}
        {isLoading ? (
          <ArticleSkeleton />
        ) : post && (
          <article className="px-4 md:px-8 py-16">
            <div className="max-w-3xl mx-auto">
              
              {/* Score Card (If Review) */}
              {post.postType === PostType.REVIEWS && post.rates > 0 && (
                <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">GameTout Verdict</span>
                    <span className="text-white font-display text-xl uppercase">
                      {post.rates >= 90 ? "Masterpiece" : 
                       post.rates >= 80 ? "Great" : 
                       post.rates >= 70 ? "Good" : 
                       post.rates >= 60 ? "Okay" : "Mixed"}
                    </span>
                  </div>
                  <div className="w-20 h-20 bg-[#FFAB00] rounded-full flex items-center justify-center shadow-[0_0_20px_#FFAB00]">
                    <span className="text-3xl font-black text-black">{(post.rates / 10).toFixed(1)}</span>
                  </div>
                </div>
              )}

              {/* Video Embed (if has video and is documentary) */}
              {post.postType === PostType.DOCUMENTARIES && videoEmbedUrl && (
                <div className="mb-12 aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                  <iframe 
                    src={videoEmbedUrl} 
                    title={post.title}
                    className="w-full h-full" 
                    allowFullScreen 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              {/* Render Content Blocks - Only for REVIEWS and DOCUMENTARIES */}
              {shouldRenderBlocks && post.contentBlocks && post.contentBlocks.length > 0 && (
                <div className="content-blocks">
                  {post.contentBlocks
                    .sort((a, b) => a.blockOrder - b.blockOrder)
                    .map((block) => (
                      <ContentBlockRenderer key={block.id} block={block} />
                    ))}
                </div>
              )}

              {/* Fallback if no content blocks */}
              {shouldRenderBlocks && (!post.contentBlocks || post.contentBlocks.length === 0) && (
                <div className="text-center py-12 text-gray-400">
                  <p>No content available for this article.</p>
                </div>
              )}

              {/* Like Button & Stats */}
              <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                <button 
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {likeMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-5 h-5" />
                  )}
                  <span className="font-bold">{formatLikes(post.likes)}</span>
                </button>
                
                <div className="text-sm text-gray-500">
                  Published {formatPublishedDate(post.publishedAt)}
                </div>
              </div>

              {/* Author Signature */}
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                  <img src="https://github.com/shadcn.png" className="w-full h-full object-cover" alt="Author" />
                </div>
                <div>
                  <p className="text-white font-bold uppercase text-sm">GameTout Editorial</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">
                    {post.category || "Gaming Insights"}
                  </p>
                </div>
              </div>
            </div>
          </article>
        )}

        <Footer />
      </main>
    </PageTransition>
  );
};

export default ArticlePage;