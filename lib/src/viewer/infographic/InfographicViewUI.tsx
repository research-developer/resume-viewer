import { FC, useMemo } from "react";
import { CardUI } from "./common/CardUI";
import { LineChartDataPoint, LineChartUI } from "./common/LineChartUI";
import { useViewerContext } from "../ViewerHook";
import { ProfileUI } from "./ProfileUI";
import { PieChartCardUI } from "./common/PieChartUI";
import { KPIStatUI } from "./common/KPIStatUI";
import { ProgressRingUI } from "./common/ProgressRingUI";
import { BarChartUI } from "./common/BarChartUI";
import { ScoreRingGroupUI } from "./common/ScoreRingGroupUI";
import { MetricListUI } from "./common/MetricListUI";
import { TrendComparisonUI } from "./common/TrendComparisonUI";
import { GroupedStatsUI } from "./common/GroupedStatsUI";
import { RadarChartUI } from "./common/RadarChartUI"; // Add this import
import { useChartColors } from "../../ColorUtils";

type InfographicViewUIProps = {};

export const InfographicViewUI: FC<
  InfographicViewUIProps
> = ({}: InfographicViewUIProps) => {
  const [state, dispatch] = useViewerContext();
  const { resume: viewerData } = state;
  const { data: resumeData, isPending: resumeIsPending } = viewerData || {};
  const { resume, stats } = resumeData || {
    resume: null,
    stats: null,
  };

  const categories = useMemo(
    () =>
      stats?.career.root.children
        .fluent()
        .toArray()
        .sort((a, b) => b.months - a.months) || [],
    [stats]
  );

  // Use the color utility hook
  const chartColors = useChartColors(categories.length);

  // Create radar chart data
  const radarData = useMemo(
    () =>
      categories.map((category) => ({
        subject: category.skill.name,
        value: convertMonthsToYears(category.months),
      })),
    [categories]
  );

  // Create skills by year data for the line chart
  const skillsByYearData = useMemo(() => {
    if (!stats?.yearCummulative) return [];

    // Get available years and sort them
    const years = Array.from(stats.yearCummulative.keys()).sort();

    const lineData: LineChartDataPoint[] = years.map((year) => {
      return stats.yearCummulative
        .get(year)
        ?.fluentValues()
        .reduce(
          (acc, topLevel) => {
            const category = topLevel.skill.name;
            const years = convertMonthsToYears(topLevel.months);
            (acc as unknown as any)[category] = years;
            return acc;
          },
          { name: year.toString() }
        ) as LineChartDataPoint;
    });

    return lineData;
  }, [stats?.yearCummulative]);

  // Create series configuration for the line chart
  const skillsLineSeries = useMemo(() => {
    return categories.map((category, index) => ({
      key: category.skill.name,
      label: category.skill.name,
      color: chartColors[index % chartColors.length],
    }));
  }, [categories, chartColors]);

  if (resumeIsPending) {
    return (
      <div className="p-4 text-center text-secondary">Loading resume...</div>
    );
  }

  if (!resumeData || !resume) {
    return (
      <div className="p-4 text-center text-gray-500">No resume data found.</div>
    );
  }

  const totalYears = convertMonthsToYears(stats.career.root.months || 0);

  return (
    <div className="flex flex-grid flex-wrap gap-4 p-6 max-w-7xl mx-auto">
      <CardUI size="max-w-md" title="Profile">
        <ProfileUI resume={resume} />
      </CardUI>
      <CardUI title="Years of Experience" size="flex-none">
        <KPIStatUI value={formatYears(totalYears)} />
      </CardUI>
      <CardUI title="Skills Radar">
        <RadarChartUI
          data={radarData}
          series={[
            {
              key: "value",
              label: "Experience (years)",
              color: chartColors[0],
            },
          ]}
        />
      </CardUI>
      <CardUI title="Skills" size="flex-auto">
        <ScoreRingGroupUI
          scores={categories.map((c) => ({
            label: c.skill.name,
            value: convertMonthsToYears(c.months),
            total: totalYears,
            size: 100,
            displayLabel: formatYears(convertMonthsToYears(c.months)),
          }))}
        />
      </CardUI>
      <CardUI title="Skills">
        <div className="flex flex-col items-center gap-2 w-full">
          {categories.map((skill) => (
            <div
              key={skill.skill.name}
              className="flex items-center justify-between w-full bg-surface border border-border rounded-card shadow-card gap-2 p-2"
            >
              <div className="text-secondary">{skill.skill.name}</div>
              <div className="text-primary font-bold">
                {formatYears(convertMonthsToYears(skill.months))}
              </div>
            </div>
          ))}
        </div>
      </CardUI>
      <CardUI title="Skills Growth Over Time">
        <LineChartUI data={skillsByYearData} series={skillsLineSeries} />
      </CardUI>
      <CardUI title="Category Distribution">
        <PieChartCardUI
          data={categories.map((c) => ({
            name: c.skill.name,
            value: convertMonthsToYears(c.months),
          }))}
          colors={chartColors}
        />
      </CardUI>
      {categories.slice(0, 1).map((skill) => (
        <CardUI key={skill.skill.name} title={skill.skill.name}>
          <ProgressRingUI
            label={skill.skill.name}
            value={convertMonthsToYears(skill.months)}
            total={totalYears}
            displayLabel={formatYears(convertMonthsToYears(skill.months))}
            size={200}
          />
        </CardUI>
      ))}
      <CardUI title="Skills">
        <BarChartUI
          title="Skills"
          data={categories.map((c) => ({
            name: c.skill.name,
            value: convertMonthsToYears(c.months),
          }))}
          color="blue"
        />
      </CardUI>
      <CardUI title="Skills">
        <MetricListUI
          items={categories.map((c) => ({
            label: c.skill.name,
            value: convertMonthsToYears(c.months),
          }))}
        />
      </CardUI>
      <CardUI title="Skills Over Time" size="min-w-200">
        <TrendComparisonUI
          title="Skills Over Time"
          data={categories.map((c) => ({
            name: c.skill.name,
            [c.skill.name]: convertMonthsToYears(c.months),
          }))}
          series={categories.map((c, index) => ({
            key: c.skill.name,
            label: c.skill.name,
            color: chartColors[index % chartColors.length],
          }))}
        />
      </CardUI>
      <CardUI title="Skills">
        <GroupedStatsUI
          title="Skills"
          stats={categories.map((c) => ({
            label: c.skill.name,
            value: convertMonthsToYears(c.months),
          }))}
        />
      </CardUI>
    </div>
  );
};

function convertMonthsToYears(months: number): number {
  return rountToOneDecimalPlace(months / 12);
}

function formatYears(value: number): string {
  return `${value.toLocaleString()} yrs`;
}

function rountToOneDecimalPlace(value: number): number {
  return Math.round(value * 10) / 10; // Round the value to one decimal place
}
