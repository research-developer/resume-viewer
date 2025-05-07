import { z } from "zod";
import { BasicsSchema } from "./extensions/BasicsSchema";
import { WorkSchema } from "./extensions/WorkSchema";
import { VolunteerSchema } from "./extensions/VolunteerSchema";
import { EducationSchema } from "./extensions/EducationSchema";
import { AwardSchema } from "./extensions/AwardSchema";
import { CertificateSchema } from "./extensions/CertificateSchema";
import { PublicationSchema } from "./extensions/PublicationSchema";
import { SkillSchema } from "./extensions/SkillSchema";
import { LanguageSchema } from "./extensions/LanguageSchema";
import { InterestSchema } from "./extensions/InterestSchema";
import { ReferenceSchema } from "./extensions/ReferenceSchema";
import { ProjectSchema } from "./extensions/ProjectSchema";
import { generateRandomId } from "../Identity";
import { ProfileSchema } from "./extensions/ProfileSchema";
import { LocationSchema } from "./extensions/LocationSchema";

export const ResumeSchema = z.object({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("resume-")), // Optional internal ID
  basics: BasicsSchema,
  work: z.array(WorkSchema).optional(),
  volunteer: z.array(VolunteerSchema).optional(),
  education: z.array(EducationSchema).optional(),
  awards: z.array(AwardSchema).optional(),
  certificates: z.array(CertificateSchema).optional(),
  publications: z.array(PublicationSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  languages: z.array(LanguageSchema).optional(),
  interests: z.array(InterestSchema).optional(),
  references: z.array(ReferenceSchema).optional(),
  projects: z.array(ProjectSchema).optional(),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type ResumeBasics = z.infer<typeof BasicsSchema>;
export type ResumeWork = z.infer<typeof WorkSchema>;
export type ResumeVolunteer = z.infer<typeof VolunteerSchema>;
export type ResumeEducation = z.infer<typeof EducationSchema>;
export type ResumeAward = z.infer<typeof AwardSchema>;
export type ResumeCertificate = z.infer<typeof CertificateSchema>;
export type ResumePublication = z.infer<typeof PublicationSchema>;
export type ResumeSkill = z.infer<typeof SkillSchema>;
export type ResumeLanguage = z.infer<typeof LanguageSchema>;
export type ResumeInterest = z.infer<typeof InterestSchema>;
export type ResumeReference = z.infer<typeof ReferenceSchema>;
export type ResumeProject = z.infer<typeof ProjectSchema>;
export type ResumeLocation = z.infer<typeof LocationSchema>;
export type ResumeProfile = z.infer<typeof ProfileSchema>;
