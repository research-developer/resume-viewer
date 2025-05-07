import React from "react";
import { ResumeWork } from "@schema/ResumeSchema";
import { DateRangeUI } from "./DateRangeUI";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

interface WorkHeaderUIProps {
  work: ResumeWork;
}

export const WorkHeaderUI: React.FC<WorkHeaderUIProps> = ({ work }) => {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-semibold text-accent-blue flex items-center gap-2">
        <BriefcaseIcon className="h-5" />
        <div>{work.position}</div>
      </h3>
      <div className="text-base font-medium text-secondary">
        {work.url ? (
          <a
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-accent-blue-light hover:underline"
          >
            {work.name}
          </a>
        ) : (
          work.name
        )}
      </div>
      <div>
        <DateRangeUI startDate={work.startDate} endDate={work.endDate} />
      </div>
    </div>
  );
};
