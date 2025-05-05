import React, { useMemo } from "react";
import { SkillStats, SkillTree } from "../../analyzer/SkillAnalyzer";
import { SkillRadarChartUI } from "./SkillRadarChartUI";
import { ResumeAnalyzer } from "../../analyzer/ResumeAnalyzer";

interface ResumeStatsUIProps {
  analyzer: ResumeAnalyzer | null;
}

export const ResumeStatsUI: React.FC<ResumeStatsUIProps> = ({ analyzer }) => {
  if (!analyzer?.skillStats) {
    return (
      <div className="text-muted py-4 text-center">No statistics available</div>
    );
  }

  const {
    careerMonths,
    careerYears,
    categorySkills,
    topCategorySkills,
    topSkills,
  } = useMemo(() => {
    const careerStats = analyzer.skillStats.career.fluentValues();
    const categorySkills = careerStats
      .filter((skill) => skill.skill.isCategory)
      .toArray();
    const topCategorySkills = categorySkills.slice(0, 10);
    const topSkills = careerStats
      .filter((skill) => !skill.skill.isCategory)
      .take(10)
      .toArray();
    const careerMonths = analyzer.skillStats.career.root.months;
    const careerYears = careerMonths / 12;
    return {
      careerStats,
      categorySkills,
      topCategorySkills,
      topSkills,
      careerYears,
      careerMonths,
    };
  }, [analyzer.skillStats]);

  return (
    <div className="space-y-6 p-4 bg-surface rounded-lg shadow border border-border">
      <h2 className="text-2xl font-bold text-primary">Resume Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-accent rounded-lg shadow border border-border">
          <h3 className="text-lg font-semibold text-primary">
            Total Work Experience
          </h3>
          <div className="text-2xl font-bold text-accent-blue">
            {careerYears.toFixed(1)} years
            <span className="ml-2 text-sm font-normal text-muted">
              ({careerMonths.toFixed(0)} months)
            </span>
          </div>
        </div>

        <div className="p-4 bg-accent rounded-lg shadow border border-border">
          <h3 className="text-lg font-semibold text-primary">Skills Count</h3>
          <div className="text-2xl font-bold text-accent-blue">
            {analyzer.skillStats.career.root.occurrences.size}
            <span className="ml-2 text-sm font-normal text-muted">
              ({categorySkills.length} categories)
            </span>
          </div>
        </div>
      </div>

      {/* Display categories first */}
      {topCategorySkills.length > 0 && (
        <SkillCategoriesChart skills={topCategorySkills} />
      )}

      <SkillRadarChartUI skills={categorySkills} />
      <TopSkillsChart skills={topSkills} />
      <SkillHierarchyTree categories={categorySkills} />
      <KeywordConnections tree={analyzer.skillStats.tree} />
    </div>
  );
};

// New component for displaying skill categories
interface SkillCategoriesChartProps {
  skills: SkillStats[];
}

export const SkillCategoriesChart: React.FC<SkillCategoriesChartProps> = ({
  skills,
}) => {
  const maxMonths = useMemo(
    () => Math.max(...skills.map((s) => s.months)),
    [skills]
  );
  const maxYears = maxMonths / 12;

  return (
    <div className="bg-accent p-4 rounded-lg shadow border border-border border-l-4 border-l-accent-blue">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Skill Categories
      </h3>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.skill.name} className="flex flex-col">
            <div className="flex items-center mb-1">
              <div className="w-1/4 font-medium text-secondary">
                {skill.skill.name}
              </div>
              <div className="w-3/4 flex items-center">
                <div
                  className="h-6 bg-accent-blue rounded-md"
                  style={{
                    width: `${(skill.months / maxMonths) * 100}%`,
                  }}
                />
                <div className="ml-2 text-sm text-muted">
                  {maxYears.toFixed(1)} years
                </div>
              </div>
            </div>
            {skill.skill.children && skill.skill.children.size > 0 && (
              <div className="ml-6 text-xs text-muted">
                Includes:
                {Array.from(skill.skill.children.entries()).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for displaying top skills as a bar chart
interface TopSkillsChartProps {
  skills: SkillStats[];
}

export const TopSkillsChart: React.FC<TopSkillsChartProps> = ({ skills }) => {
  const maxMonths = useMemo(
    () => Math.max(...skills.map((s) => s.months)),
    [skills]
  );
  const maxYears = maxMonths / 12;

  return (
    <div className="bg-accent p-4 rounded-lg shadow border border-border">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Top Skills by Experience
      </h3>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.skill.name} className="flex items-center">
            <div className="w-1/4 font-medium text-secondary">
              {skill.skill.name}
            </div>
            <div className="w-3/4 flex items-center">
              <div
                className="h-5 bg-accent-blue rounded-md"
                style={{
                  width: `${(skill.months / maxMonths) * 100}%`,
                }}
              />
              <div className="ml-2 text-sm text-muted">
                {maxYears.toFixed(1)} years
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for displaying skill hierarchies as a tree
interface SkillHierarchyTreeProps {
  categories: SkillStats[];
}

export const SkillHierarchyTree: React.FC<SkillHierarchyTreeProps> = ({
  categories,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }
  return (
    <div className="bg-accent p-4 rounded-lg shadow border border-border">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Skill Hierarchies
      </h3>

      <div className="space-y-2">
        {categories.map((hierarchy) => (
          <HierarchyNode
            key={hierarchy.skill.name}
            node={hierarchy}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
};

interface HierarchyNodeProps {
  node: SkillStats;
  depth: number;
}

const HierarchyNode: React.FC<HierarchyNodeProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = React.useState(depth < 2);

  const hasChildren = node.children.size > 0;

  // We're assuming that if it has keywords, it's a category
  const isCategory = hasChildren;

  return (
    <div className={`ml-${depth * 5}`}>
      <div
        className={`flex items-center p-1 ${
          hasChildren ? "cursor-pointer hover:bg-background rounded" : ""
        } ${isCategory ? "font-semibold" : ""}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span
            className="mr-1 inline-block w-4 text-muted transition-transform"
            style={{ transform: expanded ? "rotate(90deg)" : "none" }}
          >
            {expanded ? "▼" : "►"}
          </span>
        )}
        <span
          className={`${isCategory ? "text-accent-blue" : "text-secondary"}`}
        >
          {node.skill.name}
        </span>
        <span className="ml-2 text-xs text-muted">
          {(node.months / 12).toFixed(1)} yrs
        </span>
      </div>

      {expanded && hasChildren && (
        <div className="pl-5 border-l border-border ml-2">
          {node.children.fluent().map((child) => (
            <HierarchyNode
              key={child.skill.name}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component for displaying keyword connections
interface KeywordConnectionsProps {
  tree: SkillTree;
}

export const KeywordConnections: React.FC<KeywordConnectionsProps> = ({
  tree,
}) => {
  // Find skills that appear as keywords in multiple parent skills
  const parents = useMemo(
    () =>
      tree
        .fluentValues()
        .filter((skill) => skill.isCategory && skill.children.size > 1),
    [tree]
  );

  const sharedKeywords = parents
    .map((parent) => ({
      parent,
      others: parents
        .map((other) =>
          other.name !== parent.name
            ? other.children
                .fluent()
                .filter((child) => parent.children.has(child))
                .toArray()
            : []
        )
        .toArray()
        .flat(1),
    }))
    .filter((parent) => parent.others.length > 0)
    .toArray()
    .sort((a, b) => b.others.length - a.others.length);

  if (sharedKeywords.length === 0) {
    return null;
  }

  return (
    <div className="bg-accent p-4 rounded-lg shadow border border-border">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Shared Keywords
      </h3>

      <div className="space-y-3">
        {sharedKeywords.map(({ parent, others }) => (
          <div
            key={parent.name}
            className="border-b border-border pb-2 last:border-0"
          >
            <div className="font-medium text-accent-blue">{parent.name}</div>
            <div className="text-sm text-secondary">
              <span>Used in: </span>
              {others.map((other, idx) => (
                <React.Fragment key={other}>
                  <span className="font-medium">{other}</span>
                  {idx < others.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
