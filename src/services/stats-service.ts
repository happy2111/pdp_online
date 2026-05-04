import api from "@/lib/axiosInstance";
import {ApiResponse} from "@/schemas/response-schema";
import {StatsSchema} from "@/schemas/stats-scheam";

export const StatsService = {
  getStats: async (): Promise<ApiResponse<StatsSchema>> => {
    const res = await api.get<ApiResponse<StatsSchema>>('/stats');
    return res.data
  }
};