import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Save, Upload, Terminal, AlertCircle, CheckCircle, Loader2, LogIn } from "lucide-react";
import { usePortfolioMutation } from "@/hooks/usePortfolioDetail";
import { useAuth } from "@/context/AuthContext";
import { JobCategory, JobProfileStatus, PortfolioRequest, CATEGORY_TO_BACKEND, DISPLAY_TO_STATUS } from "@/types/portfolio";
import { MediaUploader } from "@/components/MediaUploader";
import { mediaUploadService } from "@/services/mediaUploadService";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const roles = ["Programmer", "Artist", "Designer", "Producer", "Audio"];
const statusOptions = ["Open for Work", "Freelance", "Deployed"];

export const CreatePortfolioModal = ({ isOpen, onClose, onSuccess }: CreatePortfolioModalProps) => {
  const { user, dbUser, loginWithGoogle } = useAuth();
  const { createOrUpdate, loading: isSubmitting, error: submitError, success, reset } = usePortfolioMutation();
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    role: "Programmer",
    location: "",
    experienceYears: 1,
    jobStatus: "Open for Work",
    profileSummary: "",
    contactEmail: "",
    profilePhotoUrl: "",
    coverPhotoUrl: "",
    resumeUrl: "",
    skills: [{ name: "", score: 50 }],
    socials: [{ platform: "", url: "" }]
  });

  // Reset form and close on success
  useEffect(() => {
    if (success) {
      // Reset form
      setFormData({
        name: "",
        shortDescription: "",
        role: "Programmer",
        location: "",
        experienceYears: 1,
        jobStatus: "Open for Work",
        profileSummary: "",
        contactEmail: "",
        profilePhotoUrl: "",
        coverPhotoUrl: "",
        resumeUrl: "",
        skills: [{ name: "", score: 50 }],
        socials: [{ platform: "", url: "" }]
      });
      
      // Call success callback
      onSuccess?.();
      
      // Close after a short delay to show success message
      setTimeout(() => {
        onClose();
        reset();
      }, 1500);
    }
  }, [success, onClose, onSuccess, reset]);

  // Pre-fill email from auth if available
  useEffect(() => {
    if (user?.email && !formData.contactEmail) {
      setFormData(prev => ({ ...prev, contactEmail: user.email || "" }));
    }
  }, [user?.email, formData.contactEmail]);

  const handleAddSkill = () => {
    if (formData.skills.length < 10) {
      setFormData({ ...formData, skills: [...formData.skills, { name: "", score: 50 }] });
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSkillChange = (index: number, field: "name" | "score", value: string | number) => {
    const newSkills = [...formData.skills];
    if (field === "name") {
      newSkills[index].name = value as string;
    } else {
      newSkills[index].score = value as number;
    }
    setFormData({ ...formData, skills: newSkills });
  };

  const handleAddSocial = () => {
    if (formData.socials.length < 5) {
      setFormData({ ...formData, socials: [...formData.socials, { platform: "", url: "" }] });
    }
  };

  const handleRemoveSocial = (index: number) => {
    const newSocials = formData.socials.filter((_, i) => i !== index);
    setFormData({ ...formData, socials: newSocials });
  };

  const handleSocialChange = (index: number, field: "platform" | "url", value: string) => {
    const newSocials = [...formData.socials];
    newSocials[index][field] = value;
    setFormData({ ...formData, socials: newSocials });
  };

  // Handle file uploads via presigned URLs
  const handleProfilePhotoUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, false);
  }, []);

  const handleCoverPhotoUpload = useCallback(async (file: File) => {
    return await mediaUploadService.uploadFile(file, false);
  }, []);

  const handleResumeUpload = useCallback(async (file: File) => {
    // Resume uploads use a different endpoint that requires email verification
    return await mediaUploadService.uploadFile(file, true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      return;
    }

    // Build request payload
    const request: PortfolioRequest = {
      name: formData.name,
      shortDescription: formData.shortDescription || formData.role,
      location: formData.location,
      experienceYears: formData.experienceYears,
      jobCategory: CATEGORY_TO_BACKEND[formData.role] || JobCategory.OTHER,
      jobStatus: DISPLAY_TO_STATUS[formData.jobStatus] || JobProfileStatus.OPEN,
      profileSummary: formData.profileSummary,
      contactEmail: formData.contactEmail,
      profilePhotoUrl: formData.profilePhotoUrl || undefined,
      coverPhotoUrl: formData.coverPhotoUrl || undefined,
      resumeUrl: formData.resumeUrl || undefined,
      skills: formData.skills.filter(s => s.name.trim() !== "").map(s => ({ name: s.name, score: s.score })),
      socials: formData.socials.filter(s => s.platform.trim() !== "" && s.url.trim() !== ""),
    };

    await createOrUpdate(request);
  };

  // Show login prompt if not authenticated
  const renderAuthPrompt = () => (
    <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#FFAB00]/10 flex items-center justify-center">
        <LogIn className="w-8 h-8 text-[#FFAB00]" />
      </div>
      <div>
        <h3 className="font-display text-2xl text-white uppercase mb-2">Authentication Required</h3>
        <p className="text-gray-400 font-mono text-sm">
          You must be logged in to create a portfolio profile.
        </p>
      </div>
      <button
        onClick={() => loginWithGoogle()}
        className="px-8 py-3 bg-[#FFAB00] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
      >
        Login with Google
      </button>
    </div>
  );

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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-[#0a0a0a] border border-[#FFAB00]/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto relative">
              
              {/* Decorative Scanline */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-[#FFAB00]">
                  <Terminal className="w-5 h-5" />
                  <h2 className="font-display text-xl uppercase tracking-widest">Initiate Registration</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              {!user ? (
                renderAuthPrompt()
              ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                
                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded text-green-400"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-mono text-sm">Portfolio created successfully!</span>
                  </motion.div>
                )}

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-mono text-sm">{submitError}</span>
                  </motion.div>
                )}

                {/* Email Verification Warning */}
                {dbUser && !dbUser.emailVerified && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-mono text-sm">Please verify your email to create a portfolio.</span>
                  </div>
                )}

                {/* 1. Identity Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    01 // Identity Matrix
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Operative Name *</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="ENTER_NAME"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Class (Role) *</label>
                      <select 
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono appearance-none"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Base Location *</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="CITY, REGION"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Experience (Years)</label>
                      <input 
                        type="number" 
                        min="0"
                        max="50"
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="5"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Status</label>
                      <select 
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono appearance-none"
                        value={formData.jobStatus}
                        onChange={(e) => setFormData({...formData, jobStatus: e.target.value})}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Contact Email *</label>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="operative@email.com"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Short Description</label>
                      <input 
                        type="text" 
                        maxLength={300}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="Senior Game Programmer | Unity & Unreal Expert"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Profile Summary</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono resize-none"
                        placeholder="Tell us about your experience, skills, and what you're looking for..."
                        value={formData.profileSummary}
                        onChange={(e) => setFormData({...formData, profileSummary: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    02 // Visual Data Upload
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Profile Photo</label>
                      <MediaUploader
                        accept="image"
                        value={formData.profilePhotoUrl}
                        onUpload={handleProfilePhotoUpload}
                        onComplete={(url) => setFormData({ ...formData, profilePhotoUrl: url })}
                        onClear={() => setFormData({ ...formData, profilePhotoUrl: "" })}
                        label="profile photo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Cover Photo</label>
                      <MediaUploader
                        accept="image"
                        value={formData.coverPhotoUrl}
                        onUpload={handleCoverPhotoUpload}
                        onComplete={(url) => setFormData({ ...formData, coverPhotoUrl: url })}
                        onClear={() => setFormData({ ...formData, coverPhotoUrl: "" })}
                        label="cover photo"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Resume/CV</label>
                      <MediaUploader
                        accept="pdf"
                        value={formData.resumeUrl}
                        onUpload={handleResumeUpload}
                        onComplete={(url) => setFormData({ ...formData, resumeUrl: url })}
                        onClear={() => setFormData({ ...formData, resumeUrl: "" })}
                        label="resume (PDF)"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Skills Matrix (Dynamic) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                      03 // Skill Calibration
                    </h3>
                    <button 
                      type="button" 
                      onClick={handleAddSkill}
                      disabled={formData.skills.length >= 10}
                      className="text-[#FFAB00] text-xs font-bold uppercase hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" /> Add Vector
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.skills.map((skill, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 items-center bg-white/5 p-3 rounded border border-white/5"
                      >
                        <input 
                          type="text"
                          placeholder="SKILL_NAME (e.g. UNITY)"
                          className="bg-transparent border-b border-white/20 text-white text-sm w-1/3 focus:border-[#FFAB00] focus:outline-none font-mono py-1"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                        />
                        <div className="flex-1 flex items-center gap-3">
                           <input 
                             type="range" 
                             min="0" 
                             max="100" 
                             className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFAB00]"
                             value={skill.score}
                             onChange={(e) => handleSkillChange(index, "score", parseInt(e.target.value))}
                           />
                           <span className="text-xs font-mono text-[#FFAB00] w-8">{skill.score}%</span>
                        </div>
                        {index > 0 && (
                          <button type="button" onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 4. Social Links */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                      04 // Comms Channels
                    </h3>
                    <button 
                      type="button" 
                      onClick={handleAddSocial}
                      disabled={formData.socials.length >= 5}
                      className="text-[#FFAB00] text-xs font-bold uppercase hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.socials.map((social, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 items-center bg-white/5 p-3 rounded border border-white/5"
                      >
                        <select
                          className="bg-transparent border-b border-white/20 text-white text-sm w-1/4 focus:border-[#FFAB00] focus:outline-none font-mono py-1"
                          value={social.platform}
                          onChange={(e) => handleSocialChange(index, "platform", e.target.value)}
                        >
                          <option value="">Platform</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Twitter">Twitter</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="ArtStation">ArtStation</option>
                          <option value="Behance">Behance</option>
                        </select>
                        <input 
                          type="url"
                          placeholder="https://..."
                          className="flex-1 bg-transparent border-b border-white/20 text-white text-sm focus:border-[#FFAB00] focus:outline-none font-mono py-1"
                          value={social.url}
                          onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                        />
                        <button type="button" onClick={() => handleRemoveSocial(index)} className="text-red-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-white/20 text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.location || !formData.contactEmail}
                    className="relative group px-8 py-3 bg-[#FFAB00] text-black font-bold uppercase tracking-widest overflow-hidden hover:bg-white transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          UPLOADING...
                        </>
                      ) : (
                        <>
                          SUBMIT DOSSIER <Save className="w-4 h-4" />
                        </>
                      )}
                    </span>
                    {/* Glitch Overlay */}
                    {!isSubmitting && (
                      <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 ease-out opacity-50" />
                    )}
                  </button>
                </div>

              </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};