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
import { createChartGradient, getAccentColor } from "../../ColorUtils";

/**
 * LineChartCardUI displays a stacked area/line chart showing multivariate trends over time.
 * Visualized on the diagram with smooth gradients and overlayed lines — represents time series analytics.
 * Uses Recharts to render the data visualization.
 */
export const LineChartUI: FC = () => {
  const data = [
    { name: "Jan", uv: 400, pv: 240, amt: 240 },
    { name: "Feb", uv: 300, pv: 139, amt: 221 },
    { name: "Mar", uv: 200, pv: 980, amt: 229 },
    { name: "Apr", uv: 278, pv: 390, amt: 200 },
    { name: "May", uv: 189, pv: 480, amt: 218 },
    { name: "Jun", uv: 239, pv: 380, amt: 250 },
    { name: "Jul", uv: 349, pv: 430, amt: 210 },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={200}
      minWidth={200}
    >
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          {createChartGradient("colorUv", "purple")}
          {createChartGradient("colorPv", "cyan")}
        </defs>
        <XAxis dataKey="name" stroke="#cbd5e1" />
        <YAxis stroke="#cbd5e1" />
        <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3c" />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="uv"
          stroke={getAccentColor("purple")}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="pv"
          stroke={getAccentColor("cyan")}
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
