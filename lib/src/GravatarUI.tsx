import React, { useEffect, useState } from "react";
import { getGravatarUrl, getInitials } from "./GravatarUtil";

interface GravatarUIProps {
  email?: string;
  name?: string;
  size?: number;
  defaultImage?: string;
  className?: string;
  style?: React.CSSProperties;
  showInitialsWhileLoading?: boolean;
}

/**
 * A React component that displays a Gravatar image for a given email address.
 * Falls back to displaying initials when no Gravatar is found or while loading.
 */
export const GravatarUI: React.FC<GravatarUIProps> = ({
  email,
  name,
  size = 200,
  defaultImage = "identicon",
  className = "",
  style = {},
  showInitialsWhileLoading = true,
}) => {
  const [gravatarUrl, setGravatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);

  useEffect(() => {
    setIsLoading(true);
    setImageError(false);

    const fetchGravatarUrl = async () => {
      try {
        const url = await getGravatarUrl(email, size, defaultImage);
        setGravatarUrl(url);
      } catch (error) {
        console.error("Error fetching Gravatar URL:", error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGravatarUrl();
  }, [email, size, defaultImage]);

  const renderInitials = () => {
    const initialsSize = size || 200;
    const fontSize = Math.max(initialsSize / 2.5, 14);

    return (
      <div
        className={`gravatar-initials ${className}`}
        style={{
          width: `${initialsSize}px`,
          height: `${initialsSize}px`,
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555",
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
          ...style,
        }}
      >
        {initials}
      </div>
    );
  };

  const handleImageLoadError = () => {
    setImageError(true);
  };

  if (!gravatarUrl || imageError || (isLoading && showInitialsWhileLoading)) {
    return renderInitials();
  }

  return (
    <img
      src={gravatarUrl}
      alt={name || "User avatar"}
      className={`gravatar-image ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        ...style,
      }}
      onError={handleImageLoadError}
      onLoad={() => setIsLoading(false)}
    />
  );
};
