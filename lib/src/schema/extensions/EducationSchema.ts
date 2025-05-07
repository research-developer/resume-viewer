import { z } from "zod";
import { BaseEducationSchema } from "../base/EducationSchema";
import { generateRandomId } from "../../Identity";

export const EducationSchema = BaseEducationSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("edu-")), // Extended: Internal ID for UI behavior
});
