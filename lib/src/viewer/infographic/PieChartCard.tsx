import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { FC } from "react";
import { CardUI } from "./CardUI";
import { getAccentColors, useChartColors } from "../../ColorUtils";

// Define type for pie chart data items
export type PieChartDataItem = {
  name: string;
  value: number;
};

// Define props interface
interface PieChartCardProps {
  data: PieChartDataItem[];
  colors?: string[];
  title?: string;
}

/**
 * PieChartCard renders a donut-style chart with vibrant segments and hover tooltips.
 * Designed for categorical data like usage shares, resource allocation, etc.
 */
export const PieChartCard: FC<PieChartCardProps> = ({
  data,
  colors,
  title = "Category Distribution",
}) => {
  // Use provided colors or get from utility
  const chartColors = colors || useChartColors(data.length);
  return (
    <CardUI title={title}>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
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
      </div>
    </CardUI>
  );
};

// Example usage:
// <PieChartCard
//   data={[
//     { name: "Category A", value: 400 },
//     { name: "Category B", value: 300 },
//   ]}
//   title="Custom Title"
// />
