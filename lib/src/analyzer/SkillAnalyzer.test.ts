import { describe, it, expect, beforeEach } from "vitest";
import { SkillAnalyzer, SkillTree, SkillSource } from "./SkillAnalyzer";
import { Resume, ResumeSkill } from "@schema/ResumeSchema";
import { FluentIterable } from "../FluentIterable";

describe("SkillAnalyzer", () => {
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

  describe("SkillOccurrenceIndex", () => {
    it("should extract skills from resume correctly", () => {
      const analyzer = SkillAnalyzer.analyze(mockResume);

      // Check if we have the right number of skills
      const skillsCount = analyzer.byName.size;
      expect(skillsCount).toBeGreaterThan(0);

      // Check if skills from both sections are included
      const skillNames = Array.from(analyzer.byName.keys());
      expect(skillNames).toContain("JavaScript");
      expect(skillNames).toContain("CSS");
      expect(skillNames).toContain("React");
      expect(skillNames).toContain("TypeScript");
      expect(skillNames).toContain("Node.js");
    });

    it("should create skill occurrences with correct sources", () => {
      const analyzer = SkillAnalyzer.analyze(mockResume);

      // Check skill sources
      const jsOccurrences = analyzer.byName.get("JavaScript");
      expect(jsOccurrences).toBeDefined();

      // Should have occurrences from both skills section and work experience
      const sources = jsOccurrences
        ?.fluent()
        .map((occ) => occ.source.source)
        .toArray();
      expect(sources).toContain(SkillSource.SKILLS);
      expect(sources).toContain(SkillSource.WORK);
    });
  });

  describe("SkillTree", () => {
    it("should build a tree with correct node structure", () => {
      // Create occurrences from mock skills
      const occurrences = mockSkills.map((skill) => ({
        source: { source: SkillSource.SKILLS, id: "test" },
        ...skill,
      }));

      // Build the tree
      const tree = SkillTree.from(FluentIterable.from(occurrences));

      // Check tree has all skills
      const allSkillNames = tree
        .fluentValues()
        .map((s) => s.name)
        .toArray();
      expect(allSkillNames).toContain("JavaScript");
      expect(allSkillNames).toContain("TypeScript");
      expect(allSkillNames).toContain("React");
      expect(allSkillNames).toContain("Node.js");
      expect(allSkillNames).toContain("ES6");
      expect(allSkillNames).toContain("Static Typing");
      expect(allSkillNames).toContain("Frontend");
      expect(allSkillNames).toContain("Backend");

      // Check parent-child relationships
      const jsNode = tree.get("JavaScript");
      expect(jsNode).toBeDefined();
      expect(jsNode?.children.size).toBe(2);
      expect(jsNode?.children.has("ES6")).toBe(true);
      expect(jsNode?.children.has("TypeScript")).toBe(true);

      // Check isCategory and isSkill properties
      expect(jsNode?.isCategory).toBe(true);
      expect(jsNode?.isSkill).toBe(false);

      // Check circular reference handling
      const reactNode = tree.get("React");
      expect(reactNode).toBeDefined();
      expect(reactNode?.children.has("JavaScript")).toBe(true);

      // Note: If SkillTree properly removes circular references,
      // the JavaScript node should not have React as a child
      expect(jsNode?.children.has("React")).toBe(false);
    });

    it("should handle skills with no keywords", () => {
      const skillsWithoutKeywords = [
        { id: "skill-1", name: "JavaScript" },
        { id: "skill-2", name: "TypeScript" },
      ];

      const occurrences = skillsWithoutKeywords.map((skill) => ({
        source: { source: SkillSource.SKILLS, id: "test" },
        ...skill,
      }));

      const tree = SkillTree.from(FluentIterable.from(occurrences));

      expect(tree.size).toBe(2);

      const jsNode = tree.get("JavaScript");
      expect(jsNode).toBeDefined();
      expect(jsNode?.children.size).toBe(0);
      expect(jsNode?.isCategory).toBe(false);
      expect(jsNode?.isSkill).toBe(true);
    });
  });

  describe("SkillAnalyzer", () => {
    it("should process a complete resume and return valid stats", () => {
      const analyzer = SkillAnalyzer.analyze(mockResume);

      // Check that we have stats for work experiences
      expect(analyzer.work.size).toBe(2);
      expect(analyzer.work.has("work-1")).toBe(true);
      expect(analyzer.work.has("work-2")).toBe(true);

      // Check that the tree is properly built
      expect(analyzer.tree.size).toBeGreaterThan(0);

      // Check career stats
      expect(analyzer.career.root.skill.name).toBe("Career");
      expect(analyzer.career.root.children.size).toBeGreaterThan(0);
    });

    it("should calculate months correctly for skills with dates", () => {
      const analyzer = SkillAnalyzer.analyze(mockResume);

      // Get work by company name
      const companyAStats = analyzer.work.get("work-1");

      expect(companyAStats).toBeDefined();

      // JavaScript total duration in Company A should be 12 months
      const jsSkillName = "JavaScript";
      const jsSkill = companyAStats?.get(jsSkillName);
      expect(jsSkill?.months).toBe(12);

      // React skill in Company A spans 7 months (Jun 2020 - Jan 2021)
      const reactSkillName = "React";
      const reactSkill = companyAStats?.get(reactSkillName);
      expect(reactSkill).toBeDefined();
      expect(reactSkill?.months).toBe(7);
    });

    it("should handle skills from different years", () => {
      const analyzer = SkillAnalyzer.analyze(mockResume);

      // Check year map has the right years
      expect(analyzer.year.has(2020)).toBe(true);
      expect(analyzer.year.has(2021)).toBe(true);
      expect(analyzer.year.has(2022)).toBe(true);

      // Check 2020 skills
      const skills2020 = analyzer.year.get(2020);
      expect(skills2020).toBeDefined();

      // Check months for specific skills in 2020
      const js2020 = skills2020?.get("JavaScript");
      const react2020 = skills2020?.get("React");

      expect(js2020).toBeDefined();
      expect(react2020).toBeUndefined(); // React is not referenced by a category in the profile skills which excludes it from the year map
    });
  });
});
