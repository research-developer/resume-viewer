import { useMemo } from "react";
import { Resume } from "./ResumeModel";
import { getResumeSkillStats, ResumeSkillStats } from "./ResumeSkillStatsModel";

// Define the structure of the ResumeStats object
export interface ResumeStats {
  skills: ResumeSkillStats | null;
}

export function useResumeStats(resume: Resume | null) {
  return useMemo(
    () => ({ skills: resume && getResumeSkillStats(resume) }),
    [resume]
  );
}
