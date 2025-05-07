import { z } from "zod";
import { BaseLocationSchema } from "./LocationSchema";
import { BaseProfileSchema } from "./ProfileSchema";

export const BaseBasicsSchema = z.object({
  name: z.string().describe("The full name of the individual."),
  label: z.string().optional().describe("e.g. Web Developer"),
  image: z
    .string()
    .optional()
    .describe("URL (as per RFC 3986) to an image in JPEG or PNG format."),
  email: z.string().email().optional().describe("e.g. thomas@gmail.com"),
  phone: z
    .string()
    .optional()
    .describe(
      "Phone numbers are stored as strings so use any format you like, e.g. 712-117-2923."
    ),
  url: z
    .string()
    .url()
    .optional()
    .describe("URL (as per RFC 3986) to your website, e.g. personal homepage."),
  summary: z
    .string()
    .optional()
    .describe("Write a short 2-3 sentence biography about yourself."),
  location: BaseLocationSchema.optional().describe(
    "The general location of the individual."
  ),
  profiles: z
    .array(BaseProfileSchema)
    .optional()
    .describe("Specify any number of social networks that you participate in."),
});
