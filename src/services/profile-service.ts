import {ApiResponse} from "@/schemas/response-schema";
import {
  AvatarPresignRequest,
  AvatarPresignResponse,
  ProfileResponse,
  UpdateProfileRequest
} from "@/schemas/profile-schema";
import api from "@/lib/axiosInstance";

export class ProfileService {
  static async getProfile(): Promise<ApiResponse<ProfileResponse>> {
    const res = await api.get<ApiResponse<ProfileResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/profile`)
    return res.data
  }

  static async updateProfile(dto: UpdateProfileRequest): Promise<ApiResponse<ProfileResponse>> {
    const res = await api.put<ApiResponse<ProfileResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/profile`, dto)
    return res.data
  }


  static async getAvatarPresignUrl(dto: AvatarPresignRequest): Promise<AvatarPresignResponse> {
    const res = await api.post<AvatarPresignResponse>(`${process.env.NEXT_PUBLIC_API_URL}/profile/avatar/presign`, dto)
    return res.data
  }

  static async confirmAvatar(key: string) {
    const res = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/profile/avatar/confirm`, null, {
      params: {key}
    })

    return res.data
  }

  static async uploadAvatar(file: File) {
    try {
      if (!file) {
        throw new Error('Файл не выбран')
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения')
      }

      const MAX_SIZE = 15 * 1024 * 1024
      if (file.size > MAX_SIZE) {
        throw new Error('Файл слишком большой (макс 5MB)')
      }

      const presign = await this.getAvatarPresignUrl({
        filename: file.name,
      })

      if (!presign?.upload_url || !presign?.key) {
        throw new Error('Ошибка получения presign URL')
      }

      const uploadRes = await fetch(presign.upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': presign.content_type,
        }
      })

      if (!uploadRes.ok) {
        throw new Error(`Ошибка загрузки в S3: ${uploadRes.status}`)
      }

      return await this.confirmAvatar(presign.key)

    } catch (error: any) {
      console.error('uploadAvatar error:', error)
      throw error
    }
  }
}