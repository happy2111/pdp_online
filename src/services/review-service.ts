// services/reviews-service.ts
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  CourseReview,
  CourseReviewsListSchema,
} from "@/schemas/review-schema";
import { BaseResponse } from "@/schemas/response-schema";
import api from "@/lib/axiosInstance";

export const ReviewsService = {
  create: async (courseId: number, data: CreateReviewRequest) => {
    const res = await api.post(`/reviews/${courseId}/create`, data);
    return res.data as BaseResponse;
  },

  update: async (reviewId: number, data: UpdateReviewRequest) => {
    const res = await api.put(`/reviews/${reviewId}/update`, data);
    return res.data as BaseResponse;
  },

  delete: async (reviewId: number) => {
    const res = await api.delete(`/reviews/${reviewId}/delete`);
    return res.data;
  },

  getByCourse: async (courseId: number): Promise<CourseReview[]> => {
    const res = await api.get(`/reviews/course/${courseId}`);
    return CourseReviewsListSchema.parse(res.data);
  },

  markHelpful: async (reviewId: number) => {
    const res = await api.post(`/reviews/${reviewId}/helpful`);
    return res.data as BaseResponse;
  },
};