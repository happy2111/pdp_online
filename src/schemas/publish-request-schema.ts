import { z } from "zod";

export const PublishRequestStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export type PublishRequestStatus = z.infer<typeof PublishRequestStatusEnum>;

export const PublishRequestStatusLabels: Record<PublishRequestStatus, string> = {
  PENDING: "courses.settings.publishRequest.status.pending",
  APPROVED: "courses.settings.publishRequest.status.approved",
  REJECTED: "courses.settings.publishRequest.status.rejected",
};

export const CoursePublishRequestSchema = z.object({
  id: z.number(),
  course_id: z.number(),
  course_slug: z.string(),
  course_title: z.string(),
  course_status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  status: PublishRequestStatusEnum,
  admin_comment: z.string().nullable().optional(),
  reviewed_at: z.string().nullable().optional(),
  created_at: z.string(),
});

export type CoursePublishRequest = z.infer<typeof CoursePublishRequestSchema>;

export interface GetMyPublishRequestsParams {
  page?: number;
  size?: number;
}
