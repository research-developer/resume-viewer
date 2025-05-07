import { z } from "zod";

export const BaseLanguageSchema = z.object({
  language: z.string(),
  fluency: z.string().optional(),
});
