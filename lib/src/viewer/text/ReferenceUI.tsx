import React from "react";
import { ResumeReference } from "@schema/ResumeSchema";

interface ReferenceUIProps {
  reference: ResumeReference;
}

export const ReferenceUI: React.FC<ReferenceUIProps> = ({ reference }) => {
  return (
    <div className="mb-4 pb-4 border-b border-border last:border-0">
      <h3 className="text-lg font-semibold text-primary">{reference.name}</h3>
      {reference.reference && (
        <p className="mt-2 italic text-secondary pl-4 border-l-2 border-accent-purple">
          "{reference.reference}"
        </p>
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
    <section className="mb-6">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
        References
      </h2>
      {referenceList.map((reference, index) => (
        <ReferenceUI key={index} reference={reference} />
      ))}
    </section>
  );
};
