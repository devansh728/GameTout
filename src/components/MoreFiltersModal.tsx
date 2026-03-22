import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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

  // Common input styles for better visibility
  const inputStyles = `
    w-full px-3 py-2 
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-gray-100 
    border border-gray-300 dark:border-gray-600 
    rounded-md text-sm 
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-colors
  `;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">More Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ===== JOB STATUS ===== */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Job Status</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.values(JobProfileStatus).map((status) => (
                <Button
                  key={status}
                  variant={jobStatuses.includes(status) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleJobStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* ===== GAME ENGINE ===== */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Game Engine</h3>
            <div className="flex gap-2 flex-wrap">
              {ALL_GAME_ENGINES.map((engine) => (
                <Button
                  key={engine.value}
                  variant={enginePreferences.includes(engine.value as GameEngine) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleEngine(engine.value as GameEngine)}
                >
                  {engine.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ===== EXPERIENCE YEARS ===== */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Experience Level</h3>
            <div className="flex gap-2 flex-wrap">
              {EXPERIENCE_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant={
                    minExperienceYears === preset.min && maxExperienceYears === preset.max
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => setExperienceRange(preset.min, preset.max)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add skill (e.g., C++, Python, HLSL)"
                value={tempSkillInput}
                onChange={(e) => setTempSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                className={`${inputStyles} flex-1`}
              />
              <Button size="sm" onClick={addSkill} className="shrink-0">
                Add
              </Button>
            </div>
            {skillNames.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                {skillNames.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-600 dark:hover:text-blue-300 font-bold ml-1 p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Job Categories</h3>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
              {allJobCategories.map((cat) => (
                <label 
                  key={cat} 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={jobCategories.includes(cat)}
                    onChange={() => toggleJobCategory(cat)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{getCategoryDisplayName(cat)}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Select one or more categories. Portfolios matching ANY selected category will be shown.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isLoading}>
            {isLoading ? "Loading..." : "Apply Filters"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}