import { z } from "zod";
import { BaseDateRangeSchema } from "./DateRangeSchema";

export const BaseVolunteerSchema = z.object({
  organization: z.string().describe("e.g. Facebook"),
  position: z.string().optional().describe("e.g. Software Engineer"),
  url: z.string().url().optional().describe("e.g. http://facebook.example.com"),
  ...BaseDateRangeSchema.shape,
  summary: z
    .string()
    .optional()
    .describe("Give an overview of your responsibilities at the organization."),
  highlights: z
    .array(z.string().describe("e.g. Increased profits by 20% from 2011-2012."))
    .optional()
    .describe("Specify accomplishments and achievements."),
});
