import { Resume, ResumeWork } from "@schema/ResumeSchema";
import { differenceInMonths } from "../Time";

/**
 * Represents key career statistics calculated from resume data
 */
export interface KeyStats {
  // Career metrics
  careerDuration: number; // Total months of professional experience
  uniqueCompanies: number; // Distinct companies worked for
  longestTenure: {
    // Longest time at a single company
    months: number;
    company: string;
  };
  currentPosition: {
    // Current position information
    title: string;
    company: string;
    months: number;
  } | null;
  careerProgressions: number; // Detected promotions/role changes
  mostRecentStartDate: Date | null; // Start date of most recent position

  // Education and skills
  totalCertifications: number; // Number of professional certifications

  // Additional accomplishments
  totalProjects: number; // Count of projects
  totalPublications: number; // Count of publications
  languages: number; // Number of languages listed

  // Dynamic metrics
  experienceByYear: Map<number, number>; // Skills growth by year
}

/**
 * Analyzes a resume to extract key statistics and career highlights
 */
export class KeyStatsAnalyzer {
  constructor(public resume: Resume, public stats: KeyStats) {}

  /**
   * Analyzes a resume and extracts key statistics that highlight the candidate's strengths
   * @param resume The resume to analyze
   * @returns Key statistics extracted from the resume
   */
  public static analyze(resume: Resume): KeyStatsAnalyzer {
    if (!resume) {
      throw new Error("Resume cannot be null or undefined");
    }

    const now = new Date();

    // Analyze work history
    const workHistory = resume.work || [];
    const sortedWorkHistory = [...workHistory].sort(
      (a, b) =>
        (b.endDate?.getTime() || now.getTime()) -
        (a.endDate?.getTime() || now.getTime())
    );

    // Calculate company metrics
    const uniqueCompanyNames = new Set(
      workHistory.map((job) => job.name?.toLowerCase()).filter(Boolean)
    );

    // Calculate longest tenure
    const longestPosition = this.findLongestPosition(workHistory);

    // Current position analysis
    const currentPosition = this.getCurrentPosition(sortedWorkHistory);

    // Count career progressions (role changes within same company)
    const careerProgressions = this.countProgressions(workHistory);

    // Calculate career duration avoiding overlaps
    const careerDuration = this.calculateTotalCareerDuration(workHistory);

    const keyStats: KeyStats = {
      // Career metrics
      careerDuration,
      uniqueCompanies: uniqueCompanyNames.size,
      longestTenure: longestPosition,
      currentPosition,
      careerProgressions,
      mostRecentStartDate: sortedWorkHistory[0]?.startDate || null,

      // Education and skills
      totalCertifications: (resume.certificates || []).length,

      // Additional accomplishments
      totalProjects: (resume.projects || []).length,
      totalPublications: (resume.publications || []).length,
      languages: (resume.languages || []).length,

      // Dynamic metrics
      experienceByYear: this.calculateExperienceByYear(workHistory),
    };

    return new KeyStatsAnalyzer(resume, keyStats);
  }

  /**
   * Finds the position with the longest tenure
   */
  private static findLongestPosition(workHistory: ResumeWork[]): {
    months: number;
    company: string;
  } {
    const now = new Date();
    let longestDuration = 0;
    let longestCompany = "";

    for (const job of workHistory) {
      if (!job.startDate) continue;

      const endDate = job.endDate || now;
      const months = differenceInMonths(job.startDate, endDate);

      if (months > longestDuration) {
        longestDuration = months;
        longestCompany = job.name || "Unknown";
      }
    }

    return { months: longestDuration, company: longestCompany };
  }

  /**
   * Gets information about the current (most recent) position
   */
  private static getCurrentPosition(
    sortedWorkHistory: ResumeWork[]
  ): { title: string; company: string; months: number } | null {
    const current = sortedWorkHistory[0];
    if (!current?.startDate) return null;

    const now = new Date();
    const endDate = current.endDate || now;
    const months = differenceInMonths(current.startDate, endDate);

    return {
      title: current.position || "Unknown Position",
      company: current.name || "Unknown Company",
      months,
    };
  }

  /**
   * Counts career progressions (role changes within the same company)
   */
  private static countProgressions(workHistory: ResumeWork[]): number {
    const companyRoles = new Map<string, string[]>();

    // Group positions by company
    for (const job of workHistory) {
      if (!job.name || !job.position) continue;

      const company = job.name.toLowerCase();
      const roles = companyRoles.get(company) || [];

      if (!roles.includes(job.position)) {
        roles.push(job.position);
      }

      companyRoles.set(company, roles);
    }

    // Count total progressions (roles - companies)
    let totalRoles = 0;
    companyRoles.forEach((roles) => {
      totalRoles += Math.max(0, roles.length - 1);
    });

    return totalRoles;
  }

  /**
   * Calculates total career duration, avoiding overlap between positions
   */
  private static calculateTotalCareerDuration(
    workHistory: ResumeWork[]
  ): number {
    if (!workHistory.length) return 0;

    const now = new Date();
    const ranges = workHistory
      .filter((job) => job.startDate) // Filter jobs with start dates
      .map((job) => {
        return {
          start: job.startDate!,
          end: job.endDate || now,
        };
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    if (ranges.length === 0) return 0;

    // Merge overlapping date ranges
    const mergedRanges = [ranges[0]];

    for (let i = 1; i < ranges.length; i++) {
      const current = ranges[i];
      const previous = mergedRanges[mergedRanges.length - 1];

      if (current.start <= previous.end) {
        // Merge overlapping ranges
        previous.end = new Date(
          Math.max(previous.end.getTime(), current.end.getTime())
        );
      } else {
        // Add non-overlapping range
        mergedRanges.push(current);
      }
    }

    // Calculate total duration from merged ranges
    return mergedRanges.reduce((total, range) => {
      return total + differenceInMonths(range.start, range.end);
    }, 0);
  }

  /**
   * Calculates experience gained by year
   */
  private static calculateExperienceByYear(
    workHistory: ResumeWork[]
  ): Map<number, number> {
    const experienceByYear = new Map<number, number>();
    const now = new Date();

    // Process each work position
    for (const job of workHistory) {
      if (!job.startDate) continue;

      const startYear = job.startDate.getFullYear();
      const endYear = job.endDate
        ? job.endDate.getFullYear()
        : now.getFullYear();

      // Distribute experience across years
      for (let year = startYear; year <= endYear; year++) {
        const startDate =
          year === startYear ? job.startDate : new Date(year, 0, 1);
        const endDate =
          year === endYear ? job.endDate || now : new Date(year, 11, 31);

        const monthsInYear = differenceInMonths(startDate, endDate);
        const currentValue = experienceByYear.get(year) || 0;
        experienceByYear.set(year, currentValue + monthsInYear);
      }
    }

    return experienceByYear;
  }
}
