import { FC, useMemo } from "react";
import { CardUI } from "./CardUI";
import { LineChartCard } from "./LineChartCard";
import { useViewerContext, ViewerView } from "../ViewerHook";
import ProfileCardUI from "./ProfileCard";
import { PieChartCard } from "./PieChartCard";
import { KPIStatCardUI } from "./KPIStatCardUI";
import { ProgressRingCardUI } from "./ProgressRingCardUI";
import { BarChartCardUI } from "./BarChartCardUI";
import { ScoreRingGroupUI } from "./ScoreRingGroupUI";
import { MetricListCardUI } from "./MetricListCardUI";
import { TrendComparisonCardUI } from "./TrendComparisonCardUI";
import { GroupedStatsCardUI } from "./GroupedStatsCardUI";
import { getAccentColors, useChartColors } from "../../ColorUtils";

type InfographicUIProps = {};

export const InfographicUI: FC<
  InfographicUIProps
> = ({}: InfographicUIProps) => {
  const { state, dispatch } = useViewerContext();
  const { data: viewerData } = state;
  const { data: resumeData, isPending: resumeIsPending } = viewerData || {
    isPending: true,
    data: null,
  };
  const { resume, stats } = resumeData || {
    resume: null,
    stats: null,
  };

  const categories = useMemo(
    () =>
      stats?.skills.all.topLevel
        .fluentValues()
        .filter((skill) => skill.skill.isCategory)
        .toArray()
        .sort((a, b) => b.summary.months - a.summary.months) || [],
    [stats]
  );

  // Use the color utility hook
  const chartColors = useChartColors(categories.length);

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

  const totalYears = convertMonthsToYears(stats.skills.summary.months || 0);

  return (
    <div className="fill-screen mx-auto max-w-7xl bg-background flex flex-wrap flex-row gap-4 justify-start items-start">
      <ProfileCardUI
        resume={resume}
        buttons={[
          {
            label: "Text",
            onClick: () =>
              dispatch({ type: "SET_VIEW", view: ViewerView.Text }),
          },
          {
            label: "Json",
            onClick: () =>
              dispatch({ type: "SET_VIEW", view: ViewerView.Json }),
          },
        ]}
      />
      <CardUI title="Skills">
        <div className="flex flex-col items-center gap-2 w-full">
          {categories.map((skill) => (
            <div
              key={skill.skill.name}
              className="flex items-center justify-between w-full bg-surface border border-border rounded-card shadow-card gap-2 p-2"
            >
              <div className="text-secondary">{skill.skill.name}</div>
              <div className="text-primary font-bold">
                {formatYears(convertMonthsToYears(skill.summary.months))}
              </div>
            </div>
          ))}
        </div>
      </CardUI>
      <LineChartCard />
      <PieChartCard
        data={categories.map((c) => ({
          name: c.skill.name,
          value: convertMonthsToYears(c.summary.months),
        }))}
        colors={chartColors}
      />
      <KPIStatCardUI
        label="Years of Experience"
        value={formatYears(totalYears)}
      />
      {categories.slice(0, 1).map((skill) => (
        <ProgressRingCardUI
          key={skill.skill.name}
          label={skill.skill.name}
          value={convertMonthsToYears(skill.summary.months)}
          total={totalYears}
        />
      ))}
      <BarChartCardUI
        title="Skills"
        data={categories.map((c) => ({
          name: c.skill.name,
          value: convertMonthsToYears(c.summary.months),
        }))}
        color="blue"
      />
      <ScoreRingGroupUI
        scores={categories.map((c, index) => ({
          label: c.skill.name,
          value: Math.min(
            100,
            Math.round(
              (convertMonthsToYears(c.summary.months) / totalYears) * 100
            )
          ),
          color: chartColors[index % chartColors.length],
        }))}
      />
      <MetricListCardUI
        title="Skills"
        items={categories.map((c) => ({
          label: c.skill.name,
          value: convertMonthsToYears(c.summary.months),
        }))}
      />
      <TrendComparisonCardUI
        title="Skills Over Time"
        series={categories.map((c, index) => ({
          key: c.skill.name,
          label: c.skill.name,
          color: chartColors[index % chartColors.length],
        }))}
        data={categories.map((c) => ({
          name: c.skill.name,
          [c.skill.name]: convertMonthsToYears(c.summary.months),
        }))}
      />
      <GroupedStatsCardUI
        title="Skills"
        stats={categories.map((c) => ({
          label: c.skill.name,
          value: convertMonthsToYears(c.summary.months),
        }))}
      />
    </div>
  );
};

function convertMonthsToYears(months: number): number {
  return Math.floor(months / 12);
}

function formatYears(value: number): string {
  return `${value.toLocaleString()} yrs`;
}
