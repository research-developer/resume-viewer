import { z } from "zod";
import { generateRandomId } from "../../Identity";

export const LocationSchema = z.union([
  z.object({
    id: z
      .string()
      .optional()
      .default(() => generateRandomId("loc-")), // Extended: Internal ID for UI behavior
    address: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    countryCode: z.string().optional(),
    region: z.string().optional(),
  }),
  z.string().optional(),
]);
