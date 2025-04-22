import React from "react";
import { ResumeWork } from "../ResumeModel";
import { DateRangeUI } from "./DateRangeUI";

interface WorkUIProps {
  work: ResumeWork;
}

export const WorkUI: React.FC<WorkUIProps> = ({ work }) => {
  return (
    <div className="work-item">
      <div className="work-header">
        <h3 className="work-position">{work.position}</h3>
        <div className="work-company">
          {work.url ? (
            <a href={work.url} target="_blank" rel="noopener noreferrer">
              {work.name}
            </a>
          ) : (
            work.name
          )}
        </div>
      </div>

      <div className="work-date">
        <DateRangeUI startDate={work.startDate} endDate={work.endDate} />
      </div>

      {work.location && (
        <div className="work-location">
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

      {work.summary && <p className="work-summary">{work.summary}</p>}

      {work.highlights && work.highlights.length > 0 && (
        <div className="work-highlights-section">
          <h4>Highlights</h4>
          <ul className="work-highlights">
            {work.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}

      {work.skills && work.skills.length > 0 && (
        <div className="work-skills-section">
          <h4>Skills</h4>
          <ul className="work-skills">
            {work.skills.map((skill, index) => (
              <li key={index}>
                <span className="skill-name">{skill.name}</span>
                {skill.level && (
                  <span className="skill-level"> - {skill.level}</span>
                )}
                {skill.keywords && skill.keywords.length > 0 && (
                  <span className="skill-keywords">
                    {" "}
                    ({skill.keywords.join(", ")})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {work.references && work.references.length > 0 && (
        <div className="work-references-section">
          <h4>References</h4>
          <ul className="work-references">
            {work.references.map((reference, index) => (
              <li key={index} className="reference-item">
                <div className="reference-name">{reference.name}</div>
                {reference.reference && (
                  <div className="reference-text">"{reference.reference}"</div>
                )}
                {reference.date && (
                  <div className="reference-date">
                    {reference.date.toLocaleDateString()}
                  </div>
                )}
              </li>
            ))}
          </ul>
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
    <section className="resume-work">
      <h2>Work Experience</h2>
      {workList.map((work, index) => (
        <WorkUI key={index} work={work} />
      ))}
    </section>
  );
};
