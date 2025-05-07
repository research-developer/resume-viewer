import { z } from "zod";
import { BaseLanguageSchema } from "../base/LanguageSchema";
import { generateRandomId } from "../../Identity";

export const LanguageSchema = BaseLanguageSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("lang-")), // Extended: Internal ID for UI behavior
});
