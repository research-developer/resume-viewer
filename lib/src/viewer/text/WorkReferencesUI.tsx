import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { ResumeReference } from "../../ResumeModel";

interface WorkReferencesUIProps {
  references?: ResumeReference[];
}

export const WorkReferencesUI: React.FC<WorkReferencesUIProps> = ({
  references,
}) => {
  if (!references || references.length === 0) return null;

  return (
    <div className="mb-2">
      <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center">
        <UserCircleIcon className="w-4 h-4 mr-1 text-accent-purple" />
        References
      </h4>
      <div className="space-y-4">
        {references.map((reference, index) => (
          <div
            key={index}
            className="bg-accent bg-opacity-30 p-4 rounded-lg shadow border border-border hover:shadow-md transition-shadow"
          >
            <div className="font-medium text-primary flex items-center">
              <UserCircleIcon className="w-4 h-4 text-muted mr-2" />
              {reference.name}
            </div>
            {reference.reference && (
              <div className="mt-2 text-secondary leading-relaxed">
                {reference.reference}
              </div>
            )}
            {reference.date && (
              <div className="mt-2 text-xs text-muted flex items-center">
                <span className="w-3 h-3 mr-1">
                  {new Date(reference.date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
