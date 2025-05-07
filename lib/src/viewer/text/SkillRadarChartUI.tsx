import React, { useMemo } from "react";
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
import { convertMonthsToYears } from "@viewer/infographic/DisplayUtil";

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
  const formattedData = useMemo(
    () =>
      skills.map((skill) => ({
        subject: skill.skill.name,
        value: convertMonthsToYears(skill.months),
        fullMark: Math.ceil(
          Math.max(...skills.map((s) => convertMonthsToYears(s.months)))
        ),
      })),
    [skills]
  );

  console.log("Formatted Data for Radar Chart:", formattedData);

  return (
    <div className="bg-accent p-4 rounded-lg shadow border border-border flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-primary">
        Skill Experience Radar
      </h3>
      <div className="flex-auto">
        <ResponsiveContainer width="100%" height="100%" aspect={1}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={formattedData}>
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
              label={false}
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
    </div>
  );
};
