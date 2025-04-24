import { z } from "zod";

export const LocationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
});

export const ProfileSchema = z.object({
  network: z.string(),
  username: z.string(),
  url: z.string().url().optional(),
});

export const BasicsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  image: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
  location: LocationSchema.optional(),
  profiles: z.array(ProfileSchema).optional(),
});

export const SkillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const LanguageSchema = z.object({
  language: z.string(),
  fluency: z.string().optional(),
});

export const ReferenceSchema = z.object({
  name: z.string(),
  reference: z.string().optional(),
  date: z.coerce.date().optional(),
});

export const WorkSchema = z.object({
  name: z.string(),
  position: z.string().optional(),
  url: z.string().url().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  skills: z.array(SkillSchema).optional(),
  location: LocationSchema.optional(),
  references: z.array(ReferenceSchema).optional(),
});

export const VolunteerSchema = z.object({
  summary: z.string(),
  organization: z.string().optional(),
  position: z.string().optional(),
  url: z.string().url().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  highlights: z.array(z.string()).optional(),
});

export const EducationSchema = z.object({
  institution: z.string(),
  url: z.string().url().optional(),
  area: z.string().optional(),
  studyType: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).optional(),
});

export const AwardSchema = z.object({
  title: z.string(),
  date: z.coerce.date().optional(),
  awarder: z.string().optional(),
  summary: z.string().optional(),
});

export const CertificateSchema = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  issuer: z.string().optional(),
  url: z.string().url().optional(),
});

export const PublicationSchema = z.object({
  name: z.string(),
  publisher: z.string().optional(),
  releaseDate: z.coerce.date().optional(),
  url: z.string().url().optional(),
  summary: z.string().optional(),
});

export const InterestSchema = z.object({
  name: z.string(),
  keywords: z.array(z.string()).optional(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  url: z.string().url().optional(),
});

export const ResumeSchema = z.object({
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

// infer the types from the schemas to ensure clean typing
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
