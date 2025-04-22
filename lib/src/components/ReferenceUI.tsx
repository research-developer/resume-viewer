import React from "react";
import { ResumeReference } from "../ResumeModel";

interface ReferenceUIProps {
  reference: ResumeReference;
}

export const ReferenceUI: React.FC<ReferenceUIProps> = ({ reference }) => {
  return (
    <div className="reference-item">
      <h3 className="reference-name">{reference.name}</h3>
      {reference.reference && (
        <p className="reference-text">"{reference.reference}"</p>
      )}
    </div>
  );
};

interface ReferenceListUIProps {
  referenceList: ResumeReference[];
}

export const ReferenceListUI: React.FC<ReferenceListUIProps> = ({
  referenceList,
}) => {
  if (!referenceList || referenceList.length === 0) return null;

  return (
    <section className="resume-references">
      <h2>References</h2>
      {referenceList.map((reference, index) => (
        <ReferenceUI key={index} reference={reference} />
      ))}
    </section>
  );
};
