import React, { useMemo } from "react";
import { SkillTree } from "../../analyzer/SkillAnalyzer";

interface KeywordConnectionsUIProps {
  tree: SkillTree;
}

export const KeywordConnectionsUI: React.FC<KeywordConnectionsUIProps> = ({
  tree,
}) => {
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
