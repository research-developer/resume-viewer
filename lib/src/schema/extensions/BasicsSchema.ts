import { z } from "zod";
import { BaseBasicsSchema } from "../base/BasicsSchema";
import { generateRandomId } from "../../Identity";
import { LocationSchema } from "./LocationSchema";
import { ProfileSchema } from "./ProfileSchema";

export const BasicsSchema = BaseBasicsSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("basic-")), // xtended: Internal ID for UI behavior
  location: LocationSchema.optional(),
  profiles: z.array(ProfileSchema).optional(),
});
