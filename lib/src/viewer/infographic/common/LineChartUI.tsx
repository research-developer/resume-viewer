import { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  createChartGradient,
  getAccentColor,
  useChartColors,
} from "../../../ColorUtils";

export type LineChartDataPoint = {
  name: string; // X-axis label (e.g., "Jan", "Feb", etc.)
  [seriesName: string]: string | number; // Dynamic series values
};

export type LineChartSeries = {
  key: string; // Key for the data point (e.g., "uv", "pv")
  label: string; // Label for the series (e.g., "UV Value", "PV Value")
  color?: string; // Optional color for the series
};

export type LineChartUIProps = {
  data?: LineChartDataPoint[];
  series?: Array<LineChartSeries>;
};

/**
 * LineChartCardUI displays a stacked area/line chart showing multivariate trends over time.
 * Visualized on the diagram with smooth gradients and overlayed lines — represents time series analytics.
 * Uses Recharts to render the data visualization.
 */
export const LineChartUI: FC<LineChartUIProps> = ({
  data = defaultData,
  series = defaultSeries,
}) => {
  const chartColors = useChartColors(series.length);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={350}
      minWidth={350}
    >
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          {series.map((s, index) => {
            const color = s.color || chartColors[index % chartColors.length];
            const colorName = color
              .replace("var(--color-accent-", "")
              .replace(")", "");
            return createChartGradient(`color${s.key}`, colorName);
          })}
        </defs>
        <XAxis dataKey="name" stroke="#cbd5e1" />
        <YAxis stroke="#cbd5e1" />
        <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3c" />
        <Tooltip />
        <Legend />
        {series.map((s, index) => {
          const color = s.color || chartColors[index % chartColors.length];
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={color}
              fillOpacity={1}
              fill={`url(#color${s.key})`}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Default data to use when none is provided
const defaultData = [
  { name: "Jan", uv: 400, pv: 240, amt: 240 },
  { name: "Feb", uv: 300, pv: 139, amt: 221 },
  { name: "Mar", uv: 200, pv: 980, amt: 229 },
  { name: "Apr", uv: 278, pv: 390, amt: 200 },
  { name: "May", uv: 189, pv: 480, amt: 218 },
  { name: "Jun", uv: 239, pv: 380, amt: 250 },
  { name: "Jul", uv: 349, pv: 430, amt: 210 },
];

// Default series configuration
const defaultSeries = [
  { key: "uv", label: "UV Value", color: getAccentColor("purple") },
  { key: "pv", label: "PV Value", color: getAccentColor("cyan") },
];
