import { z } from "zod";
import { BaseSkillSchema } from "../base/SkillSchema";
import { generateRandomId } from "../../Identity";

export const SkillSchema = BaseSkillSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("skill-")), // xtended: Internal ID for UI behavior
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
