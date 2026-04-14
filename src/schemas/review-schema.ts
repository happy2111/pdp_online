import { z } from "zod";

// ======================
// ENUMS & CONSTANTS
// ======================

export const ReviewRatingEnum = z.number().int().min(1).max(5);

export type ReviewRating = z.infer<typeof ReviewRatingEnum>;

// ======================
// ENTITY SCHEMA
// ======================

export const CourseReviewSchema = z.object({
  id: z.number(),

  course: z.object({
    id: z.number(),
    // Можно добавить больше полей курса при необходимости
  }).nullable().optional(),

  user: z.object({
    id: z.number(),
    fullName: z.string().optional(), // или username, firstName + lastName
    avatarUrl: z.string().url().nullable().optional(),
  }).nullable().optional(),

  rating: ReviewRatingEnum,

  comment: z.string().nullable().optional(),

  isVerifiedPurchase: z.boolean().default(false),

  helpfulCount: z.number().int().nonnegative().default(0),

  createdAt: z.string().datetime().optional(), // ISO string от OffsetDateTime
  updatedAt: z.string().datetime().nullable().optional(),
});

export type CourseReview = z.infer<typeof CourseReviewSchema>;

// ======================
// REQUEST SCHEMAS (DTO)
// ======================

export const CreateReviewRequestSchema = z.object({
  rating: ReviewRatingEnum,
  comment: z.string().max(2000).optional().nullable(), // разумный лимит для комментария
});

export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;

export const UpdateReviewRequestSchema = z.object({
  rating: ReviewRatingEnum.optional(),
  comment: z.string().max(2000).optional().nullable(),
});

export type UpdateReviewRequest = z.infer<typeof UpdateReviewRequestSchema>;

// ======================
// RESPONSE TYPES
// ======================

export const CourseReviewsListSchema = z.array(CourseReviewSchema);

export type CourseReviewsList = z.infer<typeof CourseReviewsListSchema>;

// Если твой бэкенд возвращает пагинацию для отзывов в будущем, можешь использовать:
export type Pagination<T> = T & {
  page_size: number;
  total_elements: number;
  total_pages: number;
  current_page: number;
};

// ======================
// API RESPONSE WRAPPERS (согласуется с твоими примерами)
// ======================

export interface BaseResponse {
  code: number;
  message: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data: T;
}

export interface ApiResponseItems<T> {
  code: number;
  message: string;
  items: T;
}