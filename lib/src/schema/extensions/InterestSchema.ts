import { z } from "zod";
import { BaseInterestSchema } from "../base/InterestSchema";
import { generateRandomId } from "../../Identity";

export const InterestSchema = BaseInterestSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("int-")), // Extended: Internal ID for UI behavior
});
