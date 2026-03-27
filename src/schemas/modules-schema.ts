import { z } from "zod";

export const LessonSchema = z.object({
  lesson_id: z.number(),
  title: z.string(),
});

export const CourseModuleSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  sort_order: z.number(),
  is_free_preview: z.boolean(),
  course_id: z.number(),
  lessons: z.array(LessonSchema),
});

export const CourseModulesListSchema = z.array(CourseModuleSchema);

export type Lesson = z.infer<typeof LessonSchema>;
export type CourseModule = z.infer<typeof CourseModuleSchema>;