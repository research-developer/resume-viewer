import React from "react";
import { ResumeWork } from "../../ResumeModel";
import { DateRangeUI } from "./DateRangeUI";

interface WorkUIProps {
  work: ResumeWork;
}

export const WorkUI: React.FC<WorkUIProps> = ({ work }) => {
  return (
    <div className="mb-6 pb-5 border-b border-border last:border-0">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-primary">{work.position}</h3>
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
      </div>

      <div className="mb-2">
        <DateRangeUI startDate={work.startDate} endDate={work.endDate} />
      </div>

      {work.location && (
        <div className="text-sm text-muted mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-muted"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="inline-block hover:text-secondary transition-colors">
            {[
              work.location.address,
              work.location.city,
              work.location.region,
              work.location.countryCode,
              work.location.postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
      )}

      {work.summary && (
        <p className="mb-4 text-secondary bg-accent p-3 rounded-md border-l-4 border-accent-blue italic leading-relaxed">
          {work.summary}
        </p>
      )}

      {work.highlights && work.highlights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 text-accent-blue"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            Highlights
          </h4>
          <ul className="list-none pl-5 space-y-2 text-secondary">
            {work.highlights.map((highlight, index) => (
              <li
                key={index}
                className="flex items-start hover:bg-accent p-1 rounded transition-colors"
              >
                <span className="inline-block w-5 h-5 rounded-full bg-accent-blue bg-opacity-20 text-accent-blue font-bold text-xs flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {work.skills && work.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 text-accent-green"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {work.skills.map((skill, index) => {
              // Determine color based on skill level
              let bgColor = "bg-accent";
              let textColor = "text-secondary";
              if (skill.level) {
                if (
                  skill.level.toLowerCase().includes("expert") ||
                  skill.level.toLowerCase().includes("advanced")
                ) {
                  bgColor = "bg-accent-blue bg-opacity-20";
                  textColor = "text-accent-blue";
                } else if (skill.level.toLowerCase().includes("intermediate")) {
                  bgColor = "bg-accent-green bg-opacity-20";
                  textColor = "text-accent-green";
                } else if (skill.level.toLowerCase().includes("beginner")) {
                  bgColor = "bg-accent-yellow bg-opacity-20";
                  textColor = "text-accent-yellow";
                }
              }
              return (
                <div
                  key={index}
                  className={`${bgColor} ${textColor} rounded-full px-3 py-1 text-sm font-medium transition-transform hover:scale-105`}
                >
                  {skill.name}
                  {skill.level && (
                    <span className="text-xs ml-1 opacity-75">
                      • {skill.level}
                    </span>
                  )}
                  {skill.keywords && skill.keywords.length > 0 && (
                    <div className="text-xs mt-1 opacity-75">
                      {skill.keywords.join(", ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {work.references && work.references.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1 text-accent-purple"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            References
          </h4>
          <div className="space-y-4">
            {work.references.map((reference, index) => (
              <div
                key={index}
                className="bg-accent bg-opacity-30 p-4 rounded-lg shadow border border-border hover:shadow-md transition-shadow"
              >
                <div className="font-medium text-primary flex items-center">
                  <svg
                    className="w-4 h-4 text-muted mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-9.57v7.387c0 5.704-3.748 9.574-8.983 9.574zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-9.57v7.387c0 5.704-3.731 9.574-9 9.574z" />
                  </svg>
                  {reference.name}
                </div>
                {reference.reference && (
                  <div className="mt-2 text-secondary leading-relaxed">
                    {reference.reference}
                  </div>
                )}
                {reference.date && (
                  <div className="mt-2 text-xs text-muted flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
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
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        Work Experience
      </h2>
      {workList.map((work, index) => (
        <WorkUI key={index} work={work} />
      ))}
    </section>
  );
};
