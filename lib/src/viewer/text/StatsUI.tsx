import { FC, useMemo } from "react";
import { SkillRadarChartUI } from "./SkillRadarChartUI";
import { ResumeAnalyzer } from "../../analyzer/ResumeAnalyzer";
import { SkillCategoriesChartUI } from "./SkillCategoriesChartUI";
import { TopSkillsChartUI } from "./TopSkillsChartUI";
import { SkillHierarchyTreeUI } from "./SkillHierarchyTreeUI";
import { convertMonthsToYears } from "@viewer/infographic/DisplayUtil";

interface StatsUIProps {
  analyzer: ResumeAnalyzer | null;
}

export const ResumeStatsUI: FC<StatsUIProps> = ({ analyzer }) => {
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
    const topSkills = analyzer.skillStats.career
      .all()
      .filter((skill) => !skill.skill.isCategory)
      .filter((skill) => skill.months > 0)
      .sortBy((skill) => skill.months, true)
      .take(10)
      .toArray();
    const careerMonths = analyzer.keyStats.stats.careerDuration;
    const careerYears = convertMonthsToYears(careerMonths);
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
    <div className="flex flex-col max-w-full gap-4 p-4">
      <h2 className="text-2xl font-bold text-primary">Resume Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-accent rounded-lg shadow border border-border">
          <h3 className="text-lg font-semibold text-primary">
            Work Experience
          </h3>
          <div className="text-2xl font-bold text-accent-blue">
            {careerYears.toFixed(1)} years
            <div className="text-sm font-normal text-muted">
              ({careerMonths.toFixed(0)} months)
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent rounded-lg shadow border border-border">
          <h3 className="text-lg font-semibold text-primary">Skills</h3>
          <div className="text-2xl font-bold text-accent-blue">
            {analyzer.skillStats.tree.size}
            <div className="text-sm font-normal text-muted">
              ({categorySkills.length} categories)
            </div>
          </div>
        </div>
      </div>

      {topCategorySkills.length > 0 && (
        <SkillCategoriesChartUI skills={topCategorySkills} />
      )}

      {categorySkills.length > 0 && (
        <SkillRadarChartUI skills={categorySkills} />
      )}
      <TopSkillsChartUI skills={topSkills} />
      <SkillHierarchyTreeUI categories={categorySkills} />
    </div>
  );
};
