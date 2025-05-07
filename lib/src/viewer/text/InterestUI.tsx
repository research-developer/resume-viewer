import React from "react";
import { ResumeInterest } from "@schema/ResumeSchema";

interface InterestUIProps {
  interest: ResumeInterest;
}

export const InterestUI: React.FC<InterestUIProps> = ({ interest }) => {
  return (
    <div className="mb-3 last:mb-0">
      <div className="font-medium text-primary">{interest.name}</div>

      {interest.keywords && interest.keywords.length > 0 && (
        <div className="text-sm text-muted mt-1">
          {interest.keywords.map((keyword, index) => (
            <span key={index}>
              {keyword}
              {index < interest.keywords!.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

interface InterestListUIProps {
  interestList: ResumeInterest[];
}

export const InterestListUI: React.FC<InterestListUIProps> = ({
  interestList,
}) => {
  if (!interestList || interestList.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        Interests
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {interestList.map((interest, index) => (
          <InterestUI key={index} interest={interest} />
        ))}
      </div>
    </section>
  );
};
