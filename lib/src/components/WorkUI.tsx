import React from "react";
import { ResumeWork } from "../ResumeModel";
import { DateRangeUI } from "./DateRangeUI";

interface WorkUIProps {
  work: ResumeWork;
}

export const WorkUI: React.FC<WorkUIProps> = ({ work }) => {
  return (
    <div className="mb-6 pb-5 border-b border-gray-200 last:border-0">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{work.position}</h3>
        <div className="text-base font-medium text-gray-700">
          {work.url ? (
            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              {work.name}
            </a>
          ) : (
            work.name
          )}
        </div>
      </div>

      <div className="mb-2">
        <DateRangeUI startDate={work.startDate} endDate={work.endDate} />
      </div>

      {work.location && (
        <div className="text-sm text-gray-600 mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {[
            work.location.address,
            work.location.city,
            work.location.region,
            work.location.countryCode,
            work.location.postalCode,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      )}

      {work.summary && <p className="mb-4 text-gray-700">{work.summary}</p>}

      {work.highlights && work.highlights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Highlights
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {work.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}

      {work.skills && work.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
          <ul className="space-y-1">
            {work.skills.map((skill, index) => (
              <li key={index} className="flex flex-wrap items-center gap-1">
                <span className="font-medium text-gray-800">{skill.name}</span>
                {skill.level && (
                  <span className="text-xs text-gray-500">- {skill.level}</span>
                )}
                {skill.keywords && skill.keywords.length > 0 && (
                  <span className="text-xs text-gray-600">
                    ({skill.keywords.join(", ")})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {work.references && work.references.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            References
          </h4>
          <div className="space-y-3">
            {work.references.map((reference, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="font-medium text-gray-800">
                  {reference.name}
                </div>
                {reference.reference && (
                  <div className="mt-1 italic text-gray-700">
                    "{reference.reference}"
                  </div>
                )}
                {reference.date && (
                  <div className="mt-1 text-xs text-gray-500">
                    {reference.date.toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface WorkListUIProps {
  workList: ResumeWork[];
}

export const WorkListUI: React.FC<WorkListUIProps> = ({ workList }) => {
  if (!workList || workList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
        Work Experience
      </h2>
      {workList.map((work, index) => (
        <WorkUI key={index} work={work} />
      ))}
    </section>
  );
};
