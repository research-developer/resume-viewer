import { z } from "zod";

export const BaseCertificateSchema = z.object({
  name: z.string(),
  date: z.string().optional(), // ISO8601
  issuer: z.string().optional(),
  url: z.string().url().optional(),
});
