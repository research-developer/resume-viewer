import React from "react";
import { ResumeEducation } from "../../ResumeModel";
import DateRangeUI from "./DateRangeUI";

interface EducationUIProps {
  education: ResumeEducation;
}

export const EducationItem: React.FC<EducationUIProps> = ({ education }) => {
  return (
    <div className="mb-5 pb-4 border-b border-gray-200 last:border-0">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {education.url ? (
            <a
              href={education.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              {education.institution}
            </a>
          ) : (
            education.institution
          )}
        </h3>
        {education.area && education.studyType && (
          <div className="text-base text-gray-700 font-medium">
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
        <div className="text-sm text-gray-600 mb-2">GPA: {education.score}</div>
      )}

      {education.courses && education.courses.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Courses</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
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
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
        Education
      </h2>
      {educationList.map((education, index) => (
        <EducationItem key={index} education={education} />
      ))}
    </section>
  );
};
