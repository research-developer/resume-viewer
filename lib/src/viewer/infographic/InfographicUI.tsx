import { FC } from "react";
import { CardUI } from "./CardUI";
import { LineChartCard } from "./LineChartCard";
import { useViewerContext, ViewerView } from "../ViewerHook";
import ProfileCardUI from "./ProfileCard";

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

  if (resumeIsPending) {
    return (
      <div className="p-4 text-center text-secondary">Loading resume...</div>
    );
  }

  if (!resumeData) {
    return (
      <div className="p-4 text-center text-gray-500">No resume data found.</div>
    );
  }

  const { resume, stats } = resumeData;

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
        <div className="flex flex-col items-center">
          {stats.skills.all.topLevel
            .fluentValues()
            .filter((skill) => skill.skill.isCategory)
            .toArray()
            .sort((a, b) => b.summary.months - a.summary.months)
            .slice(0, 5)
            .map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full max-w-md p-2 my-2 bg-surface border border-border rounded-card shadow-card"
              >
                <span className="text-secondary">{skill.skill.name}</span>
                <span className="text-accent">
                  {(skill.summary.months / 12).toLocaleString()} yrs.
                </span>
              </div>
            ))}
        </div>
      </CardUI>
      <LineChartCard></LineChartCard>
    </div>
  );
};
