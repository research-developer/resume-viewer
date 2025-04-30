import { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CardUI } from "./CardUI";

type ScoreRing = {
  label: string;
  value: number; // Score out of 100
  color?: string; // Optional ring color
};

type ScoreRingGroupProps = {
  scores: ScoreRing[];
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
  return (
    <CardUI title="System Health Scores">
      <div className="flex flex-wrap justify-center gap-6">
        {scores.map((score, i) => {
          const percentage = Math.min(score.value, 100);
          const data = [
            { name: "Value", value: percentage },
            { name: "Remaining", value: 100 - percentage },
          ];
          const ringColor = score.color ?? "var(--color-accent-blue)";

          return (
            <div key={i} className="w-24 h-24 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={38}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    <Cell key="filled" fill={ringColor} />
                    <Cell key="background" fill="var(--color-border)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-primary)] text-sm font-semibold">
                <span>{percentage}%</span>
                <span className="text-[var(--color-muted)] text-xs mt-1 text-center">
                  {score.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </CardUI>
  );
};
