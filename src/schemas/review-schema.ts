import { z } from "zod";

export const ReviewRatingEnum = z.number().int().min(1).max(5);
export type ReviewRating = z.infer<typeof ReviewRatingEnum>;

export const CourseReviewSchema = z.object({
  id: z.number(),
  rating: ReviewRatingEnum,
  comment: z.string().nullable().optional(),
  is_verified_purchase: z.boolean().default(false),
  helpful_count: z.number().int().nonnegative().default(0),
  username: z.string(),
  avatar_url: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
});

export type CourseReview = z.infer<typeof CourseReviewSchema>;

export const CourseReviewPageSchema = z.object({
  code: z.number(),
  message: z.string(),
  items: z.array(CourseReviewSchema),
  total_elements: z.number(),
  total_pages: z.number(),
  current_page: z.number(),
  page_size: z.number(),
});

export type CourseReviewPage = z.infer<typeof CourseReviewPageSchema>;

export const CreateReviewRequestSchema = z.object({
  rating: ReviewRatingEnum,
  comment: z.string().max(2000).optional().nullable(),
});
export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;

export const UpdateReviewRequestSchema = CreateReviewRequestSchema.partial();
export type UpdateReviewRequest = z.infer<typeof UpdateReviewRequestSchema>;