import React, { useState, useMemo } from "react";
import { SkillStats } from "../../analyzer/SkillAnalyzer";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface SkillHierarchyTreeUIProps {
  categories: SkillStats[];
}

export const SkillHierarchyTreeUI: React.FC<SkillHierarchyTreeUIProps> = ({
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

      <div className="space-y-3">
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

const MaxChildren = 5;

const HierarchyNode: React.FC<HierarchyNodeProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = React.useState(depth < 2);
  const [childrenExpanded, setChildrenExpanded] = useState(false);

  const hasChildren = node.children.size > 0;
  const isCategory = hasChildren;

  const childrenArray = useMemo(
    () =>
      node.children
        .fluent()
        .sortBy((child) => child.months, true)
        .toArray(),
    [node.children]
  );
  const visibleChildren = useMemo(
    () =>
      childrenExpanded ? childrenArray : childrenArray.slice(0, MaxChildren),
    [childrenExpanded, childrenArray]
  );

  return (
    <div className={`ml-${depth * 2}`}>
      <div
        className={`flex items-start sm:items-center gap-2 sm:gap-4 p-1 ${
          hasChildren ? "cursor-pointer hover:bg-background rounded" : ""
        } ${isCategory ? "font-semibold" : ""}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex-auto flex gap-2 items-center">
          {hasChildren && (
            <span className="inline-block w-4 text-muted">
              {expanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </span>
          )}
          <span
            className={`${isCategory ? "text-accent-blue" : "text-secondary"}`}
            style={{
              fontSize: `${1.2 - depth * 0.3}rem`,
            }}
          >
            {node.skill.name}
          </span>
        </div>
        <div className="flex-none text-sm text-muted">
          {(node.months / 12).toFixed(1)} years
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="ml-3 p-2 border-l border-border ml-2">
          {visibleChildren.map((child) => (
            <HierarchyNode
              key={child.skill.name}
              node={child}
              depth={depth + 1}
            />
          ))}
          {childrenArray.length > MaxChildren && (
            <button
              className="ml-3 text-sm text-accent-blue underline hover:text-accent-blue-dark transition-colors"
              onClick={() => setChildrenExpanded(!childrenExpanded)}
            >
              {childrenExpanded
                ? "Show Less"
                : `Show ${childrenArray.length - visibleChildren.length} More`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
