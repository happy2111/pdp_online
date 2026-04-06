import { z } from "zod";

export const VideoStatusEnum = z.enum([
  "UPLOADING",
  "UPLOADED",
  "PROCESSING",
  "TRANSCODING",
  "UPLOADED_HLS",
  "DONE",
  "FAILED"
]);

export const LessonType = z.enum([
  "VIDEO",
  "TEXT",
  "QUIZ",
  "PRACTICE",
  "FILE"
]);

export type VideoStatus = z.infer<typeof VideoStatusEnum>;
export type LessonTypeValue = z.infer<typeof LessonType>;

export const LessonResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  type: LessonType,
  content_text: z.string().nullable().optional(),
  content_url: z.string().nullable().optional(),
  duration_seconds: z.number().nullable().optional(),
  sort_order: z.number(),
  is_free_preview: z.boolean(),
  resources: z.record(z.string(), z.any()).nullable().optional(),
  video_status: VideoStatusEnum,
  created_at: z.string().datetime({ offset: true }),
});

export type LessonResponse = z.infer<typeof LessonResponseSchema>;

export const CreateLessonRequestSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(250),
  type: LessonType,
  content_text: z.string().optional(),
  is_free_preview: z.boolean().optional(),
  resources: z.record(z.string(), z.any()).optional(),
});

export type CreateLessonRequest = z.infer<typeof CreateLessonRequestSchema>;

export const UpdateLessonRequestSchema = z.object({
  title: z.string().optional(),
  type: LessonType.optional(),
  content_text: z.string().optional(),
  is_free_preview: z.boolean().optional(),
  resources: z.record(z.string(), z.any()).optional(),
});

export type UpdateLessonRequest = z.infer<typeof UpdateLessonRequestSchema>;

export const VideoPresignRequestSchema = z.object({
  filename: z.string(),
});

export type VideoPresignRequest = z.infer<typeof VideoPresignRequestSchema>;

export const PresignedUploadDataSchema = z.object({
  upload_url: z.string(),
  key: z.string(),
  content_type: z.string(),
});

export type PresignedUploadData = z.infer<typeof PresignedUploadDataSchema>;