import { z } from "zod";
import { BaseProjectSchema } from "../base/ProjectSchema";
import { generateRandomId } from "../../Identity";

export const ProjectSchema = BaseProjectSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("proj-")), // Extended: Internal ID for UI behavior
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
