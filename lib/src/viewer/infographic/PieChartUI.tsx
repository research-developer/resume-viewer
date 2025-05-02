import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FC } from "react";
import { getAccentColors, useChartColors } from "../../ColorUtils";

// Define type for pie chart data items
export type PieChartDataItem = {
  name: string;
  value: number;
};

// Define props interface
interface PieChartCardUIProps {
  data: PieChartDataItem[];
  colors?: string[];
}

/**
 * PieChartCardUI renders a donut-style chart with vibrant segments and hover tooltips.
 * Designed for categorical data like usage shares, resource allocation, etc.
 */
export const PieChartCardUI: FC<PieChartCardUIProps> = ({ data, colors }) => {
  const chartColors = colors || useChartColors(data.length);
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={250}
      minHeight={250}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={40}
          paddingAngle={4}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};
