import { FC, useMemo } from "react";
import { CardUI } from "./CardUI";
import { LineChartUI } from "./LineChartUI";
import { useViewerContext, ViewerView } from "../ViewerHook";
import { ProfileUI } from "./ProfileUI";
import { PieChartCardUI } from "./PieChartUI";
import { KPIStatUI } from "./KPIStatUI";
import { ProgressRingCardUI } from "./ProgressRingUI";
import { BarChartUI } from "./BarChartUI";
import { ScoreRingGroupUI } from "./ScoreRingGroupUI";
import { MetricListUI } from "./MetricListUI";
import { TrendComparisonUI } from "./TrendComparisonUI";
import { GroupedStatsUI } from "./GroupedStatsUI";
import { useChartColors } from "../../ColorUtils";

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
    <div className="fill-screen bg-background flex flex-wrap flex-row gap-4 justify-start items-start">
      <CardUI className="max-w-md" title="Profile">
        <ProfileUI
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
                {formatYears(convertMonthsToYears(skill.summary.months))}
              </div>
            </div>
          ))}
        </div>
      </CardUI>
      <CardUI title="Line Chart Example">
        <LineChartUI />
      </CardUI>
      <CardUI title="Category Distribution">
        <PieChartCardUI
          data={categories.map((c) => ({
            name: c.skill.name,
            value: convertMonthsToYears(c.summary.months),
          }))}
          colors={chartColors}
        />
      </CardUI>
      <CardUI title="Years of Experience">
        <KPIStatUI value={formatYears(totalYears)} />
      </CardUI>
      {categories.slice(0, 1).map((skill) => (
        <CardUI key={skill.skill.name} title={skill.skill.name}>
          <ProgressRingCardUI
            label={skill.skill.name}
            value={convertMonthsToYears(skill.summary.months)}
            total={totalYears}
          />
        </CardUI>
      ))}
      <CardUI title="Skills">
        <BarChartUI
          title="Skills"
          data={categories.map((c) => ({
            name: c.skill.name,
            value: convertMonthsToYears(c.summary.months),
          }))}
          color="blue"
        />
      </CardUI>
      <CardUI title="System Health Scores">
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
      </CardUI>
      <CardUI title="Skills">
        <MetricListUI
          items={categories.map((c) => ({
            label: c.skill.name,
            value: convertMonthsToYears(c.summary.months),
          }))}
        />
      </CardUI>
      <CardUI title="Skills Over Time">
        <TrendComparisonUI
          title="Skills Over Time"
          data={categories.map((c) => ({
            name: c.skill.name,
            [c.skill.name]: convertMonthsToYears(c.summary.months),
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
            value: convertMonthsToYears(c.summary.months),
          }))}
        />
      </CardUI>
    </div>
  );
};

function convertMonthsToYears(months: number): number {
  return Math.floor(months / 12);
}

function formatYears(value: number): string {
  return `${value.toLocaleString()} yrs`;
}
