import React, { useMemo } from "react";
import { SkillStats } from "../../analyzer/SkillAnalyzer";
import { convertMonthsToYears } from "../infographic/DisplayUtil";

interface TopSkillsChartUIProps {
  skills: SkillStats[];
}

export const TopSkillsChartUI: React.FC<TopSkillsChartUIProps> = ({
  skills,
}) => {
  const maxMonths = useMemo(
    () => Math.max(...skills.map((s) => s.months)),
    [skills]
  );

  return (
    <div className="bg-accent p-4 rounded-lg shadow border border-border">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Top Skills by Experience
      </h3>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.skill.name}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"
          >
            <div className="flex-auto font-medium text-secondary">
              {skill.skill.name}
            </div>
            <div className="flex-none flex items-center">
              <div className="ml-0 sm:ml-2 text-sm text-muted">
                {convertMonthsToYears(skill.months).toFixed(1)} years
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
