import React from "react";
import { ResumeEducation } from "../../ResumeModel";
import DateRangeUI from "./DateRangeUI";

interface EducationUIProps {
  education: ResumeEducation;
}

export const EducationItem: React.FC<EducationUIProps> = ({ education }) => {
  return (
    <div className="mb-5 pb-4 border-b border-border last:border-0">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-primary">
          {education.url ? (
            <a
              href={education.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:text-accent-blue-light hover:underline"
            >
              {education.institution}
            </a>
          ) : (
            education.institution
          )}
        </h3>
        {education.area && education.studyType && (
          <div className="text-base text-secondary font-medium">
            {education.studyType} in {education.area}
          </div>
        )}
      </div>

      {(education.startDate || education.endDate) && (
        <div className="mb-2">
          <DateRangeUI
            startDate={education.startDate}
            endDate={education.endDate}
            options={{ year: "numeric", month: "short" }}
            locale="en-US"
            currentText="Present"
          />
        </div>
      )}

      {education.score && (
        <div className="text-sm text-muted mb-2">GPA: {education.score}</div>
      )}

      {education.courses && education.courses.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-secondary mb-1">Courses</h4>
          <ul className="list-disc pl-5 text-sm text-muted space-y-1">
            {education.courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface EducationListUIProps {
  educationList: ResumeEducation[];
}

export const EducationListUI: React.FC<EducationListUIProps> = ({
  educationList,
}) => {
  if (!educationList || educationList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        Education
      </h2>
      {educationList.map((education, index) => (
        <EducationItem key={index} education={education} />
      ))}
    </section>
  );
};
