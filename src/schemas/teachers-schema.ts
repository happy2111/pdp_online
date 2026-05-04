import {z} from "zod";

export const TeachersSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  avatar_url: z.string(),
  experience_year: z.number(),
  department: z.string(),
})

export type TeachersSchema = z.infer<typeof TeachersSchema>