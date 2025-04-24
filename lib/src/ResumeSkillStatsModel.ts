import { Resume, ResumeSkill } from "./ResumeModel";
import { differenceInMonths } from "./Time";

// Types for the stats we'll collect
export interface SkillOccurrence {
  source: "work" | "profile" | "skills";
  context?: string; // e.g., company name for work
  id: string; // Some reference to where this skill was found
  startDate?: Date;
  endDate?: Date;
  durationMonths?: number; // Duration in months if applicable
}

export interface SkillStats {
  name: string;
  level?: string;
  occurrences: SkillOccurrence[];
  count: number;
  totalMonths: number; // Total experience in months
  keywords: string[]; // Keywords associated with this skill
  isKeyword: boolean; // Whether this skill is also a keyword for another skill
  isCategory: boolean; // Whether this skill is a category (has keywords and isn't just a keyword itself)
  parentSkills: string[]; // Skills that have this as a keyword
}

export interface KeywordHierarchy {
  skill: string;
  keywords: KeywordHierarchy[];
  totalMonths: number;
}

export interface ResumeSkillStats {
  all: SkillStats[];
  top: SkillStats[];
  byKeyword: Map<string, string[]>; // Map keywords to their parent skills
  hierarchies: KeywordHierarchy[]; // Hierarchical structure of skills
  totalWorkMonths: number;
}

// Helper function to merge overlapping time periods and calculate total months without duplication
function calculateNonOverlappingDuration(
  occurrences: SkillOccurrence[]
): number {
  // Filter only work experiences with valid dates
  const dateRanges = occurrences
    .filter(
      (occ) =>
        occ.source === "work" && occ.startDate && (occ.endDate || new Date())
    )
    .map((occ) => ({
      start: new Date(occ.startDate!),
      end: new Date(occ.endDate || new Date()),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (dateRanges.length === 0) return 0;

  // Merge overlapping periods
  const mergedRanges = [];
  let currentRange = { ...dateRanges[0] };

  for (let i = 1; i < dateRanges.length; i++) {
    const range = dateRanges[i];

    // If current range overlaps with the next range
    if (range.start <= currentRange.end) {
      // Extend the current range if needed
      currentRange.end = new Date(
        Math.max(currentRange.end.getTime(), range.end.getTime())
      );
    } else {
      // No overlap, add the current range to our result and start a new one
      mergedRanges.push({ ...currentRange });
      currentRange = { ...range };
    }
  }

  // Add the last range
  mergedRanges.push(currentRange);

  // Calculate total duration in months from the merged ranges
  return mergedRanges.reduce((total, range) => {
    return total + differenceInMonths(range.start, range.end);
  }, 0);
}

export function calculateResumeSkillStats(
  resume: Resume | null
): ResumeSkillStats | null {
  if (!resume) {
    return null;
  }

  // Create a map to track skills and their occurrences
  const skillsMap = new Map<string, SkillStats>();
  const keywordToSkillsMap = new Map<string, string[]>();

  // Collect all work experiences for deduplicating total work duration
  const workExperiences: Array<{ startDate?: Date; endDate?: Date }> = [];

  // Process explicit skills section
  if (resume.skills && resume.skills.length > 0) {
    resume.skills.forEach((skill) => {
      addSkillToMap(skillsMap, skill, {
        source: "skills",
        id: skill.name,
      });

      // Track keywords
      if (skill.keywords && skill.keywords.length > 0) {
        // Mark this skill as a category since it has keywords
        const existingSkill = skillsMap.get(skill.name);
        if (existingSkill) {
          existingSkill.isCategory = true;
        }

        skill.keywords.forEach((keyword) => {
          // Add this keyword to the mapping
          if (!keywordToSkillsMap.has(keyword)) {
            keywordToSkillsMap.set(keyword, []);
          }
          keywordToSkillsMap.get(keyword)?.push(skill.name);

          // Add the keyword as its own skill if it doesn't exist yet
          if (!skillsMap.has(keyword)) {
            skillsMap.set(keyword, {
              name: keyword,
              occurrences: [],
              count: 0,
              totalMonths: 0,
              keywords: [],
              isKeyword: true,
              isCategory: false, // Keywords themselves are not categories by default
              parentSkills: [skill.name],
            });
          } else {
            const existingKeywordSkill = skillsMap.get(keyword)!;
            existingKeywordSkill.isKeyword = true;
            if (!existingKeywordSkill.parentSkills.includes(skill.name)) {
              existingKeywordSkill.parentSkills.push(skill.name);
            }
          }
        });

        // Update the skill with its keywords
        const existingSkill1 = skillsMap.get(skill.name);
        if (existingSkill1) {
          existingSkill1.keywords = skill.keywords;
        }
      }
    });
  }

  // Process work experiences for skills and durations
  if (resume.work && resume.work.length > 0) {
    resume.work.forEach((job) => {
      // Add to work experiences for deduplication
      if (job.startDate) {
        workExperiences.push({
          startDate: job.startDate,
          endDate: job.endDate || new Date(),
        });
      }

      // Calculate job duration for individual skills
      const startDate = job.startDate;
      const endDate = job.endDate || new Date();

      // Skills explicitly defined in the job
      if (job.skills && job.skills.length > 0) {
        job.skills.forEach((skill) => {
          // Use skill-specific dates if available, otherwise default to job dates
          const skillStartDate = skill.startDate || startDate;
          const skillEndDate = skill.endDate || endDate;
          const skillDurationMonths = differenceInMonths(
            skillStartDate,
            skillEndDate
          );

          const occurrence = {
            source: "work" as const,
            context: job.name,
            id: `${job.name}-${skill.name}`,
            startDate: skillStartDate,
            endDate: skillEndDate,
            durationMonths: skillDurationMonths,
          };

          addSkillToMap(skillsMap, skill, occurrence);

          // Also add duration to keyword skills
          if (skill.keywords && skill.keywords.length > 0) {
            skill.keywords.forEach((keyword) => {
              if (skillsMap.has(keyword)) {
                const keywordSkill = skillsMap.get(keyword)!;
                keywordSkill.occurrences.push({
                  ...occurrence,
                  id: `${occurrence.id}-keyword-${keyword}`,
                });
                keywordSkill.count++;
                keywordSkill.totalMonths += skillDurationMonths;
              }
            });
          }
        });
      }
    });
  }

  // Calculate deduplicated total work experience
  const totalWorkMonths = calculateNonOverlappingDuration(
    workExperiences.map((exp, index) => ({
      source: "work" as const,
      id: `work-${index}`,
      startDate: exp.startDate,
      endDate: exp.endDate,
    }))
  );

  // Convert the map to an array and sort by duration first, then by frequency
  const allSkills = Array.from(skillsMap.values())
    .map((skill) => {
      // Recalculate total months with de-duplication for overlapping periods
      skill.totalMonths = calculateNonOverlappingDuration(skill.occurrences);
      return skill;
    })
    .map((skill) => {
      // For skills with keywords, ensure the parent skill's duration includes all keyword durations
      if (skill.keywords && skill.keywords.length > 0) {
        // Get all occurrences from this skill and its keywords
        const allOccurrences = [...skill.occurrences];

        skill.keywords.forEach((keyword) => {
          const keywordSkill = skillsMap.get(keyword);
          if (keywordSkill) {
            // Add all occurrences from the keyword skill
            allOccurrences.push(...keywordSkill.occurrences);
          }
        });

        // Calculate total duration with all occurrences combined
        skill.totalMonths = calculateNonOverlappingDuration(allOccurrences);
      }
      return skill;
    })
    .sort((a, b) => {
      // Primary sort by duration (descending)
      if (b.totalMonths !== a.totalMonths) {
        return b.totalMonths - a.totalMonths;
      }
      // Secondary sort by occurrence count (descending)
      return b.count - a.count;
    });

  // Get the top skills (top 5 or all if less than 5)
  const topSkillsCount = Math.min(5, allSkills.length);
  const topSkills = allSkills.slice(0, topSkillsCount);

  // Build skill hierarchies
  const rootSkills = allSkills.filter(
    (skill) => !skill.isKeyword || skill.parentSkills.length === 0
  );

  const buildHierarchy = (skillName: string): KeywordHierarchy => {
    const skill = skillsMap.get(skillName)!;
    const keywords = skill.keywords || [];

    return {
      skill: skillName,
      keywords: keywords
        .filter((k) => skillsMap.has(k))
        .map((k) => buildHierarchy(k)),
      totalMonths: skill.totalMonths,
    };
  };

  const hierarchies = rootSkills.map((skill) => buildHierarchy(skill.name));

  const stats: ResumeSkillStats = {
    all: allSkills,
    top: topSkills,
    byKeyword: keywordToSkillsMap,
    hierarchies,
    totalWorkMonths,
  };

  return stats;
}

// Helper function to add a skill to our map
function addSkillToMap(
  map: Map<string, SkillStats>,
  skill: ResumeSkill,
  occurrence: SkillOccurrence
) {
  const existingSkill = map.get(skill.name);

  const durationMonths = occurrence.durationMonths || 0;

  if (existingSkill) {
    existingSkill.occurrences.push(occurrence);
    existingSkill.count++;
    // Only add duration if this is a work occurrence
    if (occurrence.source === "work") {
      existingSkill.totalMonths += durationMonths;
    }
    // Ensure keywords are updated if present
    if (skill.keywords && skill.keywords.length > 0) {
      existingSkill.keywords = skill.keywords;
      existingSkill.isCategory = true; // Mark as category if it has keywords
    }
    map.set(skill.name, existingSkill);
  } else {
    map.set(skill.name, {
      name: skill.name,
      level: skill.level,
      occurrences: [occurrence],
      count: 1,
      totalMonths: occurrence.source === "work" ? durationMonths : 0,
      keywords: skill.keywords || [],
      isKeyword: false,
      isCategory: skill.keywords && skill.keywords.length > 0, // Mark as category if it has keywords
      parentSkills: [],
    });
  }
}
