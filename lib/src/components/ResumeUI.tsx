import React from "react";
import { Resume } from "../ResumeModel";
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

interface ResumeUIProps {
  resume: Resume;
}

export const ResumeUI: React.FC<ResumeUIProps> = ({ resume }) => {
  return (
    <div className="resume-container">
      <BasicsUI basics={resume.basics} />

      {resume.work && <WorkListUI workList={resume.work} />}
      {resume.volunteer && <VolunteerListUI volunteerList={resume.volunteer} />}
      {resume.education && <EducationListUI educationList={resume.education} />}
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
  );
};
