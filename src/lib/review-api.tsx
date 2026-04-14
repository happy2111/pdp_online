// lib/review-api.ts
import {
  CreateReviewRequest,
  UpdateReviewRequest,
  CourseReview,
} from "@/schemas/review-schema";
import api from "@/lib/axiosInstance";

export const reviewApi = {
  create: async (courseId: number, data: CreateReviewRequest) => {
    const res = await api.post(`/api/reviews/${courseId}/create`, data);
    return res.data;
  },

  update: async (reviewId: number, data: UpdateReviewRequest) => {
    const res = await api.put(`/api/reviews/${reviewId}/update`, data);
    return res.data;
  },

  delete: async (reviewId: number) => {
    const res = await api.delete(`/api/reviews/${reviewId}/delete`);
    return res.data;
  },

  getByCourse: async (courseId: number): Promise<CourseReview[]> => {
    const res = await api.get(`/api/reviews/course/${courseId}`);
    return res.data;
  },

  markHelpful: async (reviewId: number) => {
    const res = await api.post(`/api/reviews/${reviewId}/helpful`);
    return res.data;
  },
};