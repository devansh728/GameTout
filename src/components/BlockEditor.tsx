import { useState, useRef, useMemo, useCallback } from "react";
import { motion, Reorder, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Plus, Image, Type, Video, Trash2, GripVertical, Quote, 
  Code, Heading1, List, Link2, FileText, Sparkles, Zap,
  ChevronUp, ChevronDown, Copy, Eye, EyeOff, Check,
  AlertCircle, Maximize2, Minimize2, MoreHorizontal,
  Music, MapPin, Table, Divide, MessageSquare, Hash
} from "lucide-react";
import { ContentBlock, MediaUploadResult } from "@/lib/adminApi";
import { MediaUploader } from "./MediaUploader";

// ============================================
// TYPES & CONFIGURATIONS
// ============================================
type BlockType = "TEXT" | "IMAGE" | "VIDEO" | "QUOTE" | "HEADING" | "CODE" | "DIVIDER" | "EMBED";

interface BlockConfig {
  type: BlockType;
  icon: any;
  label: string;
  description: string;
  color: string;
  gradient: string;
}


const blockConfigs: Record<BlockType, BlockConfig> = {
  TEXT: { 
    type: "TEXT",
    icon: Type, 
    label: "Text", 
    description: "Paragraph content",
    color: "#3B82F6",
    gradient: "from-blue-500/20 to-blue-600/10"
  },
  HEADING: { 
    type: "HEADING",
    icon: Heading1, 
    label: "Heading", 
    description: "Section title",
    color: "#FFAB00",
    gradient: "from-[#FFAB00]/20 to-orange-600/10"
  },
  IMAGE: { 
    type: "IMAGE",
    icon: Image, 
    label: "Image", 
    description: "Visual media",
    color: "#10B981",
    gradient: "from-green-500/20 to-green-600/10"
  },
  VIDEO: { 
    type: "VIDEO",
    icon: Video, 
    label: "Video", 
    description: "Embedded video",
    color: "#EF4444",
    gradient: "from-red-500/20 to-red-600/10"
  },
  QUOTE: { 
    type: "QUOTE",
    icon: Quote, 
    label: "Quote", 
    description: "Highlighted quote",
    color: "#A855F7",
    gradient: "from-purple-500/20 to-purple-600/10"
  },
  CODE: { 
    type: "CODE",
    icon: Code, 
    label: "Code", 
    description: "Code snippet",
    color: "#06B6D4",
    gradient: "from-cyan-500/20 to-cyan-600/10"
  },
  DIVIDER: { 
    type: "DIVIDER",
    icon: Divide, 
    label: "Divider", 
    description: "Section break",
    color: "#6B7280",
    gradient: "from-gray-500/20 to-gray-600/10"
  },
  EMBED: { 
    type: "EMBED",
    icon: Link2, 
    label: "Embed", 
    description: "External content",
    color: "#F59E0B",
    gradient: "from-amber-500/20 to-amber-600/10"
  },
};

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  onMediaUpload?: (file: File) => Promise<MediaUploadResult>;
}

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const blockVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    x: -50,
    transition: { duration: 0.2 }
  }
};

const toolbarVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const toolButtonVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 }
  }
};

// ============================================
// MAIN BLOCK EDITOR COMPONENT
// ============================================
export const BlockEditor = ({ blocks, onChange, onMediaUpload }: BlockEditorProps) => {
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [showToolbar, setShowToolbar] = useState(true);
  const [previewMode, setPreviewMode] = useState<number | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stats
  const stats = useMemo(() => ({
    total: blocks.length,
    text: blocks.filter(b => b.blockType === "TEXT" || b.blockType === "HEADING").length,
    media: blocks.filter(b => b.blockType === "IMAGE" || b.blockType === "VIDEO").length,
    wordCount: blocks.reduce((acc, b) => acc + (b.textContent?.split(/\s+/).filter(Boolean).length || 0), 0)
  }), [blocks]);

  // Add a new block
  const addBlock = useCallback((type: BlockType) => {
    const newBlock: ContentBlock = {
      order: blocks.length,
      blockType: type,
      textContent: "",
      mediaUrl: "",
      caption: ""
    };
    onChange([...blocks, newBlock]);
  }, [blocks, onChange]);

  // Update a specific block
  const updateBlock = useCallback((index: number, field: keyof ContentBlock, value: string) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    onChange(newBlocks);
  }, [blocks, onChange]);

  // Remove a block
  const removeBlock = useCallback((index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    const reordered = newBlocks.map((b, i) => ({ ...b, order: i }));
    onChange(reordered);
  }, [blocks, onChange]);

  // Duplicate a block
  const duplicateBlock = useCallback((index: number) => {
    const blockToCopy = { ...blocks[index] };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, blockToCopy);
    const reordered = newBlocks.map((b, i) => ({ ...b, order: i }));
    onChange(reordered);
  }, [blocks, onChange]);

  // Move block up/down
  const moveBlock = useCallback((index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    const reordered = newBlocks.map((b, i) => ({ ...b, order: i }));
    onChange(reordered);
  }, [blocks, onChange]);

  // Handle reorder
  const handleReorder = useCallback((newOrder: ContentBlock[]) => {
    const reordered = newOrder.map((b, i) => ({ ...b, order: i }));
    onChange(reordered);
  }, [onChange]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <EditorHeader 
        stats={stats}
        showToolbar={showToolbar}
        onToggleToolbar={() => setShowToolbar(!showToolbar)}
      />

      {/* Block List */}
      <div className="mt-6 space-y-4">
        {blocks.length === 0 ? (
          <EmptyState onAddBlock={addBlock} />
        ) : (
          <Reorder.Group 
            axis="y" 
            values={blocks} 
            onReorder={handleReorder}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {blocks.map((block, index) => (
                <BlockCard
                  key={`${block.blockType}-${index}`}
                  block={block}
                  index={index}
                  totalBlocks={blocks.length}
                  isExpanded={expandedBlock === index}
                  isPreview={previewMode === index}
                  isDragging={draggedBlock === index}
                  onUpdate={(field, value) => updateBlock(index, field, value)}
                  onRemove={() => removeBlock(index)}
                  onDuplicate={() => duplicateBlock(index)}
                  onMove={(dir) => moveBlock(index, dir)}
                  onExpand={() => setExpandedBlock(expandedBlock === index ? null : index)}
                  onPreview={() => setPreviewMode(previewMode === index ? null : index)}
                  onDragStart={() => setDraggedBlock(index)}
                  onDragEnd={() => setDraggedBlock(null)}
                  onMediaUpload={onMediaUpload}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>

      {/* Floating Add Button (Mobile) */}
      <motion.button
        className="lg:hidden fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#FFAB00] rounded-full flex items-center justify-center shadow-lg shadow-[#FFAB00]/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => addBlock("TEXT")}
      >
        <Plus className="w-6 h-6 text-black" />
      </motion.button>

      {/* Toolbar */}
      <AnimatePresence>
        {showToolbar && (
          <EditorToolbar onAddBlock={addBlock} blockCount={blocks.length} />
        )}
      </AnimatePresence>

      {/* Quick Tips */}
      <QuickTips />
    </motion.div>
  );
};

// ============================================
// EDITOR HEADER
// ============================================
interface EditorHeaderProps {
  stats: { total: number; text: number; media: number; wordCount: number };
  showToolbar: boolean;
  onToggleToolbar: () => void;
}

const EditorHeader = ({ stats, showToolbar, onToggleToolbar }: EditorHeaderProps) => {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-4">
        {/* Title with Icon */}
        <motion.div
          className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFAB00]/20 to-orange-600/10 border border-[#FFAB00]/30 flex items-center justify-center"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <FileText className="w-6 h-6 text-[#FFAB00]" />
          
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-xl border border-[#FFAB00]/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        <div>
          <h3 className="font-display text-xl md:text-2xl text-white uppercase flex items-center gap-2">
            Content Blueprint
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[#FFAB00]" />
            </motion.div>
          </h3>
          <p className="text-xs text-gray-500 font-mono">Build your transmission content</p>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <StatPill 
          icon={Hash} 
          value={stats.total} 
          label="Blocks" 
          color="#FFAB00"
        />
        <StatPill 
          icon={Type} 
          value={stats.wordCount} 
          label="Words" 
          color="#3B82F6"
        />
        <StatPill 
          icon={Image} 
          value={stats.media} 
          label="Media" 
          color="#10B981"
        />
        
        {/* Toggle Toolbar Button */}
        <motion.button
          onClick={onToggleToolbar}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            showToolbar 
              ? "bg-[#FFAB00]/20 text-[#FFAB00] border border-[#FFAB00]/30"
              : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showToolbar ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span className="hidden sm:inline">Toolbar</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================
// STAT PILL
// ============================================
const StatPill = ({ icon: Icon, value, label, color }: { icon: any; value: number; label: string; color: string }) => (
  <motion.div 
    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
    whileHover={{ scale: 1.05, borderColor: `${color}50` }}
  >
    <Icon className="w-3 h-3" style={{ color }} />
    <span className="text-xs font-mono text-white">{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </motion.div>
);

// ============================================
// EMPTY STATE
// ============================================
const EmptyState = ({ onAddBlock }: { onAddBlock: (type: BlockType) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative py-16 px-8 rounded-2xl border border-dashed border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden"
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,171,0,0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-[#FFAB00]/10 border border-[#FFAB00]/30 flex items-center justify-center mb-6"
          animate={{ 
            y: [0, -10, 0],
            boxShadow: [
              "0 0 0 rgba(255,171,0,0)",
              "0 0 40px rgba(255,171,0,0.3)",
              "0 0 0 rgba(255,171,0,0)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Plus className="w-10 h-10 text-[#FFAB00]" />
        </motion.div>

        <h4 className="font-display text-2xl text-white mb-2">Start Building</h4>
        <p className="text-gray-500 text-sm max-w-sm mb-8">
          Add your first content block to begin crafting your transmission. 
          Drag and drop to reorder, or use the toolbar below.
        </p>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {(["TEXT", "IMAGE", "QUOTE"] as BlockType[]).map((type) => {
            const config = blockConfigs[type];
            const Icon = config.icon;
            
            return (
              <motion.button
                key={type}
                onClick={() => onAddBlock(type)}
                className="group flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFAB00]/50 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ 
                    background: `${config.color}20`,
                    border: `1px solid ${config.color}30`
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{config.label}</div>
                  <div className="text-[10px] text-gray-500">{config.description}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Decorative corners */}
      {[
        "top-4 left-4",
        "top-4 right-4 rotate-90",
        "bottom-4 right-4 rotate-180",
        "bottom-4 left-4 -rotate-90"
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-6 h-6 pointer-events-none`}>
          <div className="w-full h-[1px] bg-[#FFAB00]/30" />
          <div className="w-[1px] h-full bg-[#FFAB00]/30" />
        </div>
      ))}
    </motion.div>
  );
};

// ============================================
// BLOCK CARD COMPONENT
// ============================================
interface BlockCardProps {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  isExpanded: boolean;
  isPreview: boolean;
  isDragging: boolean;
  onUpdate: (field: keyof ContentBlock, value: string) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMove: (direction: "up" | "down") => void;
  onExpand: () => void;
  onPreview: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMediaUpload?: (file: File) => Promise<MediaUploadResult>;
}

const BlockCard = ({
  block,
  index,
  totalBlocks,
  isExpanded,
  isPreview,
  isDragging,
  onUpdate,
  onRemove,
  onDuplicate,
  onMove,
  onExpand,
  onPreview,
  onDragStart,
  onDragEnd,
  onMediaUpload
}: BlockCardProps) => {
  const config = blockConfigs[block.blockType as BlockType] || blockConfigs.TEXT;
  const Icon = config.icon;
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-3, 3]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setShowActions(false);
  };

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <motion.div
        variants={blockVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        className="group relative"
        style={{ 
          perspective: 1000,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
            isDragging ? "z-50" : "z-10"
          }`}
          style={{
            rotateX: isDragging ? 0 : rotateX,
            rotateY: isDragging ? 0 : rotateY,
            transformStyle: "preserve-3d"
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-1 rounded-2xl blur-xl -z-10"
            style={{ background: config.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDragging ? 0.3 : showActions ? 0.15 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Main card */}
          <div 
            className={`relative bg-[#0a0a0a] border rounded-2xl overflow-hidden transition-all duration-300 ${
              isDragging 
                ? `border-[${config.color}] shadow-2xl` 
                : showActions 
                  ? `border-[${config.color}]/50`
                  : "border-white/10 hover:border-white/20"
            }`}
            style={{ 
              borderColor: isDragging || showActions ? `${config.color}50` : undefined
            }}
          >
            {/* Block header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                {/* Drag handle */}
                <motion.div
                  className="cursor-grab active:cursor-grabbing p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onPointerDown={(e) => {
                    // Enable drag
                    const target = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement;
                    if (target) {
                      target.style.cursor = 'grabbing';
                    }
                  }}
                >
                  <GripVertical className="w-4 h-4 text-gray-500" />
                </motion.div>

                {/* Block type badge */}
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ 
                    background: `${config.color}15`,
                    border: `1px solid ${config.color}30`
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                  <span 
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </span>
                </motion.div>

                {/* Block index */}
                <span className="text-xs font-mono text-gray-600">
                  #{index + 1}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Move buttons */}
                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-1 mr-2"
                    >
                      <ActionButton
                        icon={ChevronUp}
                        onClick={() => onMove("up")}
                        disabled={index === 0}
                        tooltip="Move up"
                      />
                      <ActionButton
                        icon={ChevronDown}
                        onClick={() => onMove("down")}
                        disabled={index === totalBlocks - 1}
                        tooltip="Move down"
                      />
                      <ActionButton
                        icon={Copy}
                        onClick={onDuplicate}
                        tooltip="Duplicate"
                      />
                      <ActionButton
                        icon={isPreview ? EyeOff : Eye}
                        onClick={onPreview}
                        tooltip={isPreview ? "Edit" : "Preview"}
                        active={isPreview}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delete button with confirmation */}
                <AnimatePresence mode="wait">
                  {confirmDelete ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <motion.button
                        onClick={() => {
                          onRemove();
                          setConfirmDelete(false);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Check className="w-3 h-3" />
                        Confirm
                      </motion.button>
                      <motion.button
                        onClick={() => setConfirmDelete(false)}
                        className="p-1.5 bg-white/10 rounded-lg text-gray-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => setConfirmDelete(true)}
                      className="p-2 rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Block content */}
            <div className="p-4">
              <AnimatePresence mode="wait">
                {isPreview ? (
                  <BlockPreview key="preview" block={block} config={config} />
                ) : (
                  <BlockContent 
                    key="editor"
                    block={block} 
                    config={config}
                    onUpdate={onUpdate}
                    isExpanded={isExpanded}
                    onExpand={onExpand}
                    onMediaUpload={onMediaUpload}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom accent */}
            <motion.div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${config.color}50, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: showActions ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </Reorder.Item>
  );
};

// ============================================
// ACTION BUTTON
// ============================================
const ActionButton = ({ 
  icon: Icon, 
  onClick, 
  disabled, 
  tooltip,
  active
}: { 
  icon: any; 
  onClick: () => void; 
  disabled?: boolean;
  tooltip?: string;
  active?: boolean;
}) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
      active 
        ? "bg-[#FFAB00]/20 text-[#FFAB00]"
        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
    }`}
    whileHover={disabled ? {} : { scale: 1.1 }}
    whileTap={disabled ? {} : { scale: 0.9 }}
    title={tooltip}
  >
    <Icon className="w-3.5 h-3.5" />
  </motion.button>
);

// ============================================
// BLOCK CONTENT
// ============================================
interface BlockContentProps {
  block: ContentBlock;
  config: BlockConfig;
  onUpdate: (field: keyof ContentBlock, value: string) => void;
  isExpanded: boolean;
  onExpand: () => void;
  onMediaUpload?: (file: File) => Promise<MediaUploadResult>;
}

const BlockContent = ({ block, config, onUpdate, isExpanded, onExpand, onMediaUpload }: BlockContentProps) => {
  const [charCount, setCharCount] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* TEXT BLOCK */}
      {block.blockType === "TEXT" && (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm leading-relaxed placeholder:text-gray-600 outline-none focus:border-[#FFAB00] transition-all resize-none min-h-[120px]"
              placeholder="Write your paragraph content here..."
              value={block.textContent}
              onChange={(e) => {
                onUpdate("textContent", e.target.value);
                setCharCount(e.target.value.length);
              }}
              style={{ 
                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)"
              }}
            />
            
            {/* Character counter */}
            <div className="absolute bottom-3 right-3 text-xs font-mono text-gray-600">
              {block.textContent?.length || 0} chars
            </div>
          </div>
        </div>
      )}

      {/* HEADING BLOCK */}
      {block.blockType === "HEADING" && (
        <input
          type="text"
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-2xl font-display placeholder:text-gray-600 outline-none focus:border-[#FFAB00] transition-all"
          placeholder="Enter section heading..."
          value={block.textContent}
          onChange={(e) => onUpdate("textContent", e.target.value)}
        />
      )}

      {/* IMAGE BLOCK */}
      {block.blockType === "IMAGE" && (
        <div className="space-y-4">
          {onMediaUpload ? (
            <MediaUploader
              accept="image"
              value={block.mediaUrl}
              onUpload={onMediaUpload}
              onComplete={(publicUrl) => onUpdate("mediaUrl", publicUrl)}
              onClear={() => onUpdate("mediaUrl", "")}
              caption={block.caption}
              onCaptionChange={(caption) => onUpdate("caption", caption)}
              showCaptionInput={true}
            />
          ) : (
            <>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Image className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="url"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm font-mono placeholder:text-gray-600 outline-none focus:border-[#FFAB00] transition-all"
                  placeholder="Enter image URL..."
                  value={block.mediaUrl}
                  onChange={(e) => onUpdate("mediaUrl", e.target.value)}
                />
              </div>

              <input
                type="text"
                className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-2 text-gray-400 text-sm italic placeholder:text-gray-600 outline-none focus:border-white/20 transition-all"
                placeholder="Add a caption (optional)..."
                value={block.caption}
                onChange={(e) => onUpdate("caption", e.target.value)}
              />

              {/* Image Preview */}
              <AnimatePresence>
                {block.mediaUrl && (
                  <ImagePreview url={block.mediaUrl} caption={block.caption} />
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      )}

      {/* VIDEO BLOCK */}
      {block.blockType === "VIDEO" && (
        <div className="space-y-4">
          {onMediaUpload ? (
            <MediaUploader
              accept="video"
              value={block.mediaUrl}
              onUpload={onMediaUpload}
              onComplete={(publicUrl) => onUpdate("mediaUrl", publicUrl)}
              onClear={() => onUpdate("mediaUrl", "")}
              caption={block.caption}
              onCaptionChange={(caption) => onUpdate("caption", caption)}
              showCaptionInput={true}
            />
          ) : (
            <>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Video className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="url"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm font-mono placeholder:text-gray-600 outline-none focus:border-[#FFAB00] transition-all"
                  placeholder="YouTube, Vimeo, or embed URL..."
                  value={block.mediaUrl}
                  onChange={(e) => onUpdate("mediaUrl", e.target.value)}
                />
              </div>

              <input
                type="text"
                className="w-full bg-black/30 border border-white/5 rounded-xl px-4 py-2 text-gray-400 text-sm italic placeholder:text-gray-600 outline-none focus:border-white/20 transition-all"
                placeholder="Video caption (optional)..."
                value={block.caption}
                onChange={(e) => onUpdate("caption", e.target.value)}
              />

              {/* Video Preview */}
              <AnimatePresence>
                {block.mediaUrl && (
                  <VideoPreview url={block.mediaUrl} />
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      )}

      {/* QUOTE BLOCK */}
      {block.blockType === "QUOTE" && (
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#A855F7] via-[#A855F7]/50 to-transparent rounded-full" />
          <div className="pl-6">
            <Quote className="w-8 h-8 text-[#A855F7]/50 mb-2" />
            <textarea
              className="w-full bg-transparent border-none text-white text-xl font-serif italic leading-relaxed placeholder:text-gray-600 outline-none resize-none min-h-[80px]"
              placeholder="Enter your quote..."
              value={block.textContent}
              onChange={(e) => onUpdate("textContent", e.target.value)}
            />
            <input
              type="text"
              className="w-full bg-transparent border-none text-gray-400 text-sm placeholder:text-gray-600 outline-none mt-2"
              placeholder="— Attribution (optional)"
              value={block.caption}
              onChange={(e) => onUpdate("caption", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* CODE BLOCK */}
      {block.blockType === "CODE" && (
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <span className="text-xs font-mono text-gray-500">Code Snippet</span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
          </div>
          <textarea
            className="w-full bg-black/80 px-4 py-4 text-green-400 text-sm font-mono leading-relaxed placeholder:text-gray-600 outline-none resize-none min-h-[150px]"
            placeholder="// Enter your code here..."
            value={block.textContent}
            onChange={(e) => onUpdate("textContent", e.target.value)}
          />
        </div>
      )}

      {/* DIVIDER BLOCK */}
      {block.blockType === "DIVIDER" && (
        <div className="py-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFAB00]/50 to-transparent" />
          <p className="text-center text-xs text-gray-600 mt-2">Section Divider</p>
        </div>
      )}

      {/* EMBED BLOCK */}
      {block.blockType === "EMBED" && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Link2 className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="url"
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm font-mono placeholder:text-gray-600 outline-none focus:border-[#FFAB00] transition-all"
              placeholder="Enter embed URL (Twitter, Spotify, etc.)..."
              value={block.mediaUrl}
              onChange={(e) => onUpdate("mediaUrl", e.target.value)}
            />
          </div>
          
          {block.mediaUrl && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <Link2 className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Embed will be rendered here</p>
              <p className="text-xs text-gray-600 font-mono mt-1 truncate">{block.mediaUrl}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// IMAGE PREVIEW
// ============================================
const ImagePreview = ({ url, caption }: { url: string; caption?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="relative rounded-xl overflow-hidden border border-white/10"
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-[#FFAB00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {hasError ? (
        <div className="aspect-video bg-red-500/10 flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-red-400">Failed to load image</p>
          <p className="text-xs text-gray-500 font-mono">{url}</p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={url}
            alt={caption || "Preview"}
            className="w-full aspect-video object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          
          {caption && (
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-sm text-white/80 italic">{caption}</p>
            </div>
          )}

          {/* Preview badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 rounded text-[10px] font-mono text-white/60">
            PREVIEW
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// VIDEO PREVIEW
// ============================================
const VideoPreview = ({ url }: { url: string }) => {
  // Extract video ID for YouTube/Vimeo
  const getEmbedUrl = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="relative rounded-xl overflow-hidden border border-white/10"
    >
      {embedUrl ? (
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video bg-white/5 flex flex-col items-center justify-center gap-2">
          <Video className="w-8 h-8 text-gray-500" />
          <p className="text-sm text-gray-400">Video preview</p>
          <p className="text-xs text-gray-600 font-mono truncate max-w-full px-4">{url}</p>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// BLOCK PREVIEW (Read-only)
// ============================================
const BlockPreview = ({ block, config }: { block: ContentBlock; config: BlockConfig }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="prose prose-invert max-w-none"
    >
      {block.blockType === "TEXT" && (
        <p className="text-gray-300 leading-relaxed">{block.textContent || "No content"}</p>
      )}
      
      {block.blockType === "HEADING" && (
        <h2 className="text-2xl font-display text-white">{block.textContent || "No heading"}</h2>
      )}
      
      {block.blockType === "IMAGE" && block.mediaUrl && (
        <figure>
          <img src={block.mediaUrl} alt={block.caption} className="rounded-xl" />
          {block.caption && <figcaption className="text-center text-gray-500">{block.caption}</figcaption>}
        </figure>
      )}
      
      {block.blockType === "QUOTE" && (
        <blockquote className="border-l-4 border-[#A855F7] pl-4 italic text-xl">
          "{block.textContent}"
          {block.caption && <footer className="text-gray-500 text-sm mt-2">{block.caption}</footer>}
        </blockquote>
      )}
      
      {block.blockType === "CODE" && (
        <pre className="bg-black/80 p-4 rounded-xl overflow-x-auto">
          <code className="text-green-400 text-sm font-mono">{block.textContent}</code>
        </pre>
      )}
    </motion.div>
  );
};

// ============================================
// EDITOR TOOLBAR
// ============================================
const EditorToolbar = ({ onAddBlock, blockCount }: { onAddBlock: (type: BlockType) => void; blockCount: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryBlocks: BlockType[] = ["TEXT", "HEADING", "IMAGE", "VIDEO"];
  const secondaryBlocks: BlockType[] = ["QUOTE", "CODE", "DIVIDER", "EMBED"];

  return (
    <motion.div
      variants={toolbarVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 20 }}
      className="sticky bottom-0 mt-8 -mx-4 px-4 py-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent"
    >
      <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        {/* Toolbar header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#FFAB00]" />
            <span className="text-sm font-bold text-white">Add Block</span>
          </div>
          
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            {isExpanded ? "Show less" : "Show more"}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3 h-3" />
            </motion.div>
          </motion.button>
        </div>

        {/* Primary blocks */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          variants={toolbarVariants}
        >
          {primaryBlocks.map((type) => (
            <ToolButton
              key={type}
              config={blockConfigs[type]}
              onClick={() => onAddBlock(type)}
            />
          ))}
        </motion.div>

        {/* Secondary blocks (expanded) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2"
            >
              {secondaryBlocks.map((type) => (
                <ToolButton
                  key={type}
                  config={blockConfigs[type]}
                  onClick={() => onAddBlock(type)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ============================================
// TOOL BUTTON
// ============================================
const ToolButton = ({ config, onClick }: { config: BlockConfig; onClick: () => void }) => {
  const Icon = config.icon;

  return (
    <motion.button
      variants={toolButtonVariants}
      onClick={onClick}
      className="group relative flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ 
          background: `linear-gradient(135deg, ${config.color}15, transparent)`
        }}
      />

      {/* Icon */}
      <div 
        className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
        style={{ 
          background: `${config.color}15`,
          border: `1px solid ${config.color}30`
        }}
      >
        <Icon className="w-5 h-5" style={{ color: config.color }} />
      </div>

      {/* Label */}
      <div className="relative text-left flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate">{config.label}</div>
        <div className="text-[10px] text-gray-500 truncate">{config.description}</div>
      </div>

      {/* Plus indicator */}
      <motion.div
        className="relative opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
      >
        <Plus className="w-4 h-4 text-gray-500" />
      </motion.div>
    </motion.button>
  );    
};

// ============================================
// QUICK TIPS
// ============================================
const QuickTips = () => {
  const tips = [
    { icon: GripVertical, text: "Drag to reorder" },
    { icon: Copy, text: "Duplicate blocks" },
    { icon: Eye, text: "Preview content" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600"
    >
      {tips.map((tip, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <tip.icon className="w-3 h-3" />
          <span>{tip.text}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default BlockEditor;