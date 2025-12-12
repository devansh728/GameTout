import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Save, Upload, Terminal } from "lucide-react";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roles = ["Programmer", "Artist", "Designer", "Producer", "Audio"];

export const CreatePortfolioModal = ({ isOpen, onClose }: CreatePortfolioModalProps) => {
  const [step, setStep] = useState(1); // For multi-step (optional, keeping single page for speed)
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "Programmer",
    location: "",
    skills: [{ name: "", level: 50 }]
  });

  const handleAddSkill = () => {
    if (formData.skills.length < 5) {
      setFormData({ ...formData, skills: [...formData.skills, { name: "", level: 50 }] });
    }
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSkillChange = (index: number, field: "name" | "level", value: string | number) => {
    const newSkills = [...formData.skills];
    // @ts-ignore
    newSkills[index][field] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      // Reset form logic here if needed
    }, 2000);
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
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                
                {/* 1. Identity Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    01 // Identity Matrix
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Operative Name</label>
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
                      <label className="text-sm font-bold text-gray-300 uppercase">Class (Role)</label>
                      <select 
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono appearance-none"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-300 uppercase">Base Location</label>
                      <input 
                        type="text" 
                        className="w-full bg-black/50 border border-white/20 p-3 rounded-sm text-white focus:border-[#FFAB00] focus:outline-none transition-colors font-mono"
                        placeholder="CITY, REGION"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    02 // Visual Data
                  </h3>
                  <div className="border-2 border-dashed border-white/10 hover:border-[#FFAB00]/50 rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group bg-black/20">
                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-[#FFAB00] mb-2 transition-colors" />
                    <span className="text-xs font-mono text-gray-400 uppercase">Drag & Drop Avatar / Resume</span>
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
                      className="text-[#FFAB00] text-xs font-bold uppercase hover:underline flex items-center gap-1"
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
                             value={skill.level}
                             onChange={(e) => handleSkillChange(index, "level", parseInt(e.target.value))}
                           />
                           <span className="text-xs font-mono text-[#FFAB00] w-8">{skill.level}%</span>
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

                {/* Footer Actions */}
                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative group px-8 py-3 bg-[#FFAB00] text-black font-bold uppercase tracking-widest overflow-hidden hover:bg-white transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? "UPLOADING..." : "SUBMIT DOSSIER"} <Save className="w-4 h-4" />
                    </span>
                    {/* Glitch Overlay */}
                    {!isSubmitting && (
                      <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 ease-out opacity-50" />
                    )}
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};