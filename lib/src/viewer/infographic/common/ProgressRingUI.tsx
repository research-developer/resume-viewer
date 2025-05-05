import { FC, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AccentColor, getAccentColor } from "../../../ColorUtils";

export type ProgressRingProps = {
  label: string; // What this ring represents (e.g. "Storage Used")
  value: number; // Progress value (e.g. 66)
  total?: number; // Optional total for dynamic ring fill (defaults to 100)
  valueColor?: AccentColor; // Optional accent color (default: --color-accent-blue)
  progressColor?: AccentColor; // Optional accent color for the progress (default: --color-accent-blue)
  labelColor?: AccentColor; // Optional stroke color (default: --color-accent-blue)
  displayLabel?: string; // Whether to display the label in the center
  size?: number; // Optional size for the ring (default: 100)
};

/**
 * ProgressRingCardUI renders a circular progress indicator.
 *
 * - `value` is the current progress (e.g. 66 out of 100)
 * - `label` describes the metric (e.g. "Goal Completion")
 * - Optional `color` for the ring (from theme or custom)
 */
export const ProgressRingUI: FC<ProgressRingProps> = ({
  label,
  value,
  displayLabel,
  total = 100,
  labelColor = "white",
  progressColor = "blue",
  valueColor = "blue",
  size = 100,
}) => {
  const percentage = Math.min((value / total) * 100, 100);

  const data = [
    { name: "Progress", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  // Custom label renderer that adapts to content size
  const renderCustomizedLabel = useCallback(
    ({
      cx,
      cy,
      innerRadius,
    }: {
      cx: number;
      cy: number;
      innerRadius: number;
    }) => {
      if (!displayLabel) return null;

      // Calculate font size based on inner radius and label length
      const fontSize = Math.min(
        innerRadius * 0.45, // Maximum size based on radius
        innerRadius * (15 / Math.max(displayLabel.length, 1)) // Adjust by text length
      );

      return (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
            fill: getAccentColor(valueColor),
          }}
        >
          {displayLabel}
        </text>
      );
    },
    [valueColor, displayLabel]
  );

  // Calculate dynamic radii based on component size
  const baseRadius = size * 0.35; // Base inner radius
  const innerRadius = baseRadius;
  const thickness = Math.max(10, baseRadius * 0.4); // Make thickness proportional but with a minimum
  const outerRadius = innerRadius + thickness;

  // Calculate container dimensions with appropriate padding
  const containerSize = size;

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: containerSize, height: containerSize }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              <Cell
                key="progress"
                fill={getAccentColor(progressColor)}
                strokeWidth={0}
              />
              <Cell
                key="background"
                fill="var(--color-border)"
                strokeWidth={0}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {label && (
        <div
          className="mt-2 text-center text-secondary"
          style={{
            fontSize: `${Math.max(12, size * 0.15)}px`,
            color: getAccentColor(labelColor || "blue"),
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
