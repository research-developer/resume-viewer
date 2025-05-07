import { z } from "zod";

export const BaseAwardSchema = z.object({
  title: z
    .string()
    .describe("e.g. One of the 100 greatest minds of the century."),
  date: z.string().optional().describe("Date of the award (ISO8601)."),
  awarder: z.string().optional().describe("e.g. Time Magazine"),
  summary: z
    .string()
    .optional()
    .describe("e.g. Received for my work with Quantum Physics."),
});
