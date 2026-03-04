import {z} from "zod";

export const LevelValues = z.enum(["beginner", "intermediate", "advanced"]);
export type LevelValues = z.infer<typeof LevelValues>

export const LevelValuesLabels: Record<LevelValues, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export const StatusValues = z.enum(["draft", "published"]);
export type StatusValues = z.infer<typeof StatusValues>

export const StatusValuesLabels: Record<StatusValues, string> = {
  draft: "Draft",
  published: "Published",
}

export const CoursesSchema = z.object(
  {
    id: z.string(),
    teacher_id: z.string(),
    category_id: z.string(),
    slug: z.string(),
    title: z.string(),
    short_description: z.string(),
    description: z.string(),
    thumbnail_url: z.string(),
    preview_video_url: z.string().nullable(),
    level: z.string(),
    language: z.string(),
    duration_hours: z.number(),
    status: StatusValues,
    is_free: z.boolean(),
    rating_avg: z.number(),
    enrolled_count: z.number().nullable(),
    requirements: z.array(z.string()),
    learning_outcomes: z.array(z.string()),
    published_at: z.string().nullable(),
    created_at: z.string(),
  }
)