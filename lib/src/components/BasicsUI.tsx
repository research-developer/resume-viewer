import React from "react";
import { ResumeBasics } from "../ResumeModel";
import { LocationUI } from "./LocationUI";
import { ProfileUI } from "./ProfileUI";

interface BasicsUIProps {
  basics: ResumeBasics;
}

export const BasicsUI: React.FC<BasicsUIProps> = ({ basics }) => {
  return (
    <section className="resume-basics">
      <div className="basics-header">
        <h1 className="basics-name">{basics.name}</h1>
        {basics.label && <h2 className="basics-label">{basics.label}</h2>}
      </div>

      <div className="basics-contact">
        {basics.email && (
          <div className="basics-email">
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </div>
        )}
        {basics.phone && <div className="basics-phone">{basics.phone}</div>}
        {basics.url && (
          <div className="basics-url">
            <a href={basics.url} target="_blank" rel="noopener noreferrer">
              {basics.url}
            </a>
          </div>
        )}
      </div>

      {basics.location && <LocationUI location={basics.location} />}

      {basics.summary && <div className="basics-summary">{basics.summary}</div>}

      {basics.profiles && basics.profiles.length > 0 && (
        <div className="basics-profiles">
          {basics.profiles.map((profile, index) => (
            <ProfileUI key={index} profile={profile} />
          ))}
        </div>
      )}

      {basics.image && (
        <div className="basics-image">
          <img src={basics.image} alt={basics.name} />
        </div>
      )}
    </section>
  );
};
