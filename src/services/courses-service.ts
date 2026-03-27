import api from "@/lib/axiosInstance";
import {
  ApiResponse,
  ApiResponseItems,
  Pagination
} from "@/schemas/response-schema";

import {
  CourseListItem,
  CourseDetails, GetAllCoursesParams, WithPagination,
} from "@/schemas/courses-schema";

export class CoursesService {

  static async getAllCourses(
    params?: GetAllCoursesParams
  ): Promise<Pagination<ApiResponseItems<CourseListItem[]>>> {
    const res = await api.get<Pagination<ApiResponseItems<CourseListItem[]>>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses`,
      {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
          category_id: params?.category_id,
          search: params?.search,
        },
      }
    );

    return res.data;
  }

  static async getCourseBySlug(slug: string): Promise<ApiResponse<CourseDetails>> {
    const res = await api.get<ApiResponse<CourseDetails>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}`
    );

    return res.data;
  }

  static async getCourseModules(slug: string) {

  }

}