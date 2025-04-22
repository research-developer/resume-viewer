import React from "react";
import { ResumeProfile } from "../ResumeModel";

interface ProfileUIProps {
  profile: ResumeProfile;
}

export const ProfileUI: React.FC<ProfileUIProps> = ({ profile }) => {
  return (
    <div className="resume-profile">
      <span className="profile-network">{profile.network}: </span>
      {profile.url ? (
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="profile-link"
        >
          {profile.username}
        </a>
      ) : (
        <span className="profile-username">{profile.username}</span>
      )}
    </div>
  );
};
