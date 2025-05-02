import React from "react";
import { ResumeProfile } from "../../ResumeModel";

interface ProfileUIProps {
  profile: ResumeProfile;
}

export const ProfileUI: React.FC<ProfileUIProps> = ({ profile }) => {
  return (
    <div className="inline-flex items-center bg-accent rounded-xl px-3 py-1 text-sm">
      <span className="font-medium text-primary mr-1">{profile.network}: </span>
      {profile.url ? (
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-blue hover:text-accent-blue-light hover:underline"
        >
          {profile.username}
        </a>
      ) : (
        <span className="text-secondary">{profile.username}</span>
      )}
    </div>
  );
};
