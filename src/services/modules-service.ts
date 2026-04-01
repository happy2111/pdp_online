import api from "@/lib/axiosInstance";
import { ApiResponse, BaseResponse } from "@/schemas/response-schema";
import { CourseModule, CreateModuleRequest, UpdateModuleRequest } from "@/schemas/modules-schema";

export class ModulesService {

  static async getCourseModules(slug: string): Promise<ApiResponse<CourseModule[]>> {
    const res = await api.get<ApiResponse<CourseModule[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/modules`
    );
    return res.data;
  }

  static async createModule(
    courseId: number,
    dto: CreateModuleRequest
  ): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/modules/create`,
      dto
    );
    return res.data;
  }

  static async updateModule(
    moduleId: number,
    dto: UpdateModuleRequest
  ): Promise<BaseResponse> {
    const res = await api.patch<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/modules/${moduleId}/edit`,
      dto
    );
    return res.data;
  }

  static async deleteModule(moduleId: number): Promise<BaseResponse> {
    const res = await api.delete<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/modules/${moduleId}/delete`
    );
    return res.data;
  }
}