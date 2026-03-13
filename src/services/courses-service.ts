import api from "@/lib/axiosInstance";
import { ApiResponse } from "@/schemas/response-schema";

import {
  CourseListItem,
  CourseDetails,
} from "@/schemas/courses-schema";

export class CoursesService {

  static async getAllCourses(): Promise<ApiResponse<CourseListItem[]>> {
    const res = await api.get<ApiResponse<CourseListItem[]>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses`
    );

    return res.data;
  }

  static async getCourseById(id: number): Promise<ApiResponse<CourseDetails>> {
    const res = await api.get<ApiResponse<CourseDetails>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`
    );

    return res.data;
  }

}