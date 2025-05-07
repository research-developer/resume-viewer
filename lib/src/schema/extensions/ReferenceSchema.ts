import { z } from "zod";
import { BaseReferenceSchema } from "../base/ReferenceSchema";
import { generateRandomId } from "../../Identity";

export const ReferenceSchema = BaseReferenceSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("ref-")), // xtended: Internal ID for UI behavior
  date: z.coerce.date().optional(),
});
