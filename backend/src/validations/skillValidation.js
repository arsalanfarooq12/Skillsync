// this creates a schema which defines what type of data our backend is expecting
import { z } from "zod";

export const createSkillSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title is too long"),
  description: z
    .string()
    .min(10, "Description should be a bit more detailed (min 10 chars)")
    .max(500),
  category: z.enum(["Programming", "Music", "Design", "Language", "Other"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
});
