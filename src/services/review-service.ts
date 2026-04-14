import {
  CreateReviewRequest,
  UpdateReviewRequest,
  CourseReview,
  CourseReviewsListSchema,
} from "@/schemas/review-schema";
import {BaseResponse} from "@/schemas/response-schema";
import api from "@/lib/axiosInstance";

export const reviewApi = {
  create: async (courseId: number, data: CreateReviewRequest) => {
    const res = await api.post(`/api/reviews/${courseId}/create`, data);
    return res.data as BaseResponse;
  },

  update: async (reviewId: number, data: UpdateReviewRequest) => {
    const res = await api.put(`/api/reviews/${reviewId}/update`, data);
    return res.data as BaseResponse;
  },

  delete: async (reviewId: number) => {
    const res = await api.delete(`/api/reviews/${reviewId}/delete`);
    return res.data;
  },

  getByCourse: async (courseId: number): Promise<CourseReview[]> => {
    const res = await api.get(`/api/reviews/course/${courseId}`);
    return CourseReviewsListSchema.parse(res.data);
  },

  markHelpful: async (reviewId: number) => {
    const res = await api.post(`/api/reviews/${reviewId}/helpful`);
    return res.data as BaseResponse;
  },
};