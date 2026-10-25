import { z } from "zod";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.");

// Fields shared by the create and edit session forms
export const sessionFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required.").max(255, "Title is too long."),
    location: z.string().trim().min(1, "Location is required.").max(255, "Location is too long."),
    capacity: z
      .number("Enter the capacity.")
      .int("Capacity must be a whole number.")
      .min(1, "At least 1 spot.")
      .max(1000, "At most 1000 spots."),
    startTime: timeSchema,
    endTime: timeSchema,
  })
  // An end time earlier than the start time is allowed: the session ends the next day
  .refine((values) => values.startTime !== values.endTime, {
    path: ["endTime"],
    message: "End time must be different from the start time.",
  });

export type SessionFormValues = z.infer<typeof sessionFormSchema>;