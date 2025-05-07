import React from "react";
import { ResumeVolunteer } from "@schema/ResumeSchema";
import { DateRangeUI } from "./DateRangeUI";

interface VolunteerUIProps {
  volunteer: ResumeVolunteer;
}

export const VolunteerUI: React.FC<VolunteerUIProps> = ({ volunteer }) => {
  return (
    <div className="mb-5 pb-4 border-b border-border last:border-0">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-primary">
          {volunteer.position}
        </h3>
        <div className="text-base font-medium text-secondary">
          {volunteer.url ? (
            <a
              href={volunteer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:text-accent-blue-light hover:underline"
            >
              {volunteer.organization}
            </a>
          ) : (
            volunteer.organization
          )}
        </div>
      </div>

      <div className="mb-3">
        <DateRangeUI
          startDate={volunteer.startDate}
          endDate={volunteer.endDate}
        />
      </div>

      {volunteer.summary && (
        <p className="mb-3 text-secondary">{volunteer.summary}</p>
      )}

      {volunteer.highlights && volunteer.highlights.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-secondary">
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
    <section className="mb-6">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        Volunteer Experience
      </h2>
      {volunteerList.map((volunteer, index) => (
        <VolunteerUI key={index} volunteer={volunteer} />
      ))}
    </section>
  );
};
