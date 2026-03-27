import {z} from "zod";

export const CourseModuleSchema = z.object({
  id: z.number(),
  title: z.string(),
  is_free_preview: z.boolean(),
  course_id: z.number(),
});

export type CourseModule = z.infer<typeof CourseModuleSchema>;