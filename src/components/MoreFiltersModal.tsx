import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Filter, Sparkles, X } from "lucide-react";
import {
  JobProfileStatus,
  EXPERIENCE_PRESETS,
  ALL_GAME_ENGINES,
  GameEngine,
  JobCategory,
  BACKEND_TO_CATEGORY,
} from "@/types/portfolio";

interface MoreFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;

  // Current filter state from hook
  jobCategories: JobCategory[];
  jobStatuses: JobProfileStatus[];
  skillNames: string[];
  minExperienceYears: number | null;
  maxExperienceYears: number | null;
  enginePreferences: GameEngine[];
  location: string | null;

  // Callbacks from hook
  setJobCategories: (cats: JobCategory[]) => void;
  setJobStatuses: (statuses: JobProfileStatus[]) => void;
  setSkillNames: (skills: string[]) => void;
  setExperienceRange: (min: number | null, max: number | null) => void;
  setEnginePreferences: (engines: GameEngine[]) => void;
  setLocation: (location: string | null) => void;

  onApplyFilters: () => Promise<void>;
  isLoading: boolean;
}

export default function MoreFiltersModal({
  isOpen,
  onClose,
  jobCategories,
  jobStatuses,
  skillNames,
  minExperienceYears,
  maxExperienceYears,
  enginePreferences,
  setJobCategories,
  setJobStatuses,
  setSkillNames,
  setExperienceRange,
  setEnginePreferences,
  onApplyFilters,
  isLoading,
}: MoreFiltersModalProps) {
  const [tempSkillInput, setTempSkillInput] = useState("");

  // Get all backend job categories as array
  const allJobCategories: JobCategory[] = Object.values(JobCategory).filter(
    (val) => typeof val === "string"
  ) as JobCategory[];

  // Toggle job category
  const toggleJobCategory = (cat: JobCategory) => {
    setJobCategories(
      jobCategories.includes(cat)
        ? jobCategories.filter((c) => c !== cat)
        : [...jobCategories, cat]
    );
  };

  // Toggle job status
  const toggleJobStatus = (status: JobProfileStatus) => {
    setJobStatuses(
      jobStatuses.includes(status)
        ? jobStatuses.filter((s) => s !== status)
        : [...jobStatuses, status]
    );
  };

  // Toggle game engine
  const toggleEngine = (engine: GameEngine) => {
    setEnginePreferences(
      enginePreferences.includes(engine)
        ? enginePreferences.filter((e) => e !== engine)
        : [...enginePreferences, engine]
    );
  };

  // Add skill (case-insensitive, trimmed)
  const addSkill = () => {
    const trimmedSkill = tempSkillInput.trim();
    if (trimmedSkill && !skillNames.some((s) => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      setSkillNames([...skillNames, trimmedSkill]);
      setTempSkillInput("");
    }
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    setSkillNames(skillNames.filter((s) => s !== skill));
  };

  // Handle apply filters
  const handleApply = async () => {
    await onApplyFilters();
    onClose();
  };

  // Map backend category enum to display name
  const getCategoryDisplayName = (cat: JobCategory): string => {
    // Find the key in BACKEND_TO_CATEGORY that matches this value
    const entry = Object.entries(BACKEND_TO_CATEGORY).find(([, v]) => v === cat);
    return entry ? entry[0] : cat.replace(/_/g, " ");
  };

  const activePill = "bg-[#FFAB00] text-black border-[#FFAB00] shadow-[0_0_16px_rgba(255,171,0,0.25)]";
  const idlePill = "bg-white/5 text-gray-300 border-white/10 hover:border-[#FFAB00]/40 hover:text-white";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-[#FFAB00]/20 text-white shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_100px_rgba(255,171,0,0.08)]">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_2px,3px_100%]" />

        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-2 text-white uppercase tracking-wider font-display">
            <Filter className="w-4 h-4 text-[#FFAB00]" />
            Advanced Filters
          </DialogTitle>
          <p className="text-xs text-gray-500 font-mono">
            Refine results by role status, engine, skill and experience.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2 relative">
          {/* ===== JOB STATUS ===== */}
          <div>
            <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Job Status</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.values(JobProfileStatus).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleJobStatus(status)}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${
                    jobStatuses.includes(status) ? activePill : idlePill
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* ===== GAME ENGINE ===== */}
          <div>
            <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Game Engine</h3>
            <div className="flex gap-2 flex-wrap">
              {ALL_GAME_ENGINES.map((engine) => (
                <button
                  key={engine.value}
                  type="button"
                  onClick={() => toggleEngine(engine.value as GameEngine)}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${
                    enginePreferences.includes(engine.value as GameEngine) ? activePill : idlePill
                  }`}
                >
                  {engine.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===== EXPERIENCE YEARS ===== */}
          <div>
            <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Experience Level</h3>
            <div className="flex gap-2 flex-wrap">
              {EXPERIENCE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setExperienceRange(preset.min, preset.max)}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-lg border transition-all ${
                    minExperienceYears === preset.min && maxExperienceYears === preset.max
                      ? activePill
                      : idlePill
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              {minExperienceYears !== null && maxExperienceYears !== null
                ? `${minExperienceYears} - ${maxExperienceYears} years`
                : minExperienceYears !== null
                ? `${minExperienceYears}+ years`
                : maxExperienceYears !== null
                ? `Up to ${maxExperienceYears} years`
                : "Any"}
            </p>
          </div>

          {/* ===== SKILLS ===== */}
          <div>
            <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-gray-400">Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add skill (e.g., C++, Python, HLSL)"
                value={tempSkillInput}
                onChange={(e) => setTempSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                className="flex-1 bg-black/50 border border-white/15 rounded-md text-white text-sm px-3 py-2 placeholder:text-gray-600 focus:border-[#FFAB00] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={addSkill}
                className="shrink-0 px-3 py-2 bg-[#FFAB00] text-black text-xs font-bold uppercase rounded-md hover:bg-[#FFB900] transition-colors"
              >
                Add
              </button>
            </div>
            {skillNames.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-md border border-white/10">
                {skillNames.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#FFAB00]/10 border border-[#FFAB00]/20 text-[#FFAB00] rounded-full text-xs font-bold uppercase"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-white font-bold ml-1 p-0.5 rounded-full hover:bg-[#FFAB00]/20 transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Skills are matched case-insensitively. Find portfolios with any of these skills.
            </p>
          </div>

          {/* ===== LOCATION (HIDDEN FOR NOW) ===== */}
          {/* 
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Location</h3>
            <input
              type="text"
              placeholder="Search location (e.g., San Francisco, London)"
              value={location || ""}
              onChange={(e) => setLocation(e.target.value || null)}
              className={inputStyles}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Partial matches work (e.g., &quot;San&quot; matches &quot;San Francisco&quot;)
            </p>
          </div>
          */}

          {/* ===== JOB CATEGORIES ===== */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-gray-400">Job Categories</h3>
              <span className="text-[10px] text-gray-500 font-mono">
                {jobCategories.length} selected
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto p-3 border border-white/10 rounded-md bg-white/5">
              {allJobCategories.map((cat) => (
                <label 
                  key={cat} 
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={jobCategories.includes(cat)}
                    onChange={() => toggleJobCategory(cat)}
                    className="w-4 h-4 rounded border-white/30 text-[#FFAB00] focus:ring-[#FFAB00] bg-black/50"
                  />
                  <span className="text-sm text-gray-300">{getCategoryDisplayName(cat)}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Select one or more categories. Portfolios matching ANY selected category will be shown.
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#FFAB00] text-black hover:bg-[#FFB900] rounded-lg text-sm font-bold uppercase tracking-wide disabled:opacity-60 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Applying..." : "Apply Filters"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}