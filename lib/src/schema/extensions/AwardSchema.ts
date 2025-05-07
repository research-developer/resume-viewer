import { z } from "zod";
import { BaseAwardSchema } from "../base/AwardSchema";
import { generateRandomId } from "../../Identity";

export const AwardSchema = BaseAwardSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("award-")), // Extended: Internal ID for UI behavior
});
