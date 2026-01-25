import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, UploadCloud, Layout, Type, Image, Video, Tag,
  Calendar, Clock, Link2, Eye, EyeOff, Zap, CheckCircle,
  AlertCircle, Sparkles, FileText, Send, Loader2, RefreshCw,
  ChevronDown, Globe, Lock, Trash2, Copy, ExternalLink, Maximize2,
  Plus, X, Twitter, Facebook, Instagram, Youtube, Twitch, Linkedin
} from "lucide-react";
import { BlockEditor } from "../../components/BlockEditor";
import { MediaUploader } from "../../components/MediaUploader";
import { ContentBlock, createPost, savePostBlocks, PostCreateRequest, getPresignedUploadUrl, UploadMetadata, MediaUploadResult, } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/PageTransition";
import { usePreview } from "@/admin/context/PreviewContext";


const bucketUrl = import.meta.env.VITE_S3_BUCKET_URL || "http://localhost:9000/media";

// ============================================
// TYPES & CONSTANTS
// ============================================
type PostType = "DOCUMENTARIES" | "REVIEWS" | "PODCASTS" | "STUDIOS";
type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

const postTypeConfig: Record<PostType, { color: string; icon: any; label: string }> = {
  PODCASTS: { color: "#3B82F6", icon: Zap, label: "(Podcasts)" },
  REVIEWS: { color: "#FFAB00", icon: Sparkles, label: "Game Reviews" },
  DOCUMENTARIES: { color: "#A855F7", icon: FileText, label: "Documentaries" },
  STUDIOS: { color: "#10B981", icon: Layout, label: "Studios" },
};

const postStatusConfig: Record<PostStatus, { color: string; icon: any; label: string }> = {
  DRAFT: { color: "#6B7280", icon: Lock, label: "Draft Mode" },
  PUBLISHED: { color: "#10B981", icon: Globe, label: "Live on Grid" },
  SCHEDULED: { color: "#F59E0B", icon: Clock, label: "Scheduled" },
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

const glowVariants = {
  idle: { boxShadow: "0 0 0 rgba(255,171,0,0)" },
  hover: { boxShadow: "0 0 30px rgba(255,171,0,0.3)" },
  focus: { boxShadow: "0 0 40px rgba(255,171,0,0.4)" }
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function CreatePost() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPreviewData } = usePreview();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState<"metadata" | "content">("metadata");

  // Metadata State with localStorage persistence
  const [metadata, setMetadata] = useState<PostCreateRequest>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('gametout-draft-metadata');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Show notification that draft was loaded
        setTimeout(() => {
          toast({
            title: "📝 Draft Loaded",
            description: "Your previous draft has been restored.",
          });
        }, 500);
        return parsed;
      } catch {
        return {
          title: "",
          description: "",
          thumbnailUrl: "",
          videoEmbedUrl: "",
          category: "",
          postType: "REVIEWS",
          postStatus: "DRAFT",
          publishedAt: new Date().toISOString(),
          timeline: "PT0S",
          socialLinks: {}
        };
      }
    }
    return {
      title: "",
      description: "",
      thumbnailUrl: "",
      videoEmbedUrl: "",
      category: "",
      postType: "REVIEWS",
      postStatus: "DRAFT",
      publishedAt: new Date().toISOString(),
      timeline: "PT0S",
      socialLinks: {}
    };
  });

  // Content Blocks State with localStorage persistence
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    const saved = localStorage.getItem('gametout-draft-blocks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever metadata or blocks change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('gametout-draft-metadata', JSON.stringify(metadata));
      localStorage.setItem('gametout-draft-blocks', JSON.stringify(blocks));
    }, 500); // Debounce 500ms
    return () => clearTimeout(timer);
  }, [metadata, blocks]);

  // Form validation
  const formValidation = useMemo(() => ({
    title: metadata.title.length >= 5,
    description: metadata.description.length >= 20,
    thumbnail: metadata.thumbnailUrl.length > 0,
    hasContent: blocks.length > 0,
  }), [metadata, blocks]);

  const isFormValid = Object.values(formValidation).every(Boolean);
  const completionPercentage = useMemo(() => {
    const checks = Object.values(formValidation);
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [formValidation]);

  // Auto-save simulation
  useEffect(() => {
    if (metadata.title || blocks.length > 0) {
      setAutoSaveStatus("saving");
      const timeout = setTimeout(() => {
        setAutoSaveStatus("saved");
        setLastSaved(new Date());
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [metadata, blocks]);

  const handlePublish = async () => {
    if (!isFormValid) {
      toast({
        title: "Validation Failed",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const postResponse = await createPost(metadata);
      const newPostId = postResponse.data.id;
      const orderedBlocks = blocks.map((b, i) => ({ ...b, order: i }));
      await savePostBlocks(newPostId, orderedBlocks);

      // Clear localStorage draft after successful publish
      localStorage.removeItem('gametout-draft-metadata');
      localStorage.removeItem('gametout-draft-blocks');

      toast({
        title: "✓ Protocol Broadcasted",
        description: "Transmission successful. Content is now live on the grid."
      });

      // Optionally navigate to posts list or reset form
      navigate('/admin/posts');
    } catch (error) {
      console.error(error);
      toast({
        title: "Transmission Failed",
        description: "Network error. Please retry.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  //detect file type is image or video
  const isImage = (fileType: string): boolean => {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return acceptedImageTypes.includes(fileType);
  }

  const isVideo = (fileType: string): boolean => {
    const acceptedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    return acceptedVideoTypes.includes(fileType);
  }

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
  const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];

  const MAX_IMAGE_SIZE = 10485760; // 10MB
  const MAX_VIDEO_SIZE = 52428800; // 50MB
  const MAX_OTHER_SIZE = 10485760; // 10MB for other types

  function isAllowedFileType(fileType: string): boolean {
    return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOCUMENT_TYPES].includes(fileType);
  }

  function getMaxSizeForType(fileType: string): number {
    if (ALLOWED_IMAGE_TYPES.includes(fileType)) return MAX_IMAGE_SIZE;
    if (ALLOWED_VIDEO_TYPES.includes(fileType)) return MAX_VIDEO_SIZE;
    return MAX_OTHER_SIZE;
  }

  function validateFilename(filename: string): boolean {
    const allowedChars = /^[a-zA-Z0-9\-_\.\s]+$/;
    if (!allowedChars.test(filename)) return false;
    return filename.includes('.');
  }

  function extensionMatchesContentType(filename: string, contentType: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return false;

    const typeMap: Record<string, string[]> = {
      'jpeg': ['image/jpeg'],
      'jpg': ['image/jpeg'],
      'png': ['image/png'],
      'gif': ['image/gif'],
      'webp': ['image/webp'],
      'mp4': ['video/mp4'],
      'webm': ['video/webm'],
      'pdf': ['application/pdf']
    };

    return typeMap[extension]?.includes(contentType) ?? false;
  }

  async function uploadWithRetry(uploadUrl: string, file: File, fileType: string, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', fileType);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            console.log(`Upload progress: ${percentComplete}%`);
            // You could update UI here
          }
        };

        const uploadPromise = new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.response);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error('Upload failed'));
        });

        xhr.send(file);
        await uploadPromise;
        return; // Success
      } catch (error) {
        if (i === retries - 1) {
          throw error;
        }

        const delay = Math.pow(2, i) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  const handleMediaUpload = async (file: File): Promise<MediaUploadResult> => {
    const fileName = file.name;
    const fileType = file.type;

    // Validate inputs
    if (!fileType) throw new Error("File type is required");
    if (!fileName) throw new Error("File name is required");
    if (!file) throw new Error("File is required");
    if (!validateFilename(fileName)) throw new Error("Invalid filename");
    if (!isAllowedFileType(fileType)) throw new Error("Unsupported file type");
    if (!extensionMatchesContentType(fileName, fileType)) throw new Error("File extension doesn't match content type");

    // Validate file size
    const maxSize = getMaxSizeForType(fileType);
    if (file.size > maxSize) {
      throw new Error(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }

    try {
      const presignResponse = await getPresignedUploadUrl(fileName, fileType);

      if (!presignResponse.data?.uploadUrl || !presignResponse.data?.objectKey) {
        throw new Error("Invalid presign response: missing required fields");
      }

      const { uploadUrl, objectKey, publicUrl } = presignResponse.data;
      if (!publicUrl) {
        presignResponse.data.publicUrl = `${bucketUrl}/${objectKey}`;
      }

      try {
        await uploadWithRetry(uploadUrl, file, fileType);

        const metadata: UploadMetadata = {
          originalFilename: fileName,
          contentType: fileType,
          size: file.size,
          uploadDate: new Date()
        };

        return {
          objectKey,
          publicUrl,
          metadata
        };
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Media upload error:", error);
      let errorMessage = "Failed to upload media";

      if (error instanceof Error) {
        errorMessage = error.message;

        if (error.message.includes("403")) {
          errorMessage = "Access denied. Please check your permissions.";
        } else if (error.message.includes("404")) {
          errorMessage = "Upload service not found. Please try again later.";
        } else if (error.message.includes("size exceeds")) {
          errorMessage = error.message; // Keep the specific size error
        }
      }

      throw new Error(errorMessage);
    }
  };


  const handleSaveDraft = useCallback(() => {
    toast({ title: "Draft Saved", description: "Your progress has been cached locally." });
    setLastSaved(new Date());
  }, [toast]);

  const handleClearDraft = useCallback(() => {
    if (confirm("Are you sure you want to clear the current draft? This cannot be undone.")) {
      localStorage.removeItem('gametout-draft-metadata');
      localStorage.removeItem('gametout-draft-blocks');
      
      // Reset to default state
      setMetadata({
        title: "",
        description: "",
        thumbnailUrl: "",
        videoEmbedUrl: "",
        category: "",
        postType: "REVIEWS",
        postStatus: "DRAFT",
        publishedAt: new Date().toISOString(),
        timeline: "PT0S",
        socialLinks: {}
      });
      setBlocks([]);
      
      toast({ 
        title: "Draft Cleared", 
        description: "All content has been removed." 
      });
    }
  }, [toast]);

  // Full Preview navigation (only for REVIEWS and DOCUMENTARIES)
  const canFullPreview = metadata.postType === "REVIEWS" || metadata.postType === "DOCUMENTARIES";

  const handleFullPreview = useCallback(() => {
    if (!canFullPreview) return;

    // Set preview data in context
    setPreviewData({
      metadata,
      blocks
    });

    // Navigate to preview page
    navigate("/admin/preview");
  }, [canFullPreview, metadata, blocks, setPreviewData, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#030303] relative overflow-hidden">

        {/* Background Effects */}
        <BackgroundEffects />

        {/* Main Content */}
        <div className="relative z-10 px-4 md:px-8 pt-24 pb-32">
          <motion.div
            className="max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            {/* Header Section */}
            <Header
              isSubmitting={isSubmitting}
              isFormValid={isFormValid}
              completionPercentage={completionPercentage}
              autoSaveStatus={autoSaveStatus}
              lastSaved={lastSaved}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview(!showPreview)}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
              onClearDraft={handleClearDraft}
              canFullPreview={canFullPreview}
              onFullPreview={handleFullPreview}
            />

            {/* Progress Bar */}
            <ProgressIndicator
              percentage={completionPercentage}
              validation={formValidation}
            />

            {/* Mobile Tab Switcher */}
            <div className="lg:hidden">
              <TabSwitcher
                active={activeSection}
                onChange={setActiveSection}
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Metadata Form */}
              <motion.div
                className={`lg:col-span-4 space-y-6 ${activeSection !== "metadata" ? "hidden lg:block" : ""}`}
                variants={itemVariants}
              >
                <MetadataForm
                  metadata={metadata}
                  onChange={setMetadata}
                  validation={formValidation}
                  onThumbnailUpload={handleMediaUpload}
                />
              </motion.div>

              {/* Right Column: Block Editor */}
              <motion.div
                className={`lg:col-span-8 ${activeSection !== "content" ? "hidden lg:block" : ""}`}
                variants={itemVariants}
              >
                <EditorSection
                  blocks={blocks}
                  onChange={setBlocks}
                  showPreview={showPreview}
                  metadata={metadata}
                  onMediaUpload={handleMediaUpload}
                />
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

// ============================================
// BACKGROUND EFFECTS
// ============================================
const BackgroundEffects = () => {
  return (
    <>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,171,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,171,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-[#FFAB00]/5 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFAB00]/20 to-transparent"
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
};

// ============================================
// HEADER COMPONENT
// ============================================
interface HeaderProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  completionPercentage: number;
  autoSaveStatus: "idle" | "saving" | "saved";
  lastSaved: Date | null;
  showPreview: boolean;
  onTogglePreview: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  onClearDraft: () => void;
  canFullPreview: boolean;
  onFullPreview: () => void;
}

const Header = ({
  isSubmitting,
  isFormValid,
  completionPercentage,
  autoSaveStatus,
  lastSaved,
  showPreview,
  onTogglePreview,
  onPublish,
  onSaveDraft,
  onClearDraft,
  canFullPreview,
  onFullPreview
}: HeaderProps) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      variants={itemVariants}
    >
      <div>
        {/* Breadcrumb */}
        <motion.div
          className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-[#FFAB00]">ADMIN</span>
          <span>/</span>
          <span>CONTENT</span>
          <span>/</span>
          <span className="text-white">NEW TRANSMISSION</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-4xl md:text-5xl text-white mb-2 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Initialize Protocol
          </span>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-[#FFAB00]" />
          </motion.div>
        </motion.h1>

        {/* Subtitle with auto-save status */}
        <div className="flex items-center gap-4">
          <p className="text-gray-500 font-mono text-sm">
            Create new transmission entry for GameTout network.
          </p>
          <AutoSaveIndicator status={autoSaveStatus} lastSaved={lastSaved} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Full Preview Button (only for REVIEWS/DOCUMENTARIES) */}
        {canFullPreview && (
          <motion.button
            onClick={onFullPreview}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Full Preview</span>
          </motion.button>
        )}

        {/* Preview Toggle */}
        <motion.button
          onClick={onTogglePreview}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${showPreview
              ? "bg-[#FFAB00]/10 border-[#FFAB00]/50 text-[#FFAB00]"
              : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="hidden sm:inline">Preview</span>
        </motion.button>

        {/* Save Draft */}
        <motion.button
          onClick={onSaveDraft}
          className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save Draft</span>
        </motion.button>

        {/* Clear Draft */}
        <motion.button
          onClick={onClearDraft}
          className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-500/20 hover:border-red-500/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title="Clear all draft content"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </motion.button>

        {/* Publish Button */}
        <motion.button
          onClick={onPublish}
          disabled={isSubmitting || !isFormValid}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-wider overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
        >
          {/* Button background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#FFAB00] via-[#FFD700] to-[#FFAB00]"
            animate={{
              backgroundPosition: isSubmitting ? ["0% 50%", "100% 50%"] : "0% 50%"
            }}
            transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0 }}
            style={{ backgroundSize: "200% 100%" }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: "-200%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.8 }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-2 text-black">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Transmitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Publish to Grid</span>
              </>
            )}
          </div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: isFormValid
                ? ["0 0 20px rgba(255,171,0,0.3)", "0 0 40px rgba(255,171,0,0.5)", "0 0 20px rgba(255,171,0,0.3)"]
                : "none"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// AUTO SAVE INDICATOR
// ============================================
const AutoSaveIndicator = ({ status, lastSaved }: { status: string; lastSaved: Date | null }) => {
  return (
    <AnimatePresence mode="wait">
      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="flex items-center gap-2 text-xs font-mono"
        >
          {status === "saving" && (
            <>
              <RefreshCw className="w-3 h-3 text-[#FFAB00] animate-spin" />
              <span className="text-[#FFAB00]">Saving...</span>
            </>
          )}
          {status === "saved" && (
            <>
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-green-500">Saved</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// PROGRESS INDICATOR
// ============================================
interface ProgressIndicatorProps {
  percentage: number;
  validation: Record<string, boolean>;
}

const ProgressIndicator = ({ percentage, validation }: ProgressIndicatorProps) => {
  const steps = [
    { key: "title", label: "Title", icon: Type },
    { key: "description", label: "Summary", icon: FileText },
    { key: "thumbnail", label: "Thumbnail", icon: Image },
    { key: "hasContent", label: "Content", icon: Layout },
  ];

  return (
    <motion.div
      className="relative"
      variants={itemVariants}
    >
      {/* Progress bar background */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FFAB00] to-[#FFD700] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-3">
        {steps.map((step, i) => {
          const isComplete = validation[step.key as keyof typeof validation];
          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.key}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${isComplete
                    ? "bg-[#FFAB00] border-[#FFAB00] text-black"
                    : "bg-transparent border-white/20 text-gray-500"
                  }`}
                animate={isComplete ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {isComplete ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <StepIcon className="w-3 h-3" />
                )}
              </motion.div>
              <span className={`text-xs font-mono hidden sm:block ${isComplete ? "text-[#FFAB00]" : "text-gray-500"
                }`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================
// TAB SWITCHER (Mobile)
// ============================================
const TabSwitcher = ({ active, onChange }: { active: string; onChange: (tab: any) => void }) => {
  return (
    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
      {[
        { id: "metadata", label: "Metadata", icon: Layout },
        { id: "content", label: "Content", icon: FileText },
      ].map((tab) => {
        const TabIcon = tab.icon;
        const isActive = active === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${isActive
                ? "bg-[#FFAB00] text-black"
                : "text-gray-400 hover:text-white"
              }`}
            whileTap={{ scale: 0.98 }}
          >
            <TabIcon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
};

// ============================================
// METADATA FORM
// ============================================
interface MetadataFormProps {
  metadata: PostCreateRequest;
  onChange: (data: PostCreateRequest) => void;
  validation: Record<string, boolean>;
  onThumbnailUpload?: (file: File) => Promise<MediaUploadResult>;
}

const MetadataForm = ({ metadata, onChange, validation, onThumbnailUpload }: MetadataFormProps) => {
  const [thumbnailPreviewError, setThumbnailPreviewError] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Metadata Card */}
      <motion.div
        className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl"
        whileHover={{ borderColor: "rgba(255,171,0,0.3)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-[#FFAB00]/10 border border-[#FFAB00]/30 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Layout className="w-5 h-5 text-[#FFAB00]" />
            </motion.div>
            <div>
              <h3 className="font-display text-lg text-white">Meta Data</h3>
              <p className="text-xs text-gray-500 font-mono">Core transmission info</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {Object.values(validation).filter(Boolean).length}/{Object.values(validation).length}
            <span className="text-xs text-gray-500">fields</span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Title Input */}
          <FormInput
            label="Title"
            icon={Type}
            value={metadata.title}
            onChange={(value) => onChange({ ...metadata, title: value })}
            placeholder="Enter transmission title..."
            isValid={validation.title}
            maxLength={100}
            showCharCount
          />

          {/* Thumbnail Input with Preview */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
              <Image className="w-3 h-3" />
              Thumbnail
            </label>

            {onThumbnailUpload ? (
              <MediaUploader
                accept="image"
                value={metadata.thumbnailUrl}
                onUpload={onThumbnailUpload}
                onComplete={(publicUrl) => {
                  onChange({ ...metadata, thumbnailUrl: publicUrl });
                  setThumbnailPreviewError(false);
                }}
                onClear={() => onChange({ ...metadata, thumbnailUrl: "" })}
              />
            ) : (
              <>
                <FormInput
                  label=""
                  icon={Image}
                  value={metadata.thumbnailUrl}
                  onChange={(value) => {
                    onChange({ ...metadata, thumbnailUrl: value });
                    setThumbnailPreviewError(false);
                  }}
                  placeholder="https://..."
                  isValid={validation.thumbnail}
                  type="url"
                />

                {/* Thumbnail Preview */}
                <AnimatePresence>
                  {metadata.thumbnailUrl && !thumbnailPreviewError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative rounded-xl overflow-hidden border border-white/10"
                    >
                      <div className="aspect-video bg-black/50 relative">
                        <img
                          src={metadata.thumbnailUrl}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={() => setThumbnailPreviewError(true)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-xs font-mono text-white/60">
                          Preview
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Video URL */}
          <FormInput
            label="Video Embed URL"
            icon={Video}
            value={metadata.videoEmbedUrl || ""}
            onChange={(value) => onChange({ ...metadata, videoEmbedUrl: value })}
            placeholder="YouTube or Vimeo URL..."
            type="url"
            optional
          />

          {/* Type & Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Type"
              icon={Tag}
              value={metadata.postType}
              onChange={(value) => onChange({ ...metadata, postType: value as any })}
              options={Object.entries(postTypeConfig).map(([key, config]) => ({
                value: key,
                label: config.label,
                color: config.color
              }))}
            />
            <FormSelect
              label="Status"
              icon={metadata.postStatus === "PUBLISHED" ? Globe : Lock}
              value={metadata.postStatus}
              onChange={(value) => onChange({ ...metadata, postStatus: value as any })}
              options={Object.entries(postStatusConfig).map(([key, config]) => ({
                value: key,
                label: config.label,
                color: config.color
              }))}
            />
          </div>

          {/* Category */}
          <FormInput
            label="Category / Tags"
            icon={Tag}
            value={metadata.category}
            onChange={(value) => onChange({ ...metadata, category: value })}
            placeholder="RPG, Action, Indie..."
            optional
          />

          {/* Summary */}
          <FormTextarea
            label="Summary"
            value={metadata.description}
            onChange={(value) => onChange({ ...metadata, description: value })}
            placeholder="Brief overview of the content..."
            isValid={validation.description}
            maxLength={500}
            rows={4}
          />

          {/* Date/Time - LocalDateTime format for backend */}
          <DateTimeInput
            label="Publish Date & Time"
            value={metadata.publishedAt}
            onChange={(value) => onChange({ ...metadata, publishedAt: value })}
            optional
          />

          {/* Timeline - Duration picker for user-friendly input */}
          <DurationInput
            label="Content Duration"
            value={metadata.timeline || "PT0S"}
            onChange={(value) => onChange({ ...metadata, timeline: value })}
            optional
          />

          {/* Social Links - User-friendly platform inputs */}
          <SocialLinksInput
            label="Social Links"
            value={metadata.socialLinks || {}}
            onChange={(links) => onChange({ ...metadata, socialLinks: links })}
          />
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-px h-10 bg-gradient-to-b from-[#FFAB00]/50 to-transparent" />
          <div className="absolute top-0 right-0 w-10 h-px bg-gradient-to-l from-[#FFAB00]/50 to-transparent" />
        </div>
      </motion.div>

      {/* Quick Actions Card */}
      <motion.div
        className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
        whileHover={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Copy, label: "Duplicate", action: () => { } },
            { icon: Trash2, label: "Clear", action: () => { } },
            { icon: ExternalLink, label: "Templates", action: () => { } },
          ].map((action, i) => (
            <motion.button
              key={i}
              onClick={action.action}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// FORM INPUT COMPONENT
// ============================================
interface FormInputProps {
  label: string;
  icon: any;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isValid?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  optional?: boolean;
}

const FormInput = ({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  isValid,
  maxLength,
  showCharCount,
  optional
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
          <Icon className="w-3 h-3" />
          {label}
          {optional && <span className="text-gray-600 normal-case">(optional)</span>}
        </label>
        {showCharCount && maxLength && (
          <span className={`text-xs font-mono ${value.length > maxLength * 0.9 ? "text-[#FFAB00]" : "text-gray-600"
            }`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <motion.div
        className="relative"
        animate={isFocused ? "focus" : value ? "filled" : "idle"}
        variants={{
          idle: { scale: 1 },
          focus: { scale: 1.01 },
          filled: { scale: 1 }
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none transition-all ${isFocused
              ? "border-[#FFAB00] shadow-[0_0_20px_rgba(255,171,0,0.15)]"
              : isValid === false
                ? "border-red-500/50"
                : isValid === true
                  ? "border-green-500/30"
                  : "border-white/10 hover:border-white/20"
            }`}
        />

        {/* Validation indicator */}
        <AnimatePresence>
          {isValid !== undefined && value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {isValid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ============================================
// FORM SELECT COMPONENT
// ============================================
interface FormSelectProps {
  label: string;
  icon: any;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; color?: string }>;
}

const FormSelect = ({ label, icon: Icon, value, onChange, options }: FormSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {label}
      </label>

      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-white/20 transition-all"
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: selectedOption?.color || "white" }}
          >
            {selectedOption?.label}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
            >
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2 ${value === option.value ? "bg-white/5" : ""
                    }`}
                  whileHover={{ x: 5 }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: option.color }}
                  />
                  <span style={{ color: option.color }}>{option.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// FORM TEXTAREA COMPONENT
// ============================================
interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
  maxLength?: number;
  rows?: number;
}

const FormTextarea = ({ label, value, onChange, placeholder, isValid, maxLength, rows = 4 }: FormTextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
          <FileText className="w-3 h-3" />
          {label}
        </label>
        {maxLength && (
          <span className={`text-xs font-mono ${value.length > maxLength * 0.9 ? "text-[#FFAB00]" : "text-gray-600"
            }`}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <motion.div
        animate={isFocused ? "focus" : "idle"}
        variants={{
          idle: { scale: 1 },
          focus: { scale: 1.01 }
        }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none transition-all resize-none ${isFocused
              ? "border-[#FFAB00] shadow-[0_0_20px_rgba(255,171,0,0.15)]"
              : isValid === false
                ? "border-red-500/50"
                : isValid === true
                  ? "border-green-500/30"
                  : "border-white/10 hover:border-white/20"
            }`}
        />
      </motion.div>
    </div>
  );
};

// ============================================
// DATE TIME INPUT COMPONENT
// ============================================
interface DateTimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}

const DateTimeInput = ({ label, value, onChange, optional }: DateTimeInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
  const toDateTimeLocal = (isoString: string): string => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";
      // Format: YYYY-MM-DDTHH:mm
      return date.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  // Convert datetime-local to ISO string for backend (LocalDateTime format)
  const toISOString = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return new Date().toISOString();
    try {
      // datetime-local returns "YYYY-MM-DDTHH:mm", we need "YYYY-MM-DDTHH:mm:ss"
      const withSeconds = dateTimeLocal + ":00";
      // Validate the date
      const date = new Date(withSeconds);
      if (isNaN(date.getTime())) return new Date().toISOString();
      return withSeconds;
    } catch {
      return new Date().toISOString();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
          <Calendar className="w-3 h-3" />
          {label}
        </label>
        {optional && <span className="text-xs text-gray-600 italic">Optional</span>}
      </div>

      <motion.div
        className="relative"
        animate={isFocused ? "focus" : "idle"}
        variants={glowVariants}
      >
        <input
          type="datetime-local"
          value={toDateTimeLocal(value)}
          onChange={(e) => onChange(toISOString(e.target.value))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all ${
            isFocused
              ? "border-[#FFAB00] shadow-[0_0_20px_rgba(255,171,0,0.15)]"
              : "border-white/10 hover:border-white/20"
          }`}
        />
      </motion.div>
      <p className="text-xs text-gray-600 font-mono">
        Format: LocalDateTime (YYYY-MM-DDTHH:mm:ss)
      </p>
    </div>
  );
};

// ============================================
// DURATION INPUT COMPONENT
// ============================================
interface DurationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}

const DurationInput = ({ label, value, onChange, optional }: DurationInputProps) => {
  // Parse ISO 8601 Duration (e.g., "PT1H30M45S") to hours, minutes, seconds
  const parseDuration = (duration: string): { hours: number; minutes: number; seconds: number } => {
    if (!duration || !duration.startsWith("PT")) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    const secondsMatch = duration.match(/(\d+)S/);
    return {
      hours: hoursMatch ? parseInt(hoursMatch[1]) : 0,
      minutes: minutesMatch ? parseInt(minutesMatch[1]) : 0,
      seconds: secondsMatch ? parseInt(secondsMatch[1]) : 0,
    };
  };

  // Convert hours, minutes, seconds to ISO 8601 Duration
  const toDuration = (hours: number, minutes: number, seconds: number): string => {
    let result = "PT";
    if (hours > 0) result += `${hours}H`;
    if (minutes > 0) result += `${minutes}M`;
    if (seconds > 0 || result === "PT") result += `${seconds}S`;
    return result;
  };

  const { hours, minutes, seconds } = parseDuration(value);

  const handleChange = (field: "hours" | "minutes" | "seconds", val: string) => {
    const numVal = Math.max(0, parseInt(val) || 0);
    const newDuration = toDuration(
      field === "hours" ? numVal : hours,
      field === "minutes" ? Math.min(59, numVal) : minutes,
      field === "seconds" ? Math.min(59, numVal) : seconds
    );
    onChange(newDuration);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
          <Clock className="w-3 h-3" />
          {label}
        </label>
        {optional && <span className="text-xs text-gray-600 italic">Optional</span>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { field: "hours" as const, val: hours, label: "Hours", max: 99 },
          { field: "minutes" as const, val: minutes, label: "Min", max: 59 },
          { field: "seconds" as const, val: seconds, label: "Sec", max: 59 },
        ].map(({ field, val, label: fieldLabel, max }) => (
          <div key={field} className="space-y-1">
            <label className="text-[10px] text-gray-600 uppercase">{fieldLabel}</label>
            <input
              type="number"
              min={0}
              max={max}
              value={val}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center outline-none focus:border-[#FFAB00] transition-colors"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600 font-mono">
        Output: {value || "PT0S"} (ISO 8601 Duration)
      </p>
    </div>
  );
};

// ============================================
// SOCIAL LINKS INPUT COMPONENT
// ============================================
interface SocialLinksInputProps {
  label: string;
  value: Record<string, string>;
  onChange: (links: Record<string, string>) => void;
}

const SOCIAL_PLATFORMS = [
  { key: "twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/..." },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/..." },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/..." },
  { key: "twitch", label: "Twitch", icon: Twitch, placeholder: "https://twitch.tv/..." },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/..." },
  { key: "discord", label: "Discord", icon: Link2, placeholder: "https://discord.gg/..." },
  { key: "website", label: "Website", icon: Globe, placeholder: "https://..." },
];

const SocialLinksInput = ({ label, value, onChange }: SocialLinksInputProps) => {
  const [showAdd, setShowAdd] = useState(false);

  const activePlatforms = Object.keys(value);
  const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !activePlatforms.includes(p.key));

  const handleAdd = (platformKey: string) => {
    onChange({ ...value, [platformKey]: "" });
    setShowAdd(false);
  };

  const handleRemove = (platformKey: string) => {
    const newLinks = { ...value };
    delete newLinks[platformKey];
    onChange(newLinks);
  };

  const handleChange = (platformKey: string, url: string) => {
    onChange({ ...value, [platformKey]: url });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
          <Link2 className="w-3 h-3" />
          {label}
        </label>
        <span className="text-xs text-gray-600">
          {activePlatforms.length} link{activePlatforms.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Active Links */}
      <div className="space-y-2">
        {activePlatforms.map((platformKey) => {
          const platform = SOCIAL_PLATFORMS.find(p => p.key === platformKey);
          const Icon = platform?.icon || Link2;
          return (
            <motion.div
              key={platformKey}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg min-w-[120px]">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 capitalize">{platform?.label || platformKey}</span>
              </div>
              <input
                type="url"
                value={value[platformKey] || ""}
                onChange={(e) => handleChange(platformKey, e.target.value)}
                placeholder={platform?.placeholder || "https://..."}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#FFAB00] transition-colors"
              />
              <motion.button
                type="button"
                onClick={() => handleRemove(platformKey)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Add Platform Button */}
      {availablePlatforms.length > 0 && (
        <div className="relative" style={{ zIndex: 100 }}>
          <motion.button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-dashed border-white/20 rounded-lg text-xs text-gray-400 hover:text-white hover:border-[#FFAB00]/50 transition-all w-full justify-center"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus className="w-4 h-4" />
            Add Social Link
          </motion.button>

          <AnimatePresence>
            {showAdd && (
              <>
                {/* Backdrop to close dropdown */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0"
                  style={{ zIndex: 99 }}
                  onClick={() => setShowAdd(false)}
                />
                
                {/* Dropdown menu - opens upward to avoid being hidden */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-xl shadow-2xl grid grid-cols-2 gap-1 backdrop-blur-xl"
                  style={{ zIndex: 100, boxShadow: '0 -10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)' }}
                >
                  {availablePlatforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <motion.button
                        key={platform.key}
                        type="button"
                        onClick={() => handleAdd(platform.key)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all text-left"
                        whileHover={{ x: 4, backgroundColor: 'rgba(255,171,0,0.1)' }}
                      >
                        <Icon className="w-4 h-4" />
                        {platform.label}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Debug output */}
      {Object.keys(value).length > 0 && (
        <p className="text-xs text-gray-600 font-mono break-all">
          Output: {JSON.stringify(value)}
        </p>
      )}
    </div>
  );
};

// ============================================
// EDITOR SECTION
// ============================================
interface EditorSectionProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  showPreview: boolean;
  metadata: PostCreateRequest;
  onMediaUpload?: (file: File) => Promise<MediaUploadResult>;
}

const EditorSection = ({ blocks, onChange, showPreview, metadata, onMediaUpload }: EditorSectionProps) => {
  return (
    <motion.div
      className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-h-[600px]"
      whileHover={{ borderColor: "rgba(255,171,0,0.2)" }}
    >
      {/* Editor header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFAB00]/20 to-purple-500/20 border border-white/10 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <FileText className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="font-display text-lg text-white">
              {showPreview ? "Preview Mode" : "Content Editor"}
            </h3>
            <p className="text-xs text-gray-500 font-mono">
              {blocks.length} blocks • {showPreview ? "Read-only" : "Editing"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${showPreview
              ? "bg-blue-500/20 text-blue-400"
              : "bg-[#FFAB00]/20 text-[#FFAB00]"
            }`}>
            {showPreview ? "Preview" : "Edit"}
          </span>
        </div>
      </div>

      {/* Editor content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {showPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="prose prose-invert max-w-none"
            >
              <PreviewContent metadata={metadata} blocks={blocks} />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <BlockEditor blocks={blocks} onChange={onChange} onMediaUpload={onMediaUpload} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFAB00]/30 to-transparent" />
    </motion.div>
  );
};

// ============================================
// PREVIEW CONTENT
// ============================================
const PreviewContent = ({ metadata, blocks }: { metadata: PostCreateRequest; blocks: ContentBlock[] }) => {
  if (!metadata.title && blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Eye className="w-16 h-16 text-gray-700 mb-4" />
        </motion.div>
        <h3 className="text-xl text-gray-500 font-display mb-2">Nothing to Preview</h3>
        <p className="text-sm text-gray-600">Start adding content to see a live preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {metadata.thumbnailUrl && (
        <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
          <img
            src={metadata.thumbnailUrl}
            alt={metadata.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {metadata.title && (
        <h1 className="text-3xl font-display text-white">{metadata.title}</h1>
      )}

      {metadata.description && (
        <p className="text-gray-400 text-lg leading-relaxed">{metadata.description}</p>
      )}

      {blocks.length > 0 && (
        <div className="border-t border-white/10 pt-6 mt-6">
          <p className="text-sm text-gray-500">+ {blocks.length} content blocks</p>
        </div>
      )}
    </div>
  );
};



