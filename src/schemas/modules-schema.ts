import { z } from "zod";

export const LessonTitleSchema = z.object({
  lesson_id: z.number(),
  title: z.string(),
});

export type LessonTitle = z.infer<typeof LessonTitleSchema>;

export const CourseModuleSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  sort_order: z.number(),
  is_free_preview: z.boolean(),
  course_id: z.number(),
  lessons: z.array(LessonTitleSchema),
});

export const CourseModulesListSchema = z.array(CourseModuleSchema);

export type CourseModule = z.infer<typeof CourseModuleSchema>;

export const CreateModuleSchema = z.object({
  title: z.string().min(1).max(250),
  description: z.string().optional(),
  isFreePreview: z.boolean().optional(),
});

export type CreateModuleRequest = z.infer<typeof CreateModuleSchema>;

export const UpdateModuleSchema = z.object({
  title: z.string().max(250).optional(),
  description: z.string().optional(),
  isFreePreview: z.boolean().optional(),
});

export type UpdateModuleRequest = z.infer<typeof UpdateModuleSchema>;