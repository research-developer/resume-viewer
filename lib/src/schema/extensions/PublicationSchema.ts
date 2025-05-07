import { z } from "zod";
import { BasePublicationSchema } from "../base/PublicationSchema";
import { generateRandomId } from "../../Identity";

export const PublicationSchema = BasePublicationSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("pub-")), // xtended: Internal ID for UI behavior
});
