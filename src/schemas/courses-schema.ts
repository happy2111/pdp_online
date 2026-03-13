import { z } from "zod";

export const CourseLevelEnum = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
]);

export type CourseLevelEnum = z.infer<typeof CourseLevelEnum>;

export const CourseLevelLabels: Record<CourseLevelEnum, string> = {
  BEGINNER: "courses.level.beginner",
  INTERMEDIATE: "courses.level.intermediate",
  ADVANCED: "courses.level.advanced",
}


export const CourseListItemSchema = z.object({
  id: z.number(),
  slug: z.string(),

  title: z.string(),
  short_description: z.string(),

  thumbnail_url: z.string().url(),

  level: CourseLevelEnum,
  language: z.string(),

  duration_hours: z.number(),

  is_free: z.boolean(),

  rating_avg: z.number(),
  enrolled_count: z.number(),

  category_id: z.number(),
  category_name: z.string(),

  teacher_id: z.number().nullable(),
  teacher_full_name: z.string(),
});

export const CoursesListSchema = z.array(CourseListItemSchema);

export type CourseListItem = z.infer<typeof CourseListItemSchema>;


export const CourseDetailsSchema = z.object({
  id: z.number(),
  slug: z.string(),

  title: z.string(),
  short_description: z.string(),
  description: z.string(),

  thumbnail_url: z.string().url(),

  preview_video_url: z.string().nullable(),

  level: CourseLevelEnum,
  language: z.string(),

  duration_hours: z.number(),

  rating_avg: z.number(),
  enrolled_count: z.number(),

  category_id: z.number(),
  category_name: z.string(),

  teacher_id: z.number(),
  teacher_full_name: z.string(),
  teacher_title: z.string(),

  requirements: z.array(z.string()),
  learning_outcomes: z.array(z.string()),
});

export type CourseDetails = z.infer<typeof CourseDetailsSchema>;