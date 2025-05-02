import React from "react";
import { BasicsUI } from "./BasicsUI";
import { WorkListUI } from "./WorkUI";
import { VolunteerListUI } from "./VolunteerUI";
import { EducationListUI } from "./EducationUI";
import { AwardListUI } from "./AwardUI";
import { CertificateListUI } from "./CertificateUI";
import { PublicationListUI } from "./PublicationUI";
import { SkillListUI } from "./SkillUI";
import { LanguageListUI } from "./LanguageUI";
import { InterestListUI } from "./InterestUI";
import { ReferenceListUI } from "./ReferenceUI";
import { ProjectListUI } from "./ProjectUI";
import { useViewerContext } from "../ViewerHook";
import { ResumeStatsUI } from "./ResumeStatsUI";

interface TextViewUIProps {}

export const TextViewUI: React.FC<TextViewUIProps> = () => {
  const [state] = useViewerContext();
  const { resume: viewerData } = state;
  const { isPending, data: resumeData } = viewerData || {};

  if (isPending) {
    return (
      <div className="p-4 text-center text-secondary">Loading resume...</div>
    );
  }

  if (!resumeData) {
    return (
      <div className="p-4 text-center text-muted">No resume data found.</div>
    );
  }

  const { resume } = resumeData;

  return (
    <div className="flex flex-row gap-6 justify-between items-start max-w-7xl mx-auto p-6">
      <div className="rounded-lg bg-surface text-primary shadow-md border border-border mx-auto flex flex-col gap-6 p-6 max-w-6xl">
        <BasicsUI basics={resume.basics} />
        {resume.work && <WorkListUI workList={resume.work} />}
        {resume.volunteer && (
          <VolunteerListUI volunteerList={resume.volunteer} />
        )}
        {resume.education && (
          <EducationListUI educationList={resume.education} />
        )}
        {resume.awards && <AwardListUI awardList={resume.awards} />}
        {resume.certificates && (
          <CertificateListUI certificateList={resume.certificates} />
        )}
        {resume.publications && (
          <PublicationListUI publicationList={resume.publications} />
        )}
        {resume.skills && <SkillListUI skillList={resume.skills} />}
        {resume.languages && <LanguageListUI languageList={resume.languages} />}
        {resume.interests && <InterestListUI interestList={resume.interests} />}
        {resume.references && (
          <ReferenceListUI referenceList={resume.references} />
        )}
        {resume.projects && <ProjectListUI projectList={resume.projects} />}
      </div>
      <div>
        <ResumeStatsUI analyzer={resumeData} />
      </div>
    </div>
  );
};
