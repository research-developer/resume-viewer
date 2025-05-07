import React from "react";
import { ResumeWork } from "@schema/ResumeSchema";
import { WorkHeaderUI } from "./WorkHeaderUI";
import { WorkLocationUI } from "./WorkLocationUI";
import { WorkSummaryUI } from "./WorkSummaryUI";
import { WorkHighlightsUI } from "./WorkHighlightsUI";
import { WorkSkillsUI } from "./WorkSkillsUI";
import { WorkReferencesUI } from "./WorkReferencesUI";

interface WorkUIProps {
  work: ResumeWork;
}

export const WorkUI: React.FC<WorkUIProps> = ({ work }) => {
  return (
    <div className="flex flex-col gap-4 border-b border-border last:border-0">
      <WorkHeaderUI work={work} />
      <WorkLocationUI location={work.location} />
      <WorkSummaryUI summary={work.summary} />
      <WorkHighlightsUI highlights={work.highlights} />
      <WorkSkillsUI skills={work.skills} />
      <WorkReferencesUI references={work.references} />
    </div>
  );
};

interface WorkListUIProps {
  workList: ResumeWork[];
}

export const WorkListUI: React.FC<WorkListUIProps> = ({ workList }) => {
  if (!workList || workList.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-primary border-b border-border mb-4 pb-2">
        Work Experience
      </h2>
      {workList.map((work, index) => (
        <WorkUI key={index} work={work} />
      ))}
    </section>
  );
};
