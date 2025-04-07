import { z } from "zod";

export const newShareSchema = z.object({
  title: z.string().max(100, "Title is too long").optional(),
  content: z
    .string()
    .min(2, "Content is too short")
    .max(1000, "Content is too long"),
  availableUntil: z.string(),
  ephemeral: z.boolean().default(false),
});
