import { z } from "zod";

export const BaseSkillSchema = z.object({
  name: z.string().describe("e.g. Web Development"),
  level: z.string().optional().describe("e.g. Master"),
  keywords: z
    .array(z.string().describe("e.g. HTML"))
    .optional()
    .describe("List some keywords pertaining to this skill."),
});
