import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Trash2, Save, Terminal, AlertCircle, CheckCircle,
  Loader2, LogIn, ChevronDown, Globe, Lock, Linkedin,
  Github, Twitter, Youtube, Link2, ExternalLink
} from "lucide-react";
import { usePortfolioMutation } from "@/hooks/usePortfolioDetail";
import { useAuth } from "@/context/AuthContext";
import { JobCategory, JobProfileStatus, PortfolioRequest, CATEGORY_TO_BACKEND, DISPLAY_TO_STATUS } from "@/types/portfolio";
import { MediaUploader } from "@/components/MediaUploader";
import { mediaUploadService } from "@/services/mediaUploadService";
import React from "react";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const roles = ["Programmer", "Artist", "Designer", "Producer", "Audio"];
const statusOptions = ["Open for Work", "Freelance", "Deployed"];

// Platform options with icons
const PLATFORM_OPTIONS = [
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin, color: "#0077B5" },
  { value: "GitHub", label: "GitHub", icon: Github, color: "#333" },
  { value: "Twitter", label: "Twitter / X", icon: Twitter, color: "#1DA1F2" },
  { value: "Discord", label: "Discord", icon: Link2, color: "#5865F2" },
  { value: "Portfolio", label: "Portfolio", icon: ExternalLink, color: "#FFAB00" },
  { value: "ArtStation", label: "ArtStation", icon: ExternalLink, color: "#13AFF0" },
  { value: "Behance", label: "Behance", icon: ExternalLink, color: "#0057FF" },
  { value: "YouTube", label: "YouTube", icon: Youtube, color: "#FF0000" },
  { value: "Itch.io", label: "Itch.io", icon: ExternalLink, color: "#FA5C5C" },
];

// Custom Platform Dropdown Component (similar to createpost)
const PlatformDropdown = ({
  value,
  onChange,
  index
}: {
  value: string;
  onChange: (value: string) => void;
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === value);

  return (
    <div className="relative w-1/4" style={{ zIndex: 1000 - index }}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-black/50 border-b border-white/20 text-white text-sm font-mono py-2 px-2 hover:border-[#FFAB00] transition-colors flex items-center justify-between ${isOpen ? 'border-[#FFAB00]' : ''}`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          {selectedPlatform ? (
            <>
              <selectedPlatform.icon className="w-3 h-3" style={{ color: selectedPlatform.color }} />
              <span>{selectedPlatform.label}</span>
            </>
          ) : (
            <span className="text-gray-400">Platform</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown - opens upward */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
              style={{
                boxShadow: '0 -10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
                zIndex: 50
              }}
            >
              {PLATFORM_OPTIONS.map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <motion.button
                    key={platform.value}
                    type="button"
                    onClick={() => {
                      onChange(platform.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${value === platform.value
                      ? 'bg-[#FFAB00]/20 text-[#FFAB00]'
                      : 'text-gray-300'
                      }`}
                    whileHover={{ x: 4 }}
                  >
                    <PlatformIcon className="w-4 h-4" style={{ color: platform.color }} />
                    <span>{platform.label}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Custom Dropdown Components (add these inside CreatePortfolioModal component)

// Role Dropdown Component
const RoleDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedRole = roles.find(r => r === value);

  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] transition-colors font-mono flex items-center justify-between ${isOpen ? 'border-[#FFAB00]' : ''
          }`}
        whileTap={{ scale: 0.98 }}
      >
        <span className="uppercase">{selectedRole || "Select Role"}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown - opens below */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
              style={{
                boxShadow: '0 10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
                zIndex: 50
              }}
            >
              {roles.map((role) => (
                <motion.button
                  key={role}
                  type="button"
                  onClick={() => {
                    onChange(role);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${value === role
                    ? 'bg-[#FFAB00]/20 text-[#FFAB00] font-bold'
                    : 'text-gray-300'
                    }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="uppercase">{role}</span>
                  {value === role && (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Status Dropdown Component
const StatusDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedStatus = statusOptions.find(s => s === value);

  // Status icons mapping
  const statusIcons: Record<string, any> = {
    "Open for Work": Globe,
    "Freelance": ExternalLink,
    "Deployed": CheckCircle
  };

  return (
    <div className="relative w-full">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#0a0a0a] border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] transition-colors font-mono flex items-center justify-between ${isOpen ? 'border-[#FFAB00]' : ''
          }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          {selectedStatus && statusIcons[selectedStatus] ?
            React.createElement(statusIcons[selectedStatus], { className: "w-4 h-4 text-[#FFAB00]" }) : null}
          <span className="uppercase">{selectedStatus || "Select Status"}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown - opens upward */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-[#0a0a0a] border border-[#FFAB00]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
              style={{
                boxShadow: '0 -10px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,171,0,0.1)',
                zIndex: 50
              }}
            >
              {statusOptions.map((status) => {
                const StatusIcon = statusIcons[status] || Globe;
                return (
                  <motion.button
                    key={status}
                    type="button"
                    onClick={() => {
                      onChange(status);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${value === status
                      ? 'bg-[#FFAB00]/20 text-[#FFAB00] font-bold'
                      : 'text-gray-300'
                      }`}
                    whileHover={{ x: 4 }}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span className="uppercase">{status}</span>
                    {value === status && (
                      <CheckCircle className="w-4 h-4 ml-auto" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CreatePortfolioModal = ({ isOpen, onClose, onSuccess }: CreatePortfolioModalProps) => {
  const { isAuthenticated, dbUser, loginWithGoogle, loginWithGithub,
    loginWithDiscord,
    loginWithLinkedIn,
    loginWithSteam, 
    loginWithEmail  
  } = useAuth();
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
    if (dbUser?.email && !formData.contactEmail) {
      setFormData(prev => ({ ...prev, contactEmail: dbUser.email || "" }));
    }
  }, [dbUser?.email, formData.contactEmail]);

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
    return await mediaUploadService.uploadFile(file, true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
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

      {/* Social Login Grid */}
      <div className="w-full space-y-4">
        {/* Primary Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => loginWithGoogle()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group rounded-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase">Google</span>
          </button>

          <button
            onClick={() => loginWithGithub()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#FFAB00] hover:bg-white/5 transition-colors group rounded-lg"
          >
            <Github className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase">GitHub</span>
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => loginWithDiscord()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#5865F2] hover:bg-[#5865F2]/10 transition-colors group rounded-lg"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span className="text-xs font-bold text-gray-300 group-hover:text-[#5865F2] uppercase">Discord</span>
          </button>

          <button
            onClick={() => loginWithLinkedIn()}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors group rounded-lg"
          >
            <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2]" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-[#0A66C2] uppercase">LinkedIn</span>
          </button>
        </div>

        {/* Steam - Full Width */}
        <button
          onClick={() => loginWithSteam()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 hover:border-[#1b2838] hover:bg-[#1b2838]/20 transition-colors group rounded-lg"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z" />
          </svg>
          <span className="text-xs font-bold text-gray-300 group-hover:text-white uppercase">Steam</span>
          <span className="text-[10px] text-gray-600 group-hover:text-gray-400">(Gaming)</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <span className="relative bg-[#0a0a0a] px-2 text-[10px] text-gray-500 uppercase tracking-widest">
          Or continue with email
        </span>
      </div>

      {/* Email Option */}
      <div className="w-full text-center">
        <p className="text-xs text-gray-500 mb-3">Want to use email instead?</p>
        <button
          onClick={() => {/* You can add email login modal here */ }}
          className="text-sm text-[#FFAB00] hover:text-white transition-colors font-mono uppercase tracking-wider"
        >
          Sign in with Email →
        </button>
      </div>

      {/* Note about email verification */}
      <p className="text-[10px] text-gray-600 font-mono mt-4">
        Note: Email verification required for portfolio creation
      </p>
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
              {!isAuthenticated ? (
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
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Class (Role) *</label>
                        <RoleDropdown
                          value={formData.role}
                          onChange={(value) => setFormData({ ...formData, role: value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Base Location *</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                          placeholder="CITY, REGION"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Experience (Years)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="e.g., 5"
                            value={formData.experienceYears === 0 ? "" : formData.experienceYears}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                setFormData({ ...formData, experienceYears: 0 });
                              } else {
                                const numValue = parseInt(value);
                                if (!isNaN(numValue) && numValue >= 0) {
                                  setFormData({ ...formData, experienceYears: numValue });
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setFormData({ ...formData, experienceYears: 1 });
                              }
                            }}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col">
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, experienceYears: Math.min(50, formData.experienceYears + 1) })
                              }
                              className="text-[#FFAB00] hover:text-white w-4 h-4 flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({ ...formData, experienceYears: Math.max(0, formData.experienceYears - 1) })
                              }
                              className="text-[#FFAB00] hover:text-white w-4 h-4 flex items-center justify-center"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">Enter 0 for less than 1 year</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Status</label>
                        <StatusDropdown
                          value={formData.jobStatus}
                          onChange={(value) => setFormData({ ...formData, jobStatus: value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Contact Email *</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                          placeholder="operative@email.com"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-300 uppercase">Profile Summary</label>
                        <textarea
                          rows={3}
                          className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono resize-none"
                          placeholder="Tell us about your experience, skills, and what you're looking for..."
                          value={formData.profileSummary}
                          onChange={(e) => setFormData({ ...formData, profileSummary: e.target.value })}
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
                          {/* Custom Platform Dropdown */}
                          <PlatformDropdown
                            value={social.platform}
                            onChange={(value) => handleSocialChange(index, "platform", value)}
                            index={index}
                          />

                          <input
                            type="url"
                            placeholder="https://..."
                            className="flex-1 bg-transparent border-b border-white/20 text-white text-sm focus:border-[#FFAB00] focus:outline-none font-mono py-1"
                            value={social.url}
                            onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSocial(index)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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