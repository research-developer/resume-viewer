import { FC } from "react";
import { ProgressRingUI, ProgressRingProps } from "./ProgressRingUI";
import { useChartColors } from "../../ColorUtils";

type ScoreRingGroupProps = {
  scores: ProgressRingProps[];
};

/**
 * ScoreRingGroupUI renders a horizontal group of small circular score indicators.
 *
 * Each score ring shows a percentage and label inside a donut-style chart.
 *
 * - `scores` is an array of score values and labels
 * - `color` is optional and defaults to accent-blue
 */
export const ScoreRingGroupUI: FC<ScoreRingGroupProps> = ({ scores }) => {
  const colors = useChartColors(scores.length);
  return (
    <div className="flex-auto grid grid-cols-3 gap-4">
      {scores.map((score, i) => {
        const ringColor = colors[i];
        return (
          <ProgressRingUI
            key={i}
            labelColor="gray"
            valueColor="white"
            progressColor={ringColor}
            {...score}
          />
        );
      })}
    </div>
  );
};
