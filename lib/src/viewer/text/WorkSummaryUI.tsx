import React from "react";

interface WorkSummaryUIProps {
  summary?: string;
}

export const WorkSummaryUI: React.FC<WorkSummaryUIProps> = ({ summary }) => {
  if (!summary) return null;

  return <p className="px-4 text-secondary">{summary}</p>;
};
