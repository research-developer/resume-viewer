import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getAccentColor, AccentColor } from "../../ColorUtils";

type BarChartUIProps = {
  title: string; // Card title (e.g., "Team Output")
  data: Array<{ name: string; value: number }>;
  color?: string | AccentColor; // Optional bar color (default: 'purple')
};

/**
 * BarChartCardUI displays vertical bars for categorical data.
 *
 * - Each bar corresponds to an item in `data` (e.g. [{ name: 'Team A', value: 12 }])
 * - `title` describes the metric being visualized
 * - `color` is an optional accent for bar fill
 */
export const BarChartUI: FC<BarChartUIProps> = ({ data, color = "purple" }) => {
  // Handle both direct color strings and accent color names
  const barColor =
    typeof color === "string" && color.startsWith("var(")
      ? color
      : getAccentColor(color as AccentColor);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={data.length * 50}
      minHeight={data.length * 50}
    >
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="name" stroke="var(--color-secondary)" />
        <YAxis stroke="var(--color-secondary)" />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
