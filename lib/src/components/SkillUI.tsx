import React from "react";
import { ResumeSkill } from "../ResumeModel";

interface SkillUIProps {
  skill: ResumeSkill;
}

export const SkillUI: React.FC<SkillUIProps> = ({ skill }) => {
  return (
    <div className="skill-item">
      <div className="skill-name-level">
        <span className="skill-name">{skill.name}</span>
        {skill.level && <span className="skill-level"> ({skill.level})</span>}
      </div>

      {skill.keywords && skill.keywords.length > 0 && (
        <div className="skill-keywords">
          {skill.keywords.map((keyword, index) => (
            <span key={index} className="skill-keyword">
              {keyword}
              {index < skill.keywords!.length - 1 ? ", " : ""}
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
    <section className="resume-skills">
      <h2>Skills</h2>
      <div className="skills-container">
        {skillList.map((skill, index) => (
          <SkillUI key={index} skill={skill} />
        ))}
      </div>
    </section>
  );
};
