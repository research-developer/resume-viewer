import React from "react";
import { ResumeInterest } from "../ResumeModel";

interface InterestUIProps {
  interest: ResumeInterest;
}

export const InterestUI: React.FC<InterestUIProps> = ({ interest }) => {
  return (
    <div className="interest-item">
      <div className="interest-name">{interest.name}</div>

      {interest.keywords && interest.keywords.length > 0 && (
        <div className="interest-keywords">
          {interest.keywords.map((keyword, index) => (
            <span key={index} className="interest-keyword">
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
    <section className="resume-interests">
      <h2>Interests</h2>
      <div className="interests-container">
        {interestList.map((interest, index) => (
          <InterestUI key={index} interest={interest} />
        ))}
      </div>
    </section>
  );
};
