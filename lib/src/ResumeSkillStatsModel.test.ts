import { describe, it, expect, beforeEach } from "vitest";
import {
  getResumeSkillStats,
  buildSkillTree,
  getSkills,
  aggregateSummaries,
  SkillSource,
  SkillStatsSummary,
} from "./ResumeSkillStatsModel";
import { Resume, ResumeSkill } from "./ResumeModel";
import { FluentSet } from "./FluentSet";
import { FluentMap } from "./FluentMap";
import { FluentIterable } from "./FluentIterable";

describe("ResumeSkillStatsModel", () => {
  // Sample test data
  let mockResume: Resume;
  let mockSkills: ResumeSkill[];

  beforeEach(() => {
    // Reset the mock data before each test
    mockSkills = [
      {
        id: "skill-1",
        name: "JavaScript",
        keywords: ["ES6", "TypeScript"],
      },
      {
        id: "skill-2",
        name: "TypeScript",
        keywords: ["Static Typing"],
      },
      {
        id: "skill-3",
        name: "React",
        keywords: ["JavaScript", "Frontend"],
      },
      {
        id: "skill-4",
        name: "Node.js",
        keywords: ["JavaScript", "Backend"],
      },
    ];

    mockResume = {
      id: "resume-1",
      basics: {
        id: "basics-1",
        name: "Test User",
      },
      skills: [
        { id: "skill-1", name: "JavaScript", keywords: ["ES6", "TypeScript"] },
        { id: "skill-2", name: "CSS", keywords: ["Flexbox", "Grid"] },
      ],
      work: [
        {
          id: "work-1",
          name: "Company A",
          position: "Developer",
          startDate: new Date("2020-01-01"),
          endDate: new Date("2021-01-01"),
          skills: [
            {
              id: "skill-3",
              name: "JavaScript",
              startDate: new Date("2020-01-01"),
              endDate: new Date("2021-01-01"),
            },
            {
              id: "skill-4",
              name: "React",
              startDate: new Date("2020-06-01"),
              endDate: new Date("2021-01-01"),
            },
          ],
        },
        {
          id: "work-2",
          name: "Company B",
          position: "Senior Developer",
          startDate: new Date("2021-02-01"),
          endDate: new Date("2022-02-01"),
          skills: [
            {
              id: "skill-5",
              name: "TypeScript",
              startDate: new Date("2021-02-01"),
              endDate: new Date("2022-02-01"),
            },
            {
              id: "skill-6",
              name: "Node.js",
              startDate: new Date("2021-02-01"),
              endDate: new Date("2022-02-01"),
            },
          ],
        },
      ],
    };
  });

  describe("getSkills", () => {
    it("should return an empty array for undefined resume", () => {
      const result = getSkills(undefined as unknown as Resume);
      expect(result).toEqual([]);
    });

    it("should extract skills from resume correctly", () => {
      const skills = getSkills(mockResume);
      expect(skills).toHaveLength(6); // 2 from skills section, 4 from work

      // Check if skills from both sections are included
      const skillNames = skills.map((s) => s.name);
      expect(skillNames).toContain("JavaScript");
      expect(skillNames).toContain("CSS");
      expect(skillNames).toContain("React");
      expect(skillNames).toContain("TypeScript");
      expect(skillNames).toContain("Node.js");
    });
  });

  describe("buildSkillTree", () => {
    it("should build a tree with correct node structure", () => {
      const tree = buildSkillTree(mockSkills);

      // Check tree has all skills
      expect(
        tree.all
          .fluentValues()
          .map((s) => s.name)
          .toArray()
      ).toStrictEqual([
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "ES6",
        "Static Typing",
        "Frontend",
        "Backend",
      ]);

      // Check parent-child relationships
      const jsNode = tree.all.get("JavaScript");
      expect(jsNode).toBeDefined();
      expect(jsNode?.children.size).toBe(2);
      expect(jsNode?.children.has("ES6")).toBe(true);
      expect(jsNode?.children.has("TypeScript")).toBe(true);

      // Check child has parent reference
      const tsNode = tree.all.get("TypeScript");
      expect(tsNode).toBeDefined();
      expect(tsNode?.parents.has("JavaScript")).toBe(true);

      // Check isCategory and isSkill properties
      expect(jsNode?.isCategory).toBe(true);
      expect(jsNode?.isSkill).toBe(false);

      // Check circular reference handling
      const reactNode = tree.all.get("React");
      expect(reactNode).toBeDefined();
      expect(reactNode?.children.has("JavaScript")).toBe(true);

      // Note: If buildSkillTree properly removes circular references,
      // the JavaScript node should not have React as a child
      expect(jsNode?.children.has("React")).toBe(false);
    });

    it("should handle skills with no keywords", () => {
      const skills = [
        { id: "skill-1", name: "JavaScript" },
        { id: "skill-2", name: "TypeScript" },
      ];

      const tree = buildSkillTree(skills);
      expect(tree.all.size).toBe(2);

      const jsNode = tree.all.get("JavaScript");
      expect(jsNode).toBeDefined();
      expect(jsNode?.children.size).toBe(0);
      expect(jsNode?.isCategory).toBe(false);
      expect(jsNode?.isSkill).toBe(true);
    });
  });

  describe("aggregateSummaries", () => {
    it("should combine multiple summaries correctly", () => {
      // Create mock summaries
      const summary1: SkillStatsSummary = {
        stats: [],
        count: 3,
        months: 18,
      };

      const summary2: SkillStatsSummary = {
        stats: [],
        count: 2,
        months: 18,
      };

      const combined = aggregateSummaries(
        FluentIterable.from([summary1, summary2])
      );

      // Check the combined summary properties
      expect(combined.count).toBe(5); // 3 + 2
      expect(combined.months).toBe(36); // 18 + 18
    });
  });

  describe("getResumeSkillStats", () => {
    it("should process a complete resume and return valid stats", () => {
      const stats = getResumeSkillStats(mockResume);

      // Check that we have stats for work experiences
      expect(stats.work.size).toBe(2);
      expect(stats.work.has("Company A")).toBe(true);
      expect(stats.work.has("Company B")).toBe(true);

      // Check skills section stats
      expect(stats.skills.count).toBeGreaterThan(0);

      // Check that the "all" summary combines everything
      expect(stats.all.count).toBeGreaterThan(0);

      // Check that JavaScript appears in categories (because it has keywords)
      expect(
        stats.all.all.fluentValues().some((s) => s.skill.name === "JavaScript")
      ).toBe(true);

      // Check that the skill tree is properly built
      expect(stats.tree.all.size).toBeGreaterThan(0);
    });

    it("should calculate months correctly for skills with dates", () => {
      const stats = getResumeSkillStats(mockResume);

      // Company A work experience spans 12 months (Jan 2020 - Jan 2021)
      const companyAStats = stats.work.get("Company A");
      expect(companyAStats).toBeDefined();

      // JavaScript category in Company A spans 12 months
      const jsSkill = companyAStats?.all.get("JavaScript");
      expect(jsSkill?.summary.months).toBe(12);

      // React skill in Company A spans 7 months (Jun 2020 - Jan 2021)
      const reactSkill = companyAStats?.all.get("React");
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.summary.months).toBe(7);
    });
  });
});
