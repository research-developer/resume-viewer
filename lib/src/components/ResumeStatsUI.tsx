import React from "react";
import { ResumeStats } from "../ResumeStatsHook";
import { SkillStats, KeywordHierarchy } from "../ResumeSkillStatsModel";

interface ResumeStatsUIProps {
  stats: ResumeStats | null;
}

export const ResumeStatsUI: React.FC<ResumeStatsUIProps> = ({ stats }) => {
  if (!stats?.skills) {
    return (
      <div className="text-gray-500 py-4 text-center">
        No statistics available
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800">Resume Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Work Experience
          </h3>
          <div className="text-2xl font-bold text-blue-600">
            {(stats.skills.totalWorkMonths / 12).toFixed(1)} years
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({stats.skills.totalWorkMonths} months)
            </span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Skills Count</h3>
          <div className="text-2xl font-bold text-blue-600">
            {stats.skills.all.length}
          </div>
        </div>
      </div>

      <TopSkillsChart skills={stats.skills.top} />
      <SkillHierarchyTree hierarchies={stats.skills.hierarchies} />
      <KeywordConnections
        skills={stats.skills.all}
        byKeyword={stats.skills.byKeyword}
      />
    </div>
  );
};

// Component for displaying top skills as a bar chart
interface TopSkillsChartProps {
  skills: SkillStats[];
}

export const TopSkillsChart: React.FC<TopSkillsChartProps> = ({ skills }) => {
  const maxMonths = Math.max(...skills.map((s) => s.totalMonths));

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Top Skills by Experience
      </h3>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center">
            <div className="w-1/4 font-medium text-gray-700">{skill.name}</div>
            <div className="w-3/4 flex items-center">
              <div
                className="h-5 bg-blue-500 rounded-md"
                style={{ width: `${(skill.totalMonths / maxMonths) * 100}%` }}
              />
              <div className="ml-2 text-sm text-gray-600">
                {(skill.totalMonths / 12).toFixed(1)} years
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
  hierarchies: KeywordHierarchy[];
}

export const SkillHierarchyTree: React.FC<SkillHierarchyTreeProps> = ({
  hierarchies,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Skill Hierarchies
      </h3>

      <div className="space-y-2">
        {hierarchies.map((hierarchy) => (
          <HierarchyNode key={hierarchy.skill} node={hierarchy} depth={0} />
        ))}
      </div>
    </div>
  );
};

interface HierarchyNodeProps {
  node: KeywordHierarchy;
  depth: number;
}

const HierarchyNode: React.FC<HierarchyNodeProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = React.useState(depth < 2);

  const hasChildren = node.keywords.length > 0;

  return (
    <div className={`ml-${depth * 5}`}>
      <div
        className={`flex items-center p-1 ${
          hasChildren ? "cursor-pointer hover:bg-gray-200 rounded" : ""
        }`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span
            className="mr-1 inline-block w-4 text-gray-500 transition-transform"
            style={{ transform: expanded ? "rotate(90deg)" : "none" }}
          >
            {expanded ? "▼" : "►"}
          </span>
        )}
        <span className="font-medium text-gray-800">{node.skill}</span>
        <span className="ml-2 text-xs text-gray-600">
          {(node.totalMonths / 12).toFixed(1)} yrs
        </span>
      </div>

      {expanded && hasChildren && (
        <div className="pl-5 border-l border-gray-200 ml-2">
          {node.keywords.map((child) => (
            <HierarchyNode key={child.skill} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// Component for displaying keyword connections
interface KeywordConnectionsProps {
  skills: SkillStats[];
  byKeyword: Map<string, string[]>;
}

export const KeywordConnections: React.FC<KeywordConnectionsProps> = ({
  byKeyword,
}) => {
  // Find skills that appear as keywords in multiple parent skills
  const sharedKeywords = Array.from(byKeyword.entries())
    .filter(([_, parents]) => parents.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  if (sharedKeywords.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Shared Keywords
      </h3>

      <div className="space-y-3">
        {sharedKeywords.map(([keyword, parents]) => (
          <div
            key={keyword}
            className="border-b border-gray-200 pb-2 last:border-0"
          >
            <div className="font-medium text-blue-600">{keyword}</div>
            <div className="text-sm text-gray-700">
              <span>Used in: </span>
              {parents.map((parent, idx) => (
                <React.Fragment key={parent}>
                  <span className="font-medium">{parent}</span>
                  {idx < parents.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
