import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SkillStatsSummaryTreeNode } from "../../ResumeSkillStatsModel";

interface SkillRadarChartUIProps {
  skills: SkillStatsSummaryTreeNode[];
}

export const SkillRadarChartUI: React.FC<SkillRadarChartUIProps> = ({
  skills,
}) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-gray-500 py-4 text-center">
        No skill data available for radar chart
      </div>
    );
  }

  // Transform the skills data for the radar chart
  const formattedData = skills.map((skill) => ({
    subject: skill.skill.name,
    value: skill.summary.months / 12, // Convert months to years
    fullMark: Math.ceil(Math.max(...skills.map((s) => s.summary.months / 12))),
  }));

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Skill Experience Radar
      </h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
            <PolarGrid gridType="circle" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#4B5563", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, "auto"]}
              tick={{ fill: "#4B5563" }}
            />
            <Radar
              name="Years of Experience"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toFixed(1)} years`,
                "Experience",
              ]}
              contentStyle={{ backgroundColor: "white", borderRadius: "4px" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-sm text-gray-600 text-center">
        Visualizes relative experience levels across different skills
      </div>
    </div>
  );
};
