import { Resume, ResumeSkill } from "../ResumeModel";
import { differenceInMonths } from "../Time";
import { generateRandomId } from "../Identity";
import { FluentSet } from "../FluentSet";
import { FluentMap } from "../FluentMap";
import { FluentIterable } from "../FluentIterable";

// Enum for the source of the skill
export enum SkillSource {
  WORK = "work", // Work skills (e.g., skills from work experiences)
  SKILLS = "skills", // Skills section (e.g. explicit skills listed in the resume)
}

// Identifier for the source of the skill
export interface SkillSourceIdentifier {
  source: SkillSource; // Source of the skill (work, profile, skills)
  id: string; // Unique identifier for the skill occurrence (e.g., work name or profile name) must be unique in the whole resume
  startDate?: Date; // Start date of the skill occurrence (optional)
  endDate?: Date; // End date of the skill occurrence (optional)
}

// Types for the stats we'll collect
export interface SkillOccurrence extends ResumeSkill {
  source: SkillSourceIdentifier; // Source of the skill (work, profile, skills)
}

// The meta about the skill tree structure but not used to track any data about it
export interface Skill {
  id: string; // Unique identifier for the skill (e.g., skill name)
  name: string; // Name of the skill
  children: FluentSet<string>; // Children skills (derived from keywords) by keyword
  occurrences: FluentSet<SkillOccurrence>; // Skills that directly reference this node
  isCategory: boolean; // Categories are skills that have children
  isSkill: boolean; // Skills are skills that have no children
  isRoot: boolean; // Root skill represents the top level of the tree (e.g., Career)
}

// The stats for a skill
export interface SkillStats {
  skill: Skill; // The skill itself
  occurrences: FluentSet<SkillOccurrence>; // List of occurrences of this skill in the resume
  months: number; // Total experience in months
  children: FluentSet<SkillStats>; // Children skills (if applicable)
}

export class SkillAnalyzer {
  constructor(
    public resume: Resume,
    public tree: SkillTree,
    public byName: SkillOccurrenceIndex,
    public career: SkillStatsIndex,
    public work: FluentMap<string, SkillStatsIndex>,
    public year: FluentMap<number, SkillStatsIndex>,
    public yearCummulative: FluentMap<number, SkillStatsIndex>,
    public now: Date
  ) {}

  static analyze(resume: Resume): SkillAnalyzer {
    console.time("SkillAnalyzer.analyzeAsync");
    try {
      // Build the skill tree from the skills in the resume
      if (!resume) {
        throw new Error("Resume is required for analysis."); // Throw an error if the resume is not provided
      }

      const now = new Date(); // Get the current date

      // Extract skills from the resume
      const profileSkills = SkillOccurrenceIndex.from(
        { source: SkillSource.SKILLS, id: "skills", endDate: now },
        FluentIterable.from(resume.skills || [])
      );
      const workSkills = FluentIterable.from(resume.work || []).toMapKV(
        (w) => w.id,
        (w) =>
          SkillOccurrenceIndex.from(
            {
              source: SkillSource.WORK,
              id: w.id || generateRandomId("work-"),
              startDate: w.startDate,
              endDate: w.endDate || now,
            },
            FluentIterable.from(w.skills || [])
          )
      );
      const skills = new SkillOccurrenceIndex()
        .append(profileSkills.all()) // Add skills from the profile section
        .append(workSkills.fluent().flatMap(([, occIndex]) => occIndex.all())); // Combine skills from profile and work experiences

      // Create a skill tree from the skills
      const tree = SkillTree.from(skills.all()); // Create a new SkillTree instance from the skills

      // Figure out the year buckets using both the start and end dates of the skills
      const years = skills
        .all()
        .flatMap((occ) => {
          const startYear = occ.startDate?.getFullYear() || 0; // Get the start year of the skill occurrence
          const endYear = occ.endDate?.getFullYear() || 0; // Get the end year of the skill occurrence
          return [startYear, endYear]; // Return an array of start and end years
        })
        .filter((year) => year > 0) // Filter out invalid years
        .toSet()
        .fluent()
        .sort(); // Convert to a FluentSet for uniqueness

      // Create a by year summary from the occurrences
      const byYear = years.toMapKV(
        (year) => year,
        (year) =>
          SkillStatsIndex.from(
            year.toString(),
            tree.topLevel.fluentKeys(),
            tree,
            new SkillOccurrenceIndex().append(
              skills.all().filter((s) => withinYear(year, s))
            ),
            calculateNonOverlappingDurationInMonthsForYears.bind(null, [year])
          )
      );

      // Create a cumulative by year summary from the occurrences
      // Group all the occurrences by year and prev year so we can trick the stats to be cumulative
      const yearCummulative = byYear
        .fluent()
        .sortBy(([year]) => year) // Sort the years in ascending order (important for cumulative calculation)
        .toMapKV(
          ([year]) => year,
          ([year, occ]) =>
            SkillStatsIndex.from(
              year.toString(),
              tree.topLevel.fluentKeys(),
              tree,
              new SkillOccurrenceIndex().append(occ.occurrences()).append(
                // include all occurances from before this year
                byYear
                  .fluent()
                  .filter(([y]) => y < year && y > 0)
                  .flatMap(([, prevOcc]) => prevOcc.occurrences())
              ),
              // Calculate the non-overlapping duration for the current year and the previous year
              calculateNonOverlappingDurationInMonthsForYears.bind(
                null,
                byYear
                  .fluentKeys()
                  .filter((y) => y <= year)
                  .toArray()
              )
            )
        );

      // Create a career summary from the occurrences
      const career = SkillStatsIndex.from(
        "Career",
        tree.topLevel.fluentKeys(),
        tree,
        skills,
        calculateNonOverlappingDurationInMonths
      );

      // Create a work summary from the occurrences
      const work = workSkills.fluent().toMapKV(
        ([id]) => id,
        ([id, occ]) =>
          SkillStatsIndex.from(
            id,
            occ.fluentKeys(),
            tree,
            occ,
            calculateNonOverlappingDurationInMonths
          )
      );

      // Return the resume skill stats
      return new SkillAnalyzer(
        resume,
        tree,
        skills,
        career,
        work,
        byYear,
        yearCummulative,
        now
      );
    } finally {
      console.timeEnd("SkillAnalyzer.analyzeAsync");
    }
  }
}

export class SkillTree extends FluentMap<string, Skill> {
  constructor(public topLevel: FluentMap<string, Skill>) {
    super(); // Call the parent constructor
  }

  // Ensure all keywords are created in the tree
  initKeywords = (keywords: string[]) => {
    if (!keywords || keywords.length === 0) return; // Return if no keywords are provided
    // Create a set of keywords to ensure uniqueness
    for (const keyword of keywords) {
      if (!this.has(keyword)) {
        this.set(keyword, {
          id: generateRandomId("skill-"),
          name: keyword,
          children: new FluentSet(),
          occurrences: new FluentSet(),
          isCategory: false,
          isSkill: true,
          isRoot: false,
        });
      }
    }
  };

  // Enumerates all the skills in the tree and their children using a depth first search
  // This is used to traverse the tree and find all the skills and their children
  depthFirst = (): FluentIterable<Skill> => {
    return new FluentIterable(() => {
      // Reference to the SkillTree instance
      const self = this;

      // Create a recursive generator function to yield the skills
      function* recursiveGenerator(skill: Skill): Generator<Skill> {
        // First yield the children of the skill
        for (const child of skill.children) {
          const childNode = self.get(child);
          if (childNode) {
            yield* recursiveGenerator(childNode); // Recursively yield the child node
          }
        }

        // Then yield the skill itself (depth first)
        yield skill;
      }

      // Create a generator function to yield the top level skills
      function* generator(): Generator<Skill> {
        for (const skill of self.topLevel.values()) {
          yield* recursiveGenerator(skill); // Start from the top level skills
        }
      }

      // Return the generator function
      return generator();
    });
  };

  // Walk the tree and remove any nodes that cause infinite loops
  removeInfiniteLoops = () => {
    const recursivelyRemoveInfiniteLoops = (
      node: Skill,
      path: Set<string>
    ): void => {
      if (node.children.size > 0) {
        for (const childName of node.children) {
          const childNode = this.get(childName);
          if (!childNode) continue; // Skip if the child node is not found
          if (path.has(childName)) {
            // If the child is already in the path, remove it from the parent
            node.children.delete(childName); // Remove the child from the parent
          } else {
            path.add(childName); // Add the child to the path
            recursivelyRemoveInfiniteLoops(childNode, path); // Recursively check for infinite loops in the child node
            path.delete(childName); // Remove the child from the path after processing
          }
        }
      }
    };
    for (const node of this.topLevel.values()) {
      const path = new Set<string>();
      recursivelyRemoveInfiniteLoops(node, path); // Remove infinite loops in the tree
    }
  };

  // Builds the skill tree structure from the skills which is used to navigate the skills and their keywords
  static from = (skills: FluentIterable<SkillOccurrence>): SkillTree => {
    // Keep track of the top level skills (categories) in the tree
    const topLevel = new FluentMap<string, Skill>(); // Set to store the top level skills
    const tree = new SkillTree(topLevel); // Create a new SkillTree instance

    // Return the empty tree if no skills are provided
    if (!skills) return tree;

    // Build a tree structure for the skills and their keywords
    skills.reduce((acc, origin) => {
      const node = acc.get(origin.name);
      // Check if the skill already exists in the map
      if (node) {
        // If the skill already exists, add the keywords to its children
        if (origin.keywords?.length) {
          // Merge the keywords into the existing node's children ensuring they are unique
          node.children.append(FluentIterable.from(origin.keywords));

          // Update the isCategory and isSkill properties
          const isCategory = true;
          node.isCategory = isCategory; // Update the isCategory property
          node.isSkill = !isCategory; // Update the isSkill property
        }

        // Append the skill to the existing node's skills
        node.occurrences.add(origin); // Add the skill to the existing node's skills
      } else {
        // If the skill doesn't exist, create a new node
        const isCategory = !!(origin.keywords && origin.keywords.length > 0); // Check if the skill is a category
        const newNode: Skill = {
          id: generateRandomId("skill-"), // Generate a unique ID for the skill
          name: origin.name,
          children: new FluentSet(origin.keywords || []),
          occurrences: new FluentSet([origin]), // Initialize skills to an empty array
          isCategory, // Check if the skill is a category
          isSkill: !isCategory, // Check if the skill is a skill or a keyword
          isRoot: false, // Initialize isRoot to false
        };
        acc.set(origin.name, newNode);
      }

      // Ensure all keywords are created in the tree
      if (origin.keywords?.length) {
        tree.initKeywords(origin.keywords); // Initialize the keywords in the tree
      }

      return acc;
    }, tree);

    // Start by adding all the skills to the top level skills
    for (const skill of tree.fluentValues()) {
      // Add the skill to the top level skills
      if (skill.isCategory) {
        topLevel.set(skill.name, skill);
      }
    }

    // Finally lets walk all nodes and ensure the structure is connected just in case additional keywords were added to the skills
    for (const skill of tree.fluentValues()) {
      // Check each children of the skill
      for (const childName of skill.children) {
        const childNode = tree.get(childName); // Get the child node from the tree
        if (childNode) {
          // If the child node exists, add it to the parent node's children
          skill.children.add(childName); // Add the child to the parent node's children
          topLevel.delete(childName); // Remove the child from the possible top level skills
        }
      }
    }

    // Remove any skills that are not top level from the top level map
    tree.removeInfiniteLoops();

    // Return the skill tree structure
    return tree;
  };
}

export class SkillOccurrenceIndex extends FluentMap<
  string,
  FluentSet<SkillOccurrence>
> {
  constructor() {
    super(); // Call the parent constructor
  }

  append = (skills: Iterable<SkillOccurrence>): SkillOccurrenceIndex => {
    // Append the skills to the index
    for (const skill of skills) {
      const node = this.get(skill.name); // Get the skill node from the index
      if (node) {
        node.add(skill); // Add the occurrence to the existing node's occurrences
      } else {
        this.set(skill.name, new FluentSet([skill])); // Create a new set for the occurrences
      }
    }

    return this; // Return the updated index
  };

  all = (): FluentIterable<SkillOccurrence> => {
    return this.fluent().flatMap(([_, occ]) => occ.fluent()); // Flatten the occurrences from all skills
  };

  static from = (
    source: SkillSourceIdentifier,
    skills: Iterable<ResumeSkill>
  ): SkillOccurrenceIndex => {
    return FluentIterable.from(skills).reduce((acc, skill) => {
      const node = acc.get(skill.name); // Get the skill node from the index
      const occurrence = {
        source,
        startDate: skill.startDate || source.startDate, // Start date of the skill occurrence
        endDate: skill.endDate || source.endDate, // End date of the skill occurrence
        ...skill,
      };
      if (node) {
        // Add the occurrence to the existing node's occurrences
        node.add(occurrence);
      } else {
        // If the skill doesn't exist, create a new node
        acc.set(skill.name, new FluentSet([occurrence]));
      }
      return acc; // Return the updated index
    }, new SkillOccurrenceIndex()); // Initialize the index
  };
}

type SkillStatsIndexJson = Record<string, SkillStats> & {
  root: SkillStats; // JSON representation of the skill stats index
};

export class SkillStatsIndex extends FluentMap<string, SkillStats> {
  constructor(public tree: SkillTree, public root: SkillStats) {
    // Call the parent constructor with the root skill stats passing the children of the root skill
    super(root.children.fluent().map((c) => [c.skill.name, c]));
  }

  all = (): FluentIterable<SkillStats> => {
    const self = this; // Reference to the SkillStatsIndex instance
    function* generator(): Generator<SkillStats> {
      yield* SkillStatsIndex.depthFirst(self.root); // Yield the skill stats from the root
    }
    return new FluentIterable(generator); // Return the generator function
  };

  occurrences = (): FluentIterable<SkillOccurrence> => {
    // use generator to yield the occurrences of the root skill stats
    const self = this; // Reference to the SkillStatsIndex instance
    function* generator(): Generator<SkillOccurrence> {
      yield* SkillStatsIndex.depthFirstOccurances(self.root); // Yield the occurrences of the child stats
    }
    return new FluentIterable(generator); // Return the generator function
  };

  json = (): SkillStatsIndexJson => {
    return this.fluent().reduce(
      (acc, [key, value]) => {
        acc[key] = value; // Convert the stats to a JSON object
        return acc;
      },
      { root: this.root } as SkillStatsIndexJson
    ); // Return the JSON object
  };

  static createSkillStats = (
    skill: Skill,
    occurrences: FluentSet<SkillOccurrence> | undefined
  ): SkillStats => {
    return {
      skill: skill,
      occurrences: new FluentSet(occurrences), // Initialize occurrences to an empty array
      months: 0, // Initialize months to 0
      children: new FluentSet(), // Initialize children to an empty array
    };
  };

  static depthFirst = (stats: SkillStats): FluentIterable<SkillStats> => {
    // Create a generator function to yield the skill stats
    function* generator(): Generator<SkillStats> {
      for (const child of stats.children) {
        yield* SkillStatsIndex.depthFirst(child); // Recursively yield the child stats
      }
      yield stats; // Yield the current skill stats
    }
    return new FluentIterable(generator); // Return the generator function
  };

  static depthFirstOccurances = (
    stats: SkillStats
  ): FluentIterable<SkillOccurrence> => {
    // Create a generator function to yield the occurrences of the child stats
    function* generator(): Generator<SkillOccurrence> {
      for (const child of stats.children) {
        yield* SkillStatsIndex.depthFirstOccurances(child); // Recursively yield the occurrences of the child stats
      }
      yield* stats.occurrences.fluent(); // Yield the occurrences of the current stats
    }
    return new FluentIterable(generator); // Return the generator function
  };

  static from = (
    name: string,
    skills: FluentIterable<string>,
    tree: SkillTree,
    occurrences: SkillOccurrenceIndex,
    calculateDuration: (occurrences: FluentIterable<SkillOccurrence>) => number
  ): SkillStatsIndex => {
    // Depth first analysis of the skills provided
    const recursiveAnalyze = (skill: Skill): SkillStats => {
      // Create a new skill stats object for the current skill
      const stats = this.createSkillStats(skill, occurrences.get(skill.name)); // Create a new skill stats object for the current skill

      // Analyze each child first
      for (const childName of skill.children) {
        const childNode = tree.get(childName); // Get the child node from the tree
        if (childNode) {
          const childStats = recursiveAnalyze(childNode); // Recursively analyze the child node
          stats.children.add(childStats); // Add the child stats to the root's children
        }
      }

      // Now analyze the current skill we have it walk the tree because calculations might overlap and we need to calculate the non overlapping months
      stats.months = calculateDuration(this.depthFirstOccurances(stats));

      return stats;
    };

    // Process each skill in the index
    const root = recursiveAnalyze({
      id: generateRandomId("skill-"),
      name: name,
      children: new FluentSet(skills),
      occurrences: new FluentSet(),
      isCategory: true,
      isSkill: false,
      isRoot: true,
    });

    return new SkillStatsIndex(tree, root); // Create a new SkillStatsIndex instance with the root skill stats
  };
}

// Calculate the total non-overlapping duration of all occurrences
function calculateNonOverlappingDurationInMonths(
  occurrences: FluentIterable<SkillOccurrence>,
  calculateDifferenceInMonths: (
    start: Date,
    end: Date
  ) => number = differenceInMonths
): number {
  // Get all valid date ranges regardless of skill
  const dateRanges = occurrences
    .map((occ) => {
      if (!occ.startDate || !occ.endDate) return null;
      return { startDate: occ.startDate, endDate: occ.endDate };
    })
    .truthy()
    .toArray() as { startDate: Date; endDate: Date }[];

  if (dateRanges.length === 0) return 0;

  // Sort and merge as before
  dateRanges.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const mergedRanges = [];
  let currentRange = { ...dateRanges[0] };

  // Merge overlapping periods
  for (let i = 1; i < dateRanges.length; i++) {
    const range = dateRanges[i];
    if (range.startDate <= currentRange.endDate) {
      currentRange.endDate = new Date(
        Math.max(currentRange.endDate.getTime(), range.endDate.getTime())
      );
    } else {
      mergedRanges.push({ ...currentRange });
      currentRange = { ...range };
    }
  }
  mergedRanges.push(currentRange);

  // Calculate total duration
  return mergedRanges.reduce(
    (total, range) =>
      total + calculateDifferenceInMonths(range.startDate, range.endDate),
    0
  );
}

// Calculate the difference in months between two dates for a specific year
function differenceInMonthsForYear(
  year: number,
  startDate: Date,
  endDate: Date
): number {
  if (!startDate || !endDate) return 0;
  if (startDate > endDate) return 0;
  if (startDate.getFullYear() > year) return 0;
  if (endDate.getFullYear() < year) return 0;

  // Clamp dates to the specified year
  const start = new Date(
    Math.max(startDate.getTime(), new Date(year, 0, 1).getTime())
  );
  const end = new Date(
    Math.min(endDate.getTime(), new Date(year + 1, 0, 1).getTime())
  );

  // Calculate months difference using year and month components
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  // Add fractional month based on days
  const startDaysInMonth = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0
  ).getDate();
  const endDaysInMonth = new Date(
    end.getFullYear(),
    end.getMonth() + 1,
    0
  ).getDate();

  // If same month, calculate direct fraction
  if (months === 0) {
    return Math.max(
      0,
      (end.getDate() - start.getDate() + 1) / startDaysInMonth
    );
  }

  // Calculate the fraction of the start and end months
  const startFraction =
    (startDaysInMonth - start.getDate() + 1) / startDaysInMonth;
  const endFraction = end.getDate() / endDaysInMonth;

  // Return the whole months plus the fractional parts
  return Math.max(0, months - 1 + startFraction + endFraction);
}

// Calculate the non-overlapping duration by year for a specific skill or skills
function calculateNonOverlappingDurationInMonthsForYears(
  years: number[],
  occurrences: FluentIterable<SkillOccurrence>
): number {
  // Calculate the non-overlapping duration for the occurrences
  return calculateNonOverlappingDurationInMonths(
    occurrences,
    (startDate: Date, endDate: Date) =>
      years.reduce(
        (total, year) =>
          total + differenceInMonthsForYear(year, startDate, endDate),
        0
      )
  );
}

function withinYear(year: number, range: { startDate?: Date; endDate?: Date }) {
  if (!range.startDate || !range.endDate) return false; // Return false if no start or end date is provided
  const startYear = range.startDate.getFullYear(); // Get the start year of the range
  const endYear = range.endDate.getFullYear(); // Get the end year of the range
  return year >= startYear && year <= endYear; // Check if the year is within the range
}
