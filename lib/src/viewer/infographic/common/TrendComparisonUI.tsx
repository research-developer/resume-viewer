import { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TrendDataPoint = {
  name: string; // X-axis label (e.g. "Week 1", "Jan", etc.)
  [seriesKey: string]: string | number;
};

type TrendComparisonUIProps = {
  title: string;
  data: TrendDataPoint[];
  series: Array<{
    key: string; // property in data to plot (e.g. "current", "previous")
    label: string; // label for legend
    color?: string; // optional line color
  }>;
};

/**
 * TrendComparisonCardUI renders overlapping line graphs for time-based comparisons.
 *
 * - `data` is an array of named data points (x-axis categories)
 * - `series` defines which keys to extract from the data and how to label/style them
 */
export const TrendComparisonUI: FC<TrendComparisonUIProps> = ({
  data,
  series,
}) => {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={data.length * 50}
    >
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="name" stroke="var(--color-secondary)" />
        <YAxis stroke="var(--color-secondary)" />
        <Tooltip />
        <Legend />
        {series.map(({ key, label, color = "var(--color-accent-cyan)" }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
