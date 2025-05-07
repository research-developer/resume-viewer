import { z } from "zod";
import { BaseVolunteerSchema } from "../base/VolunteerSchema";
import { generateRandomId } from "../../Identity";

export const VolunteerSchema = BaseVolunteerSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("vol-")), // Extended: Internal ID for UI behavior
  summary: z.string(), // Extended: Made required
});
