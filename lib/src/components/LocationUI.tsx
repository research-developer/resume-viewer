import React from "react";
import { ResumeLocation } from "../ResumeModel";

interface LocationUIProps {
  location: ResumeLocation;
}

export const LocationUI: React.FC<LocationUIProps> = ({ location }) => {
  if (!location) return null;

  return (
    <div className="resume-location">
      {location.address && (
        <div className="location-address">{location.address}</div>
      )}
      <div className="location-city-region">
        {location.city && (
          <span className="location-city">{location.city}</span>
        )}
        {location.region && location.city && <span>, </span>}
        {location.region && (
          <span className="location-region">{location.region}</span>
        )}
        {location.postalCode && <span> {location.postalCode}</span>}
      </div>
      {location.countryCode && (
        <div className="location-country">{location.countryCode}</div>
      )}
    </div>
  );
};
