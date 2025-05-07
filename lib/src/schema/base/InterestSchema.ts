import { z } from "zod";

export const BaseInterestSchema = z.object({
  name: z.string(),
  keywords: z.array(z.string()).optional(),
});
