import { z } from "zod";

export const BaseLocationSchema = z.object({
  address: z
    .string()
    .optional()
    .describe(
      "To add multiple address lines, use \\n. For example, 1234 Glücklichkeit Straße\\nHinterhaus 5. Etage li."
    ),
  postalCode: z.string().optional().describe("Postal code of the location."),
  city: z.string().optional().describe("City of the location."),
  countryCode: z
    .string()
    .optional()
    .describe("Code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN."),
  region: z
    .string()
    .optional()
    .describe(
      "The general region where you live. Can be a US state, or a province, for instance."
    ),
});
