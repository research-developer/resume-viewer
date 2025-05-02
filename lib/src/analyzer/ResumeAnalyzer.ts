import { getGravatarUrl } from "../GravatarUtil";
import { Resume } from "../ResumeModel";
import { SkillAnalyzer } from "./SkillAnalyzer";

export class ResumeAnalyzer {
  constructor(
    public resume: Resume,
    public stats: SkillAnalyzer,
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
      const gravatarUrl = await getGravatarUrl(resume.basics?.email || "", 200);
      return new ResumeAnalyzer(resume, skills, gravatarUrl);
    } finally {
      console.timeEnd("ResumeAnalyzer.analyzeAsync");
    }
  }
}
