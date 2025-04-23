import React from "react";
import { ResumeLocation } from "../ResumeModel";

interface LocationUIProps {
  location: ResumeLocation;
}

export const LocationUI: React.FC<LocationUIProps> = ({ location }) => {
  if (!location) return null;

  return (
    <div className="flex flex-col text-sm text-gray-600 my-2">
      {location.address && <div className="mb-1">{location.address}</div>}
      <div className="flex flex-wrap">
        {location.city && <span className="font-medium">{location.city}</span>}
        {location.region && location.city && <span className="mx-1">,</span>}
        {location.region && <span>{location.region}</span>}
        {location.postalCode && (
          <span className="ml-1">{location.postalCode}</span>
        )}
      </div>
      {location.countryCode && (
        <div className="mt-1">{location.countryCode}</div>
      )}
    </div>
  );
};
