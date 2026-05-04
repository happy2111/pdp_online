import api from "@/lib/axiosInstance";
import {ApiResponse} from "@/schemas/response-schema";
import {TeachersSchema} from "@/schemas/teachers-schema";

export class TeachersService {
  static async getAllTeachers(): Promise<ApiResponse<TeachersSchema[]>> {
    const res = await api.get<ApiResponse<TeachersSchema[]>>('/teachers');
    return res.data
  }
}