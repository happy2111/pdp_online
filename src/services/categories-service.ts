import api from "@/lib/axiosInstance";
import {ApiResponse} from "@/schemas/response-schema";
import {
  CategoriesResponse,
} from "@/schemas/categories-schema";

export class CategoriesService {
  static async getAllCategories(): Promise<ApiResponse<CategoriesResponse>> {
    const res = await api.get<ApiResponse<CategoriesResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
    return res.data;
  }
}
