import api from "@/lib/axiosInstance";
import { ApiResponse, BaseResponse } from "@/schemas/response-schema";
import {
  ProgressHeartbeatRequest,
} from "@/schemas/lesson-progress";

export class ProgressService {
  static async sendHeartbeat(dto: ProgressHeartbeatRequest): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/progress/heartbeat`,
      dto
    );
    return res.data;
  }

  static async getLessonProgress(lessonId: number): Promise<ApiResponse<number>> {
    const res = await api.get<ApiResponse<number>>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/progress/lesson/${lessonId}`
    );
    return res.data;
  }
}