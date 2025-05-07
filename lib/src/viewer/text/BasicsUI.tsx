import React from "react";
import { ResumeBasics } from "@schema/ResumeSchema";
import { LocationUI } from "./LocationUI";
import { ProfileUI } from "./ProfileUI";
import { EnvelopeIcon, PhoneIcon, LinkIcon } from "@heroicons/react/24/outline";

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
            <EnvelopeIcon className="h-4 w-4 mr-2 text-muted" />
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
            <PhoneIcon className="h-4 w-4 mr-2 text-muted" />
            <span className="text-secondary">{basics.phone}</span>
          </div>
        )}

        {basics.url && (
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-2 text-muted" />
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

        {basics.location && <LocationUI location={basics.location} />}
      </div>

      {basics.summary && (
        <div className="text-secondary bg-accent p-4 rounded-lg border border-border">
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
