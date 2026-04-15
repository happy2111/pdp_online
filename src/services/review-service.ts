import {
  CreateReviewRequest,
  UpdateReviewRequest,
  CourseReviewPage,
  CourseReviewPageSchema
} from "@/schemas/review-schema";
import { BaseResponse } from "@/schemas/response-schema";
import api from "@/lib/axiosInstance";

export const ReviewsService = {
  create: async (courseId: number, data: CreateReviewRequest): Promise<BaseResponse> => {
    const res = await api.post(`/reviews/${courseId}/create`, data);
    return res.data;
  },

  update: async (reviewId: number, data: UpdateReviewRequest): Promise<BaseResponse> => {
    const res = await api.put(`/reviews/${reviewId}/update`, data);
    return res.data;
  },

  delete: async (reviewId: number): Promise<BaseResponse> => {
    const res = await api.delete(`/reviews/${reviewId}/delete`);
    return res.data;
  },

  getByCourse: async (
    courseId: number,
    page: number = 0,
    size: number = 10
  ): Promise<CourseReviewPage> => {
    const res = await api.get(`/reviews/course/${courseId}`, {
      params: { page, size }
    });
    return CourseReviewPageSchema.parse(res.data);
  },

  markHelpful: async (reviewId: number): Promise<BaseResponse> => {
    const res = await api.post(`/reviews/${reviewId}/helpful`);
    return res.data;
  },
};