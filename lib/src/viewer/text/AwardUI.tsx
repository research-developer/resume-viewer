import React from "react";
import { ResumeAward } from "@schema/ResumeSchema";
import DateUI from "./DateUI";

interface AwardUIProps {
  award: ResumeAward;
}

export const AwardUI: React.FC<AwardUIProps> = ({ award }) => {
  return (
    <div className="mb-4 pb-4 border-b border-gray-200 last:border-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2 text-accent-blue"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.362 5.214A5.214 5.214 0 1112 2a5.214 5.214 0 013.362 3.214zM12 22a10.5 10.5 0 01-7.5-3.5m15 0A10.5 10.5 0 0112 22m0-20v20"
            />
          </svg>
          {award.title}
        </h3>
        {award.awarder && (
          <div className="text-sm text-gray-600">by {award.awarder}</div>
        )}
      </div>

      {award.date && (
        <div className="text-sm text-gray-500 mt-1">
          <DateUI date={award.date} />
        </div>
      )}

      {award.summary && <p className="mt-2 text-gray-700">{award.summary}</p>}
    </div>
  );
};

interface AwardListUIProps {
  awardList: ResumeAward[];
}

export const AwardListUI: React.FC<AwardListUIProps> = ({ awardList }) => {
  if (!awardList || awardList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
        Awards
      </h2>
      {awardList.map((award, index) => (
        <AwardUI key={index} award={award} />
      ))}
    </section>
  );
};
