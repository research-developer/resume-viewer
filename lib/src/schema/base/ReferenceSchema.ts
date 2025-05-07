import { z } from "zod";

export const BaseReferenceSchema = z.object({
  name: z.string(),
  reference: z.string().optional(),
});
