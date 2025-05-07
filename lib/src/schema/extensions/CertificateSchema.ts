import { z } from "zod";
import { BaseCertificateSchema } from "../base/CertificateSchema";
import { generateRandomId } from "../../Identity";

export const CertificateSchema = BaseCertificateSchema.extend({
  id: z
    .string()
    .optional()
    .default(() => generateRandomId("cert-")), // Extended: Internal ID for UI behavior
});
