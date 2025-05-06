import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ResumeSkill } from "../../ResumeModel";

interface WorkSkillsUIProps {
  skills?: ResumeSkill[];
}

export const WorkSkillsUI: React.FC<WorkSkillsUIProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center">
        <CheckCircleIcon className="w-4 h-4 mr-1 text-accent-green" />
        Skills
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-accent text-secondary rounded-full px-3 py-1 text-sm font-medium transition-transform hover:scale-105"
          >
            {skill.name}
            {skill.level && (
              <span className="text-xs ml-1 opacity-75">• {skill.level}</span>
            )}
            {skill.keywords && skill.keywords.length > 0 && (
              <div className="text-xs mt-1 opacity-75">
                {skill.keywords.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
