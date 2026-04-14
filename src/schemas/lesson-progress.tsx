import { z } from "zod";
import {ApiResponse} from "@/schemas/response-schema";

export const ProgressHeartbeatSchema = z.object({
  lessonId: z.number(),
  seconds: z.number().nonnegative(),
});

export type ProgressHeartbeatRequest = z.infer<typeof ProgressHeartbeatSchema>;

export type LessonProgressResponse = ApiResponse<number>;

export const EnrollmentProgressSchema = z.object({
  progress_pct: z.number(),
  last_lesson_id: z.number().nullable(),
  last_accessed_at: z.string().datetime().nullable(),
});

export type EnrollmentProgress = z.infer<typeof EnrollmentProgressSchema>;