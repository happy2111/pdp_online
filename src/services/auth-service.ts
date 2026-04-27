import {
  AuthResponse,
  LoginSchema, LoginSchemaType,
  RegisterSchema,
  RegisterSchemaType, VerifyCodeSchemaType
} from "@/schemas/auth-schema";
import {ApiResponse, BaseResponse} from "@/schemas/response-schema";
import api from "@/lib/axiosInstance";

export class AuthService  {
    static async login(data: LoginSchemaType): Promise<ApiResponse<AuthResponse>> {
        const res = await api.post<ApiResponse<AuthResponse>>(`/auth/login`, data)
        return res.data;
    }

    static async register(data: RegisterSchemaType): Promise<ApiResponse<AuthResponse>> {
      const res = await api.post<ApiResponse<AuthResponse>>(`/auth/register`, data)
      return res.data
    }

  static async sendCode(): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(
      `/auth/send-code`, null,
    );
    return res.data;
  }

  static async verifyCode(data: VerifyCodeSchemaType): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(
      `/auth/verify-code`,
      null,
      { params: { code: data.code } }
    );
    return res.data;
  }

  static async refresh(): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post<ApiResponse<AuthResponse>>(`/auth/refresh`);
    return res.data;
  }
}