import React, { useState } from "react";
import { SkillStats } from "../../analyzer/SkillAnalyzer";

const MaxChildren = 10;
const MaxSkills = 10;

interface SkillCategoriesChartUIProps {
  skills: SkillStats[];
}

export const SkillCategoriesChartUI: React.FC<SkillCategoriesChartUIProps> = ({
  skills,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleSkills = expanded ? skills : skills.slice(0, MaxSkills);

  return (
    <div className="bg-accent p-6 rounded-xl shadow-lg border border-border">
      <h3 className="text-xl font-semibold text-primary mb-6">
        Skill Categories
      </h3>

      <div className="space-y-4">
        {visibleSkills.map((skill) => {
          const [childrenExpanded, setChildrenExpanded] = useState(false);
          const childrenArray = Array.from(
            skill.skill.children?.entries() || []
          );
          const visibleChildren = childrenExpanded
            ? childrenArray
            : childrenArray.slice(0, MaxChildren);

          return (
            <div key={skill.skill.name} className="flex flex-col">
              <div className="mb-2">
                <span className="text-base font-medium text-secondary">
                  {skill.skill.name}
                </span>
              </div>
              {childrenArray.length > 0 && (
                <div className="ml-4 text-sm text-muted">
                  Includes:{" "}
                  {visibleChildren.map(([key, value], index) => (
                    <span key={key}>
                      {value}
                      {index < visibleChildren.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {childrenArray.length > MaxChildren && (
                    <>
                      {childrenExpanded ? " " : ", and "}
                      <button
                        className="text-accent-blue underline hover:text-accent-blue-dark transition-colors"
                        onClick={() => setChildrenExpanded(!childrenExpanded)}
                      >
                        {childrenExpanded
                          ? "show less"
                          : `${
                              childrenArray.length - visibleChildren.length
                            } more`}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {skills.length > MaxSkills && (
        <button
          className="mt-6 text-sm text-accent-blue underline hover:text-accent-blue-dark transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
