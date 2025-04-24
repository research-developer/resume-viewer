import { Resume, ResumeSkill } from "./ResumeModel";
import { differenceInMonths } from "./Time";
import { generateRandomId } from "./Identity";
import { FluentSet } from "./FluentSet";
import { FluentMap } from "./FluentMap";
import { FluentIterable } from "./FluentIterable";

// Enum for the source of the skill
export enum SkillSource {
  WORK = "work", // Work skills (e.g., skills from work experiences)
  SKILLS = "skills", // Skills section (e.g. explicit skills listed in the resume)
}

// Identifier for the source of the skill
export interface SkillSourceIdentifier {
  source: SkillSource; // Source of the skill (work, profile, skills)
  id: string; // Unique identifier for the skill occurrence (e.g., work name or profile name) must be unique in the whole resume
}

// The meta about the skill tree structure but not used to track any data about it
export interface SkillTreeNode {
  name: string; // Name of the skill
  children: FluentSet<string>; // Children skills (derived from keywords) by keyword
  parents: FluentSet<string>; // Parent skills (when its a keyword or mentioned in the keywords of another skill) by name
  count: number; // Total number of children skills
  skills: ResumeSkill[]; // Skills that directly reference this node
  isCategory: boolean; // Categories are skills that have children
  isSkill: boolean; // Skills are skills that have no children
}

// The skill tree structure
export type SkillTree = {
  all: FluentMap<string, SkillTreeNode>; // All skills in the tree
  topLevel: SkillTreeNode[]; // Top level skills (categories) in the tree
  count: number; // Total number of skills in the tree
};

// Types for the stats we'll collect
export interface SkillOccurrence {
  source: SkillSourceIdentifier; // Source of the skill (work, profile, skills)
  months?: number; // Duration in months if applicable
  startDate?: Date; // Start date of the skill (if applicable)
  endDate?: Date; // End date of the skill (if applicable)
  skill: SkillTreeNode; // The skill itself
}

// The stats for a skill
export interface SkillStats {
  skill: SkillTreeNode; // The skill itself
  occurrences: SkillOccurrence[]; // List of occurrences of this skill in the resume
  count: number; // Number of times this skill appears in the resume
  months: number; // Total experience in months
}

// Summary of skill stats for a skill
export interface SkillStatsSummary {
  stats: SkillStats[]; // List of skill stats for this skill
  count: number; // Total number of skills in the summary
  months: number; // Total experience in months
}

// Tree node of the final summaries by skill
export interface SkillStatsSummaryTreeNode {
  skill: SkillTreeNode; // The skill itself
  summary: SkillStatsSummary; // Summary of skill stats for this skill
  children: SkillStatsSummaryTreeNode[]; // Children of this skill in the tree
}

// Tree of the final summaries by skill
export interface SkillStatsSummaryTree {
  all: FluentMap<string, SkillStatsSummaryTreeNode>; // All skills in the tree
  topLevel: FluentMap<string, SkillStatsSummaryTreeNode>; // Top level skills (categories) in the tree
  count: number; // Total number of skills in the tree
}

// Resume skill stats for the entire resume
export interface ResumeSkillStats {
  work: FluentMap<string, SkillStatsSummaryTree>; // The work skills summary
  skills: SkillStatsSummaryTree; // The skills summary (e.g. skills at the root of the resume)
  all: SkillStatsSummaryTree; // All skills from both work and profile
  summary: SkillStatsSummary; // The summary of all skills
  tree: SkillTree; // The skill tree structure
}

export function getResumeSkillStats(resume: Resume): ResumeSkillStats {
  // Build the skill tree from the skills in the resume
  const tree = buildSkillTree(getSkills(resume));

  // Process the skills from the work experiences
  const workSkills =
    resume.work?.reduce((acc, w) => {
      const skillsTree = processSkills(
        tree,
        w.skills || [],
        { source: SkillSource.WORK, id: w.id || generateRandomId("work-") },
        w.startDate,
        w.endDate
      );
      // Add the skills to the map using the work name as the key
      acc.set(w.name, skillsTree);
      return acc;
    }, new FluentMap<string, SkillStatsSummaryTree>()) ??
    new FluentMap<string, SkillStatsSummaryTree>();

  // Process the skills from the profile section
  const profileSkills = processSkills(
    tree,
    resume.skills || [],
    { source: SkillSource.SKILLS, id: "skills" },
    undefined,
    undefined
  );

  // Combine the work and profile skills into a single summary
  const allSkills = aggregateSummaryTrees(
    tree,
    workSkills.fluentValues().append(profileSkills)
  );

  // Combine the summaries into a single summary
  const summary = aggregateSummaries(
    allSkills.all.fluentValues().map((node) => node.summary)
  );

  // Return the resume skill stats
  return {
    work: workSkills,
    skills: profileSkills,
    all: allSkills,
    summary,
    tree: tree,
  };
}

// Core function to process skills from any source
export function processSkills(
  tree: SkillTree,
  skills: ResumeSkill[],
  source: SkillSourceIdentifier,
  startDate?: Date,
  endDate?: Date
): SkillStatsSummaryTree {
  const now = new Date(); // Current date for comparison

  // Group the skills and calculate stats for each skill
  const occurancesBySkill = skills.reduce((acc, skill) => {
    // Check if the skill is in the tree
    const skillNode = tree.all.get(skill.name);
    if (!skillNode) {
      return acc; // Skip if the skill is not in the tree
    }
    // Build the occurrence object
    const skillName = skill.name;
    const skillStartDate = skill.startDate || startDate || now;
    const skillEndDate = skill.endDate || endDate || now;
    const months = differenceInMonths(skillStartDate, skillEndDate);
    const occurrence: SkillOccurrence = {
      source: source,
      months: months,
      startDate: skillStartDate,
      endDate: skillEndDate,
      skill: skillNode,
    };
    // Add or update the occurrence in the map
    const existingOccurrenceList = acc.get(skillName);
    if (existingOccurrenceList) {
      existingOccurrenceList.push(occurrence); // Add to the existing list
    } else {
      acc.set(skillName, [occurrence]); // Create a new list for the skill
    }
    // Return the updated map
    return acc;
  }, new FluentMap<string, SkillOccurrence[]>());

  // Process the occurrences to build the summary tree
  return processSkillOccurances(tree, occurancesBySkill);
}

function processSkillOccurances(
  tree: SkillTree,
  occurancesBySkill: FluentMap<string, SkillOccurrence[]>
): SkillStatsSummaryTree {
  // Reduce a first pass to calculate the stats for each skill
  const statsBySkill = occurancesBySkill
    .fluent()
    .reduce((acc, [skillName, occurrences]) => {
      const skillNode = tree.all.get(skillName);
      if (!skillNode) return acc; // Skip if the skill is not in the tree
      const skillStats: SkillStats = {
        skill: skillNode,
        occurrences: occurrences,
        count: occurrences.length, // Count the number of occurrences
        months: calculateNonOverlappingDuration(
          FluentIterable.from(occurrences)
        ),
      };
      acc.set(skillName, skillStats);
      return acc;
    }, new FluentMap<string, SkillStats>());

  // Convert the map to an array of skill stats
  const stats = Array.from(statsBySkill.entries()).map(
    ([_, skillStats]) => skillStats
  );

  // Second pass we need to build the summary for each of the skills walking the tree to aggregate the existing stats
  const summaryBySkill = stats.reduce((acc, skillStats) => {
    const skillNode = tree.all.get(skillStats.skill.name);
    if (!skillNode) return acc; // Skip if the skill is not in the tree
    const summary: SkillStatsSummary = acc.get(skillNode.name) || {
      stats: [], // Initialize the stats array
      count: 0,
      months: 0,
    };
    summary.stats.push(skillStats); // Add the skill stats to the all array
    summary.count += skillStats.count; // Increment the count
    summary.months = calculateNonOverlappingDuration(
      FluentIterable.from(summary.stats.flatMap((s) => s.occurrences))
    );
    acc.set(skillNode.name, summary); // Update the summary in the map
    return acc;
  }, new FluentMap<string, SkillStatsSummary>());

  // Recursively walk the summaries and roll up the children summaries stats
  stats.forEach((skillStats) => {
    const skillNode = tree.all.get(skillStats.skill.name);
    if (!skillNode) return; // Skip if the skill is not in the tree
    const summary = summaryBySkill.get(skillNode.name);
    if (!summary) return; // Skip if the summary is not found
    skillNode.parents.forEach((parentName) => {
      const parentSummary = summaryBySkill.get(parentName);
      if (parentSummary) {
        appendSkillStatsSummary(parentSummary, skillStats); // Append the skill stats to the parent summary
      }
    });
  });

  // Build the summary tree structure
  return buildSummaryTree(tree, summaryBySkill.fluentValues());
}

// Append the skill stats to the summary
function appendSkillStatsSummary(
  summary: SkillStatsSummary,
  stats: SkillStats
) {
  summary.stats.push(stats); // Add the skill stats to the summary
  summary.count += stats.count; // Increment the count
  summary.months = calculateNonOverlappingDuration(
    FluentIterable.from(summary.stats.flatMap((s) => s.occurrences))
  ); // Calculate the total months from the occurrences
}

// Combine the summaries into a single summary
export function aggregateSummaries(
  summaries: FluentIterable<SkillStatsSummary>
): SkillStatsSummary {
  const combinedSummary: SkillStatsSummary = {
    stats: [],
    count: 0,
    months: 0,
  };
  summaries.forEach((summary) => {
    combinedSummary.stats.push(...summary.stats); // Add all stats to the combined summary
    combinedSummary.count += summary.count; // Increment the count
    combinedSummary.months = calculateNonOverlappingDuration(
      FluentIterable.from(combinedSummary.stats.flatMap((s) => s.occurrences))
    ); // Calculate the total months from the occurrences
  });
  return combinedSummary;
}

// Builds the skill tree structure from the skills which is used to navigate the skills and their keywords
export function buildSkillTree(skills: ResumeSkill[]): SkillTree {
  // Build a tree structure for the skills and their keywords
  const byName =
    skills?.reduce((acc, skill) => {
      const existingNode = acc.get(skill.name);
      // Check if the skill already exists in the map
      if (existingNode) {
        // If the skill already exists, add the keywords to its children
        if (skill.keywords?.length) {
          // Merge the keywords into the existing node's children ensuring they are unique
          existingNode.children = new FluentSet([
            ...(existingNode.children || []),
            ...skill.keywords,
          ]);

          // Update the isCategory and isSkill properties
          const isCategory = true;
          existingNode.isCategory = isCategory; // Update the isCategory property
          existingNode.isSkill = !isCategory; // Update the isSkill property
        }

        // Add the skill to the existing node's skills
        existingNode.skills.push(skill);
      } else {
        // If the skill doesn't exist, create a new node
        const isCategory = !!(skill.keywords && skill.keywords.length > 0); // Check if the skill is a category
        acc.set(skill.name, {
          name: skill.name,
          children: new FluentSet(skill.keywords || []),
          parents: new FluentSet(), // Initialize parents to an empty set
          skills: [skill], // Initialize with the current skill
          count: 0, // Initialize count to 0 will be updated later
          isCategory, // Check if the skill is a category
          isSkill: !isCategory, // Check if the skill is a skill or a keyword
        });
      }
      return acc;
    }, new FluentMap<string, SkillTreeNode>()) ??
    new FluentMap<string, SkillTreeNode>();
  // create fake skills for the keywords that are not in the skills list
  byName.forEach((skill, name) => {
    if (skill && skill.children.size > 0) {
      skill.children.forEach((keyword) => {
        if (!byName.has(keyword)) {
          // Create a fake skill for the keyword
          const fakeSkill: ResumeSkill = {
            id: generateRandomId("keyword-"), // Generate a unique ID for the keyword
            level: undefined,
            name: keyword,
            keywords: [],
            startDate: undefined,
            endDate: undefined,
          };
          // Add the fake skill to the map
          byName.set(keyword, {
            name: keyword,
            children: new FluentSet(),
            parents: new FluentSet([name]), // Link the parent skill to the keyword
            skills: [fakeSkill], // Initialize with the fake skill
            count: 0, // Initialize count to 0 will be updated later
            isCategory: false, // Keywords are not categories
            isSkill: true, // Keywords are skills
          });
        }
      });
    }
  });
  // iterate over the skills and link the parent skills to their keywords
  byName.forEach((skill, _) => {
    if (skill && skill.children.size > 0) {
      skill.children.forEach((keyword) => {
        const keywordNode = byName.get(keyword);
        if (keywordNode) {
          keywordNode.parents = new FluentSet([
            ...(keywordNode.parents || []),
            skill.name,
          ]);
        }
      });
    }
  });
  // Walk the tree and remove any nodes that cause infinite loops
  const removeInfiniteLoops = (
    node: SkillTreeNode,
    path: Set<string>
  ): void => {
    if (node.children.size > 0) {
      node.children.forEach((child) => {
        const childNode = byName.get(child);
        if (childNode && path.has(child)) {
          // Remove the child from the parent
          node.children.delete(child);
          // Remove the child from the child node's parents
          childNode.parents.delete(node.name);
          // Remove the skill from the child node's skills
          childNode.skills = childNode.skills.filter(
            (skill) => skill.name !== node.name
          );
        } else if (childNode) {
          // mutute the path and add the child to it so we have a unique path
          const childPath = new Set(path);
          childPath.add(child);

          // continue traversing the tree using the mutated path
          removeInfiniteLoops(childNode, childPath);
        }
      });
    }
  };
  byName.forEach((node) => {
    const path = new Set<string>();
    removeInfiniteLoops(node, path); // Remove infinite loops in the tree
  });
  // Recursively figure out the count of children for each node
  const count = (node: SkillTreeNode): number => {
    if (!node.children || node.children.size === 0) return 1; // Leaf node
    let total = 0;
    node.children.forEach((child) => {
      const childNode = byName.get(child);
      if (childNode) {
        // Recursively count children
        total += count(childNode); // Recursively count children
      }
    });
    return total;
  };
  // Return the skill tree structure
  return byName.fluentValues().reduce(
    (acc, node) => {
      // Count the number of children for each node
      node.count = count(node);
      // Add the node to the map
      acc.count += node.count; // Increment the total count
      // Add the node to the top level array if it has no parents
      if (node.parents.size === 0) {
        acc.topLevel.push(node);
      }
      // Return the updated accumulator
      return acc;
    },
    {
      all: byName,
      topLevel: [] as SkillTreeNode[],
      count: 0, // Initialize count to 0
    }
  );
}

export function getSkills(resume: Resume): ResumeSkill[] {
  if (!resume) return []; // Return an empty array if the resume is not provided
  const skills = resume.skills || [];
  const workSkills = resume.work?.map((w) => w.skills || []).flat(1) ?? [];
  // TODO: add other areas like volunteer, education, etc. when skills are added to them
  return [...skills, ...workSkills];
}

export function buildSummaryTree(
  tree: SkillTree,
  summaries: FluentIterable<SkillStatsSummary>
): SkillStatsSummaryTree {
  const all = new FluentMap<string, SkillStatsSummaryTreeNode>();
  const topLevel = new FluentMap<string, SkillStatsSummaryTreeNode>();
  let count = 0;
  summaries.forEach((summary) => {
    const skillNode = tree.all.get(summary.stats[0].skill.name);
    if (!skillNode) return; // Skip if the skill is not in the tree
    const summaryNode: SkillStatsSummaryTreeNode = {
      skill: skillNode,
      summary: summary,
      children: [],
    };
    all.set(skillNode.name, summaryNode); // Add the node to the map
    count++; // Increment the count
    if (skillNode.parents.size === 0) {
      topLevel.set(skillNode.name, summaryNode); // Add to top level if no parents
    }
  });
  // Recursively build the tree structure
  all.forEach((node) => {
    node.skill.parents.forEach((parentName) => {
      const parentNode = all.get(parentName);
      if (parentNode) {
        parentNode.children.push(node); // Add the child to the parent's children
      }
    });
  });
  // Return the summary tree structure
  return { all, topLevel, count };
}

// Aggregate multiple summary trees into a single summary tree by just extracting the underlying stats then summarizing them
export function aggregateSummaryTrees(
  tree: SkillTree,
  summaryTrees: FluentIterable<SkillStatsSummaryTree>
): SkillStatsSummaryTree {
  const occurancesBySkill = summaryTrees.reduce((acc, tree) => {
    // Iterate over all the skills in the tree and add their occurrences to the map
    tree.all.forEach((node) => {
      node.summary.stats.forEach((stats) => {
        stats.occurrences.forEach((occurrence) => {
          const skillName = occurrence.skill.name;
          const existingOccurrenceList = acc.get(skillName);
          if (existingOccurrenceList) {
            existingOccurrenceList.push(occurrence); // Add to the existing list
          } else {
            acc.set(skillName, [occurrence]); // Create a new list for the skill
          }
        });
      });
    });
    return acc;
  }, new FluentMap<string, SkillOccurrence[]>()); // Initialize the tree

  // Process the occurrences to build the summary tree
  return processSkillOccurances(tree, occurancesBySkill);
}

// Helper function to merge overlapping time periods and calculate total months without duplication
function calculateNonOverlappingDuration(
  occurrences: FluentIterable<SkillOccurrence>
): number {
  // Filter occurences to only include those with valid start and end dates
  const dateRanges = occurrences
    .map((occ) => {
      if (!occ.startDate || !occ.endDate) return null; // Skip if no start or end date
      // Ensure start and end dates are valid Date objects
      const startDate = occ.startDate; // Default to epoch if no start date
      const endDate = occ.endDate; // Default to now if no end date
      return { startDate, endDate };
    })
    .truthy() // Filter out null values
    .toArray() as { startDate: Date; endDate: Date }[]; // Cast to the expected type

  // Check if there are no date ranges to process
  if (dateRanges.length === 0) return 0;

  // Sort the date ranges by start date
  dateRanges.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Merge overlapping periods
  const mergedRanges = [];
  let currentRange = { ...dateRanges[0] };

  for (let i = 1; i < dateRanges.length; i++) {
    const range = dateRanges[i];

    // If current range overlaps with the next range
    if (range.startDate <= currentRange.endDate) {
      // Extend the current range if needed
      currentRange.endDate = new Date(
        Math.max(currentRange.endDate.getTime(), range.endDate.getTime())
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
    return total + differenceInMonths(range.startDate, range.endDate);
  }, 0);
}
