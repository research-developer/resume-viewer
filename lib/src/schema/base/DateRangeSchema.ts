import { z } from "zod";

const iso8601Regex =
  /^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/;

function transformDateStringToDate(dateString: string | undefined) {
  if (dateString === undefined || dateString === "") {
    return undefined;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return date;
}

export const BaseDateRangeSchema = z.object({
  startDate: z
    .string()
    .regex(iso8601Regex, "Must be a valid ISO8601 date")
    .optional()
    .transform(transformDateStringToDate),
  endDate: z
    .string()
    .regex(iso8601Regex, "Must be a valid ISO8601 date")
    .optional()
    .transform(transformDateStringToDate),
});
