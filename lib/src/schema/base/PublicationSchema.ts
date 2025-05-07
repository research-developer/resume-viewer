import { z } from "zod";

export const BasePublicationSchema = z.object({
  name: z.string(),
  publisher: z.string().optional(),
  releaseDate: z.string().optional(), // ISO8601
  url: z.string().url().optional(),
  summary: z.string().optional(),
});
