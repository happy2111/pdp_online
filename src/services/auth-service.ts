import {AuthResponse, LoginSchema, RegisterSchema} from "@/schemas/auth-schema";
import {ApiResponse} from "@/schemas/response-schema";
import api from "@/lib/axiosInstance";

export class AuthService  {
    static async login(data: LoginSchema): Promise<ApiResponse<AuthResponse>> {
        const res = await api.post<ApiResponse<AuthResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data)
        return res.data;
    }

    static async register(data: RegisterSchema): Promise<ApiResponse<AuthResponse>> {
      const res = await api.post<ApiResponse<AuthResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data)
      return res.data
    }
}