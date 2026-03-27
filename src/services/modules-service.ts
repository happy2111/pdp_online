import api from "@/lib/axiosInstance";
import {
  ApiResponse,
} from "@/schemas/response-schema";

import { CourseModule } from "@/schemas/modules-schema";

export class ModulesService {

  static async getCourseModules(slug: string): Promise<ApiResponse<CourseModule[]>> {
    const res = await api.get<ApiResponse<CourseModule[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/modules`
    );

    return res.data;
  }
}