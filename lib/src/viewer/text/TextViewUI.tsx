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
import { ResumeStatsUI } from "./StatsUI";

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
    <div className="flex-auto flex flex-col md:flex-row p-2 sm:p-4 gap-2 md:gap-4 max-w-7xl sm:mx-auto">
      <div className="flex flex-wrap sm:max-w-2/3 gap-2 p-4 card">
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
      <div className="flex-none md:max-w-1/3 flex p-2 card">
        <ResumeStatsUI analyzer={resumeData} />
      </div>
    </div>
  );
};
