export type SkillLevel = "ROOKIE" | "INTERMEDIATE" | "EXPERT";

export const SKILL_LEVEL_TO_SCORE: Record<SkillLevel, number> = {
  ROOKIE: 33,
  INTERMEDIATE: 66,
  EXPERT: 99,
};

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  ROOKIE: "Rookie",
  INTERMEDIATE: "Intermediate",
  EXPERT: "Expert",
};

export const SKILL_LEVEL_OPTIONS: Array<{
  value: SkillLevel;
  label: string;
  score: number;
}> = [
  { value: "ROOKIE", label: "Rookie", score: 33 },
  { value: "INTERMEDIATE", label: "Intermediate", score: 66 },
  { value: "EXPERT", label: "Expert", score: 99 },
];

export const skillLevelToScore = (level: SkillLevel): number => {
  return SKILL_LEVEL_TO_SCORE[level];
};

export const scoreToSkillLevel = (score: number): SkillLevel => {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 33;

  // Nearest bucket mapping keeps compatibility with existing non-bucket values.
  if (safeScore < 50) {
    return "ROOKIE";
  }
  if (safeScore < 83) {
    return "INTERMEDIATE";
  }
  return "EXPERT";
};

export const normalizeSkillScore = (score?: number | null): number => {
  return skillLevelToScore(scoreToSkillLevel(score ?? 33));
};
