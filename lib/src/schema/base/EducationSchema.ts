import { z } from "zod";
import { BaseDateRangeSchema } from "./DateRangeSchema";

export const BaseEducationSchema = z.object({
  institution: z
    .string()
    .describe("e.g. Massachusetts Institute of Technology"),
  url: z.string().url().optional().describe("e.g. http://facebook.example.com"),
  area: z.string().optional().describe("e.g. Arts"),
  studyType: z.string().optional().describe("e.g. Bachelor"),
  ...BaseDateRangeSchema.shape,
  score: z.string().optional().describe("Grade point average, e.g. 3.67/4.0."),
  courses: z
    .array(
      z.string().describe("e.g. H1302 - Introduction to American history.")
    )
    .optional()
    .describe("List notable courses/subjects."),
});
