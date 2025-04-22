import React from "react";
import { ResumeEducation } from "../ResumeModel";
import DateRangeUI from "./DateRangeUI";

interface EducationUIProps {
  education: ResumeEducation;
}

export const EducationItem: React.FC<EducationUIProps> = ({ education }) => {
  return (
    <div className="education-item">
      <div className="education-header">
        <h3 className="education-institution">
          {education.url ? (
            <a href={education.url} target="_blank" rel="noopener noreferrer">
              {education.institution}
            </a>
          ) : (
            education.institution
          )}
        </h3>
        {education.area && education.studyType && (
          <div className="education-area">
            {education.studyType} in {education.area}
          </div>
        )}
      </div>

      {(education.startDate || education.endDate) && (
        <div className="education-date">
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
        <div className="education-score">GPA: {education.score}</div>
      )}

      {education.courses && education.courses.length > 0 && (
        <div className="education-courses">
          <h4>Courses</h4>
          <ul>
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
    <section className="resume-education">
      <h2>Education</h2>
      {educationList.map((education, index) => (
        <EducationItem key={index} education={education} />
      ))}
    </section>
  );
};
