import { z } from "zod";

export const BaseProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  startDate: z.string().optional(), // ISO8601
  endDate: z.string().optional(), // ISO8601
  url: z.string().url().optional(),
  roles: z.array(z.string()).optional(),
  entity: z.string().optional(),
  type: z.string().optional(),
});
