import { getGravatarUrl } from "../GravatarUtil";
import { Resume } from "../ResumeModel";
import { SkillAnalyzer } from "./SkillAnalyzer";
import { KeyStatsAnalyzer } from "./KeyStatsAnalyzer";

export class ResumeAnalyzer {
  constructor(
    public resume: Resume,
    public keyStats: KeyStatsAnalyzer,
    public skillStats: SkillAnalyzer,
    public gravatarUrl: string | null
  ) {}

  /**
   * Analyzes the resume and returns a ResumeAnalyzer instance.
   * @param resume - The resume to analyze.
   * @returns A Promise that resolves to a ResumeAnalyzer instance.
   */
  static async analyzeAsync(resume: Resume): Promise<ResumeAnalyzer> {
    console.time("ResumeAnalyzer.analyzeAsync");
    try {
      const skills = SkillAnalyzer.analyze(resume);
      const keyStats = KeyStatsAnalyzer.analyze(resume);
      const gravatarUrl = await getGravatarUrl(resume.basics?.email || "", 200);
      return new ResumeAnalyzer(resume, keyStats, skills, gravatarUrl);
    } finally {
      console.timeEnd("ResumeAnalyzer.analyzeAsync");
    }
  }
}
