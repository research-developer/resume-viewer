import { z } from "zod";
import { BaseSkillSchema } from "../base/SkillSchema";
import { generateRandomId } from "../../Identity";
import { BaseDateRangeSchema } from "@schema/base/DateRangeSchema";

export const SkillSchema = BaseSkillSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("skill-")), // Extended: Internal ID for UI behavior
  ...BaseDateRangeSchema.shape, // Extend: Date range for the skill to allow for a start and end date
});
