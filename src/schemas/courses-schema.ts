import { z } from "zod";

export const LANGUAGES = [
  { value: "UZ", label: "O'zbek" },
  { value: "RU", label: "Русский" },
  { value: "EN", label: "English" },
]

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

export const CourseStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export type CourseStatusEnum = z.infer<typeof CourseStatusEnum>;

export const CourseStatusLabels: Record<CourseStatusEnum, string> = {
  DRAFT: "courses.status.draft",
  PUBLISHED: "courses.status.published",
  ARCHIVED: "courses.status.archived",
}

export const CourseListItemSchema = z.object({
  id: z.number(),
  slug: z.string(),

  title: z.string(),
  short_description: z.string(),

  thumbnail_url: z.url(),

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

  price: z.number().nullable(),

  duration_hours: z.number(),

  rating_avg: z.number(),
  enrolled_count: z.number(),

  category_id: z.number(),
  category_name: z.string(),

  status: CourseStatusEnum,

  teacher_id: z.number(),
  teacher_full_name: z.string(),
  teacher_title: z.string(),

  requirements: z.array(z.string()),
  learning_outcomes: z.array(z.string()),
});

export type CourseDetails = z.infer<typeof CourseDetailsSchema>;

export interface GetMyCoursesParams {
  page?: number;
  size?: number;
}

export interface GetAllCoursesParams {
  category_id?: number;
  search?: string;
  page?: number;
  size?: number;
}

export const CreateCourseSchema = z.object({
  category_id: z.number(),
  title: z.string().min(3, "Title is too short"),
  short_description: z.string().max(255),
  description: z.string(),
  level: CourseLevelEnum,
  language: z.string(),
  requirements: z.array(z.string()),
  learning_outcomes: z.array(z.string()),
  price: z.number().nonnegative().optional(),
});

export type CreateCourseRequest = z.infer<typeof CreateCourseSchema>;


export const ThumbnailPresignRequestSchema = z.object({
  filename: z.string(),
});

export type ThumbnailPresignRequest = z.infer<typeof ThumbnailPresignRequestSchema>;

export const ThumbnailPresignResponseSchema = z.object({
  upload_url: z.string(),
  key: z.string(),
  content_type: z.string(),
});

export type ThumbnailPresignResponse = z.infer<typeof ThumbnailPresignResponseSchema>;


export type WithPagination<T> = T & { page_size: number, total_elements: number, total_pages: number, current_page: number };


export const UpdateCourseSchema = z.object({
  category_id: z.number().optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  level: CourseLevelEnum.optional(),
  language: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  learning_outcomes: z.array(z.string()).optional(),
  price: z.number().optional(),
  status: CourseStatusEnum.optional(),
});

export type UpdateCourseRequest = z.infer<typeof UpdateCourseSchema>;