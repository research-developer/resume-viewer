import React from "react";
import { ResumeAward } from "../ResumeModel";
import DateUI from "./DateUI";

interface AwardUIProps {
  award: ResumeAward;
}

export const AwardUI: React.FC<AwardUIProps> = ({ award }) => {
  return (
    <div className="award-item">
      <div className="award-header">
        <h3 className="award-title">{award.title}</h3>
        {award.awarder && (
          <div className="award-awarder">by {award.awarder}</div>
        )}
      </div>

      {award.date && (
        <div className="award-date">
          <DateUI date={award.date} />
        </div>
      )}

      {award.summary && <p className="award-summary">{award.summary}</p>}
    </div>
  );
};

interface AwardListUIProps {
  awardList: ResumeAward[];
}

export const AwardListUI: React.FC<AwardListUIProps> = ({ awardList }) => {
  if (!awardList || awardList.length === 0) return null;

  return (
    <section className="resume-awards">
      <h2>Awards</h2>
      {awardList.map((award, index) => (
        <AwardUI key={index} award={award} />
      ))}
    </section>
  );
};
