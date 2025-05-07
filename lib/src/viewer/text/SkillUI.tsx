import React from "react";
import { ResumeSkill } from "@schema/ResumeSchema";

interface SkillUIProps {
  skill: ResumeSkill;
}

export const SkillUI: React.FC<SkillUIProps> = ({ skill }) => {
  return (
    <div className="mb-3 p-3 bg-accent rounded-md">
      <div className="mb-1">
        <span className="font-medium text-primary">{skill.name}</span>
        {skill.level && (
          <span className="ml-2 text-sm text-muted">({skill.level})</span>
        )}
      </div>

      {skill.keywords && skill.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {skill.keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-accent-blue bg-opacity-20 text-accent-blue-light text-xs px-2 py-1 rounded-md"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

interface SkillListUIProps {
  skillList: ResumeSkill[];
}

export const SkillListUI: React.FC<SkillListUIProps> = ({ skillList }) => {
  if (!skillList || skillList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        Skills
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skillList.map((skill, index) => (
          <SkillUI key={index} skill={skill} />
        ))}
      </div>
    </section>
  );
};
