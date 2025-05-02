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
import { SkillStats } from "../../analyzer/SkillAnalyzer";

interface SkillRadarChartUIProps {
  skills: SkillStats[];
}

export const SkillRadarChartUI: React.FC<SkillRadarChartUIProps> = ({
  skills,
}) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-muted py-4 text-center">
        No skill data available for radar chart
      </div>
    );
  }

  // Transform the skills data for the radar chart
  const formattedData = skills.map((skill) => ({
    subject: skill.skill.name,
    value: skill.months / 12, // Convert months to years
    fullMark: Math.ceil(Math.max(...skills.map((s) => s.months / 12))),
  }));

  return (
    <div className="bg-accent p-4 rounded-lg shadow border border-border">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Skill Experience Radar
      </h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
            <PolarGrid stroke="#3c3c3c" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, "auto"]}
              tick={{ fill: "#cbd5e1" }}
              stroke="#3c3c3c"
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
              contentStyle={{
                backgroundColor: "#2b2b2b",
                borderRadius: "4px",
                borderColor: "#3c3c3c",
                color: "#cbd5e1",
              }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px", color: "#cbd5e1" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-sm text-muted text-center">
        Visualizes relative experience levels across different skills
      </div>
    </div>
  );
};
