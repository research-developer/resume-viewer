import { z } from "zod";
import { generateRandomId } from "../../Identity";

export const ProfileSchema = z.object({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("prof-")), // Extended: Internal ID for UI behavior
  network: z.string(),
  username: z.string(),
  url: z.string().url().optional(),
});
