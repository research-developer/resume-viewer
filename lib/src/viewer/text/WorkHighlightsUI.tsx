import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

interface WorkHighlightsUIProps {
  highlights?: string[];
}

export const WorkHighlightsUI: React.FC<WorkHighlightsUIProps> = ({
  highlights,
}) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-secondary mb-3 flex items-center">
        <StarIcon className="w-5 h-5 mr-2 text-accent-blue" />
        Highlights
      </h4>
      <ul className="flex flex-wrap gap-3">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="flex-auto flex items-center  text-secondary p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-light bg-opacity-10 text-light font-bold text-sm mr-3">
              {index + 1}
            </span>
            <span className="text-sm">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
