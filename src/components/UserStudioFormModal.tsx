import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Building2, MapPin, Globe, Users, Star, 
  Send, Loader2, AlertCircle, CheckCircle, Clock
} from "lucide-react";
import { StudioRequest } from "@/types/studio";
import { MediaUploader } from "@/components/MediaUploader";
import { mediaUploadService } from "@/services/mediaUploadService";

interface UserStudioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudioRequest) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  success?: boolean;
}

const initialFormData: StudioRequest = {
  studioName: "",
  studioLogoUrl: "",
  studioDescription: "",
  studioWebsiteUrl: "",
  ratings: 3,
  status: "PENDING", // Always PENDING for user submissions
  country: "",
  city: "",
  description: "",
  employeesCount: 10,
  latitude: 0,
  longitude: 0,
};

export const UserStudioFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  error,
  success,
}: UserStudioFormModalProps) => {
  const [formData, setFormData] = useState<StudioRequest>(initialFormData);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  // Close modal on success after delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleLogoUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure status is always PENDING for user submissions
    await onSubmit({ ...formData, status: "PENDING" });
  };

  const updateField = <K extends keyof StudioRequest>(
    field: K, 
    value: StudioRequest[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-[#0a0a0a] border border-primary/30 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto relative">
              
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-yellow-500/20 to-primary/20 opacity-50 blur-xl -z-10 animate-pulse" />
              
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-3 text-primary">
                  <div className="relative">
                    <Building2 className="w-7 h-7" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-xl uppercase tracking-widest">
                      Submit Your Studio
                    </h2>
                    <p className="text-xs text-gray-400 font-mono">
                      Request to be listed on GameTout
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Pending Notice */}
              <div className="mx-6 mt-6 flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-400 font-medium">Submission Review Required</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your studio will be reviewed by our team before being published. 
                    This usually takes 1-2 business days.
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Status Messages */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
                    >
                      <div className="relative">
                        <CheckCircle className="w-6 h-6" />
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                          transition={{ repeat: 3, duration: 0.5 }}
                          className="absolute inset-0 bg-green-400 rounded-full opacity-30"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Studio Submitted Successfully!</p>
                        <p className="text-xs text-green-400/70 mt-0.5">
                          We'll review your submission and notify you once it's approved.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-mono text-sm">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="text-primary">01</span>
                    <span>//</span>
                    Studio Identity
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Studio Name */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Studio Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.studioName}
                        onChange={(e) => updateField("studioName", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="Enter your studio name"
                      />
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Studio Logo
                      </label>
                      <MediaUploader
                        accept="image"
                        value={formData.studioLogoUrl}
                        onUpload={handleLogoUpload}
                        onComplete={(url) => updateField("studioLogoUrl", url)}
                        onClear={() => updateField("studioLogoUrl", "")}
                        label="studio logo"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.studioWebsiteUrl}
                        onChange={(e) => updateField("studioWebsiteUrl", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="https://yourstudio.com"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={formData.studioDescription}
                        onChange={(e) => updateField("studioDescription", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="Brief tagline for your studio"
                        maxLength={255}
                      />
                    </div>

                    {/* Full Description */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Full Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono resize-none"
                        placeholder="Tell us about your studio, the games you've made, your team culture..."
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Location */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="text-primary">02</span>
                    <span>//</span>
                    Location Data
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="India"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="Bangalore"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.latitude}
                        onChange={(e) => updateField("latitude", parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="12.9716"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={(e) => updateField("longitude", parseFloat(e.target.value) || 0)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="77.5946"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Stats */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="text-primary">03</span>
                    <span>//</span>
                    Studio Stats
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Employee Count *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.employeesCount}
                        onChange={(e) => updateField("employeesCount", parseInt(e.target.value) || 1)}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        placeholder="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        Self Rating (1-5) *
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={formData.ratings}
                          onChange={(e) => updateField("ratings", parseInt(e.target.value))}
                          className="flex-1 accent-primary h-2 rounded-lg"
                        />
                        <div className="flex items-center gap-1 min-w-[80px]">
                          {[...Array(formData.ratings)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Star className="w-4 h-4 text-primary fill-primary" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-white/20 text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 rounded-lg"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || !formData.studioName || !formData.country || !formData.city}
                    className="px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-lg relative overflow-hidden group"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit for Review
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserStudioFormModal;
