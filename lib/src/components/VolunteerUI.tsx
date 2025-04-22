import React from "react";
import { ResumeVolunteer } from "../ResumeModel";
import { DateRangeUI } from "./DateRangeUI";

interface VolunteerUIProps {
  volunteer: ResumeVolunteer;
}

export const VolunteerUI: React.FC<VolunteerUIProps> = ({ volunteer }) => {
  return (
    <div className="volunteer-item">
      <div className="volunteer-header">
        <h3 className="volunteer-position">{volunteer.position}</h3>
        <div className="volunteer-organization">
          {volunteer.url ? (
            <a href={volunteer.url} target="_blank" rel="noopener noreferrer">
              {volunteer.organization}
            </a>
          ) : (
            volunteer.organization
          )}
        </div>
      </div>

      <div className="volunteer-date">
        <DateRangeUI
          startDate={volunteer.startDate}
          endDate={volunteer.endDate}
        />
      </div>

      {volunteer.summary && (
        <p className="volunteer-summary">{volunteer.summary}</p>
      )}

      {volunteer.highlights && volunteer.highlights.length > 0 && (
        <ul className="volunteer-highlights">
          {volunteer.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface VolunteerListUIProps {
  volunteerList: ResumeVolunteer[];
}

export const VolunteerListUI: React.FC<VolunteerListUIProps> = ({
  volunteerList,
}) => {
  if (!volunteerList || volunteerList.length === 0) return null;

  return (
    <section className="resume-volunteer">
      <h2>Volunteer Experience</h2>
      {volunteerList.map((volunteer, index) => (
        <VolunteerUI key={index} volunteer={volunteer} />
      ))}
    </section>
  );
};
