import React from "react";
import { ResumeBasics } from "../../ResumeModel";
import { LocationUI } from "./LocationUI";
import { ProfileUI } from "./ProfileUI";

interface BasicsUIProps {
  basics: ResumeBasics;
}

export const BasicsUI: React.FC<BasicsUIProps> = ({ basics }) => {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-primary">{basics.name}</h1>
        {basics.label && (
          <h2 className="text-xl text-secondary mt-1">{basics.label}</h2>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4 text-sm">
        {basics.email && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-muted"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <a
              href={`mailto:${basics.email}`}
              className="text-accent-blue hover:text-accent-blue-light hover:underline"
            >
              {basics.email}
            </a>
          </div>
        )}

        {basics.phone && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-muted"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="text-secondary">{basics.phone}</span>
          </div>
        )}

        {basics.url && (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-muted"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clipRule="evenodd"
              />
            </svg>
            <a
              href={basics.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:text-accent-blue-light hover:underline"
            >
              {basics.url}
            </a>
          </div>
        )}
      </div>

      {basics.location && <LocationUI location={basics.location} />}

      {basics.summary && (
        <div className="my-4 text-secondary bg-accent p-4 rounded-lg border border-border">
          {basics.summary}
        </div>
      )}

      {basics.profiles && basics.profiles.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {basics.profiles.map((profile, index) => (
            <ProfileUI key={index} profile={profile} />
          ))}
        </div>
      )}

      {basics.image && (
        <div className="mt-4 flex justify-center md:justify-end">
          <img
            src={basics.image}
            alt={basics.name}
            className="w-32 h-32 object-cover rounded-full border-2 border-border shadow"
          />
        </div>
      )}
    </section>
  );
};
