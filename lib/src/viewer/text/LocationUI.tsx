import React from "react";
import { ResumeLocation } from "../../ResumeModel";
import { MapPinIcon } from "@heroicons/react/24/solid";

interface LocationUIProps {
  location: string | ResumeLocation;
}

export const LocationUI: React.FC<LocationUIProps> = ({ location }) => {
  if (!location) return null;

  if (typeof location === "string") {
    return (
      <div className="flex items-center text-sm text-muted my-2">
        <MapPinIcon className="h-4 w-4 mr-2 text-accent-blue" />
        <span>{location}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row text-sm text-muted rounded-lg shadow-sm gap-2 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <MapPinIcon className="h-4 w-4 text-accent-light" />
        <span className="font-medium text-secondary hidden">Location</span>
      </div>
      {location.address && <div>{location.address}</div>}
      <div className="flex flex-wrap">
        {location.city && <span className="font-medium ">{location.city}</span>}
        {location.region && location.city && <span>, </span>}
        {location.region && <span>{location.region}</span>}
        {location.postalCode && <span>{location.postalCode}</span>}
      </div>
      {location.countryCode && <div>{location.countryCode}</div>}
    </div>
  );
};
