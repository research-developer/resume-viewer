import { z } from "zod";

export const BaseProfileSchema = z.object({
  network: z.string().describe("e.g. Facebook or Twitter"),
  username: z.string().describe("e.g. neutralthoughts"),
  url: z
    .string()
    .url()
    .optional()
    .describe("e.g. http://twitter.example.com/neutralthoughts"),
});
