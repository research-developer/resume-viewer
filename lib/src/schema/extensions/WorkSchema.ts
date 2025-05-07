import { z } from "zod";
import { BaseWorkSchema } from "../base/WorkSchema";
import { generateRandomId } from "../../Identity";
import { SkillSchema } from "./SkillSchema";
import { ReferenceSchema } from "./ReferenceSchema";
import { LocationSchema } from "./LocationSchema";

export const WorkSchema = BaseWorkSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("work-")), // xtended: Internal ID for UI behavior
  skills: z.array(SkillSchema).optional(),
  references: z.array(ReferenceSchema).optional(),
  location: LocationSchema.optional(),
});
