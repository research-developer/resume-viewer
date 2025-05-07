import React from "react";
import { ResumeLocation } from "@schema/ResumeSchema";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface WorkLocationUIProps {
  location?: string | ResumeLocation;
}

export const WorkLocationUI: React.FC<WorkLocationUIProps> = ({ location }) => {
  if (!location) return null;

  return (
    <div className="text-sm text-muted mb-3 flex items-center">
      <MapPinIcon className="h-4 w-4 mr-1 text-muted" />
      <span className="inline-block hover:text-secondary transition-colors">
        {typeof location === "string"
          ? location
          : [
              location.address,
              location.city,
              location.region,
              location.countryCode,
              location.postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
      </span>
    </div>
  );
};
