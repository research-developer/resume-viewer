import React from "react";
import { Resume } from "../../ResumeModel";
import { GravatarUI } from "../../GravatarUI";

interface ProfileUIProps {
  resume: Resume;
  gravatarUrl?: string;
  buttons?: {
    label: string;
    onClick: () => void;
  }[];
}

export const ProfileUI: React.FC<ProfileUIProps> = ({
  resume,
  gravatarUrl,
  buttons = [],
}) => {
  const { basics } = resume;
  const name = basics.name;
  const label = basics.label || "";
  const email = basics.email || "";
  const summary = basics.summary || "";

  const location =
    typeof basics.location === "string"
      ? basics.location
      : basics.location
      ? [
          basics.location.city,
          basics.location.region,
          basics.location.countryCode,
        ]
          .filter(Boolean)
          .join(", ")
      : undefined;

  return (
    <div className="flex flex-col items-center p-spacing-card text-secondary">
      {/* Avatar */}
      <div className="w-28 h-28 mb-4">
        <GravatarUI
          email={email}
          name={name}
          size={128}
          className="rounded-avatar border border-border shadow-md"
          style={{
            width: "100%",
            height: "100%",
          }}
          defaultImage={gravatarUrl ? undefined : "mp"}
        />
      </div>

      {/* Name & Title */}
      <h2 className="text-primary text-2xl font-bold text-center">{name}</h2>
      <p className="text-secondary text-sm text-center mt-1">{label}</p>

      {/* Summary */}
      <p className="text-secondary text-sm text-center mt-3 px-4 leading-relaxed">
        {summary}
      </p>

      {/* Location (optional) */}
      {location && <p className="text-muted text-xs mt-3">{location}</p>}

      {/* Buttons */}
      {buttons.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-6">
          {buttons.map((button, idx) => (
            <button className="btn" key={idx} onClick={button.onClick}>
              {button.label}
            </button>
          ))}
        </div>
      )}

      {/* Email */}
      <div className="mt-6">
        <a
          href={`mailto:${email}`}
          className="text-primary text-sm hover:underline transition"
        >
          {email}
        </a>
      </div>
    </div>
  );
};
