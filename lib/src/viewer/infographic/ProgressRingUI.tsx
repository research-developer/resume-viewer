import { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type ProgressRingCardProps = {
  label: string; // What this ring represents (e.g. "Storage Used")
  value: number; // Progress value (e.g. 66)
  total?: number; // Optional total for dynamic ring fill (defaults to 100)
  color?: string; // Optional accent color (default: --color-accent-blue)
};

/**
 * ProgressRingCardUI renders a circular progress indicator.
 *
 * - `value` is the current progress (e.g. 66 out of 100)
 * - `label` describes the metric (e.g. "Goal Completion")
 * - Optional `color` for the ring (from theme or custom)
 */
export const ProgressRingCardUI: FC<ProgressRingCardProps> = ({
  label,
  value,
  total = 100,
  color = "var(--color-accent-blue)",
}) => {
  const percentage = Math.min((value / total) * 100, 100);

  const data = [
    { name: "Progress", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <div className="w-full h-52 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell key="progress" fill={color} />
            <Cell key="background" fill="var(--color-border)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-[var(--color-primary)]">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};
