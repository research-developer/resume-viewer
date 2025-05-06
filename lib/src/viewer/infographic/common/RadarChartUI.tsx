import { FC } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartColors } from "../../../ColorUtils";

type RadarDataPoint = {
  subject: string; // Axis label (e.g., "JavaScript", "Python", etc.)
  [seriesKey: string]: string | number; // Dynamic series values
};

type RadarChartUIProps = {
  data: RadarDataPoint[];
  series: Array<{
    key: string; // property in data to plot
    label: string; // label for legend
    color?: string; // optional color
  }>;
};

/**
 * RadarChartUI displays multivariate data as a spider/radar chart.
 *
 * Perfect for visualizing skill distributions, performance metrics across multiple dimensions,
 * or comparing different entities across common variables.
 *
 * - `data` is an array of points where each represents values across multiple dimensions
 * - `series` defines which data properties to plot and how to style them
 */
export const RadarChartUI: FC<RadarChartUIProps> = ({ data, series }) => {
  const colors = useChartColors(series.length);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={250}
      minHeight={250}
      className="flex-auto"
    >
      <RadarChart outerRadius={90} data={data}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey="subject" stroke="var(--color-secondary)" />
        <PolarRadiusAxis stroke="var(--color-border)" />

        {series.map((s, index) => (
          <Radar
            key={s.key}
            name={s.label}
            dataKey={s.key}
            stroke={s.color || colors[index % colors.length]}
            fill={s.color || colors[index % colors.length]}
            fillOpacity={0.3}
          />
        ))}

        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};
