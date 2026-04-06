import api from "@/lib/axiosInstance";
import { BaseResponse, ApiResponse } from "@/schemas/response-schema";
import {
  LessonResponse,
  CreateLessonRequest,
  UpdateLessonRequest,
  VideoPresignRequest,
  PresignedUploadData,
} from "@/schemas/lessons-schema";

export class LessonsService {

  static async getById(lessonId: number): Promise<ApiResponse<LessonResponse>> {
    const res = await api.get<ApiResponse<LessonResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/modules/${lessonId}`
    );
    return res.data;
  }

  static async create(moduleId: number, dto: CreateLessonRequest): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}/lessons/create`,
      dto
    );
    return res.data;
  }

  static async update(lessonId: number, dto: UpdateLessonRequest): Promise<BaseResponse> {
    const res = await api.patch<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/modules/lessons/${lessonId}/edit`,
      dto
    );
    return res.data;
  }

  static async delete(lessonId: number): Promise<BaseResponse> {
    const res = await api.delete<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/modules/lessons/${lessonId}/delete`
    );
    return res.data;
  }

  static async getVideoPresignUrl(
    lessonId: number,
    dto: VideoPresignRequest
  ): Promise<ApiResponse<PresignedUploadData>> {
    const res = await api.post<ApiResponse<PresignedUploadData>>(
      `${process.env.NEXT_PUBLIC_API_URL}/modules/lessons/${lessonId}/video/presign`,
      dto
    );
    return res.data;
  }

  static async uploadVideo(
    lessonId: number,
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<PresignedUploadData> {
    if (!file) throw new Error("Файл не выбран");
    if (!file.type.startsWith("video/")) throw new Error("Можно загружать только видео");

    const fileExtension = file.name.split(".").pop() || "mp4";
    const cleanBaseName = file.name
      .split(".").slice(0, -1).join(".")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-]/g, "");
    const filename = `${cleanBaseName}_${Date.now()}.${fileExtension}`;

    const presignRes = await this.getVideoPresignUrl(lessonId, { filename });
    const presignData = presignRes.data;

    if (!presignData?.upload_url || !presignData?.key) {
      throw new Error("Не удалось получить presigned URL");
    }

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Ошибка загрузки в S3: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Сетевая ошибка при загрузке")));
      xhr.addEventListener("abort", () => reject(new Error("Загрузка отменена")));

      xhr.open("PUT", presignData.upload_url);
      xhr.setRequestHeader("Content-Type", presignData.content_type || file.type);
      xhr.send(file);
    });

    return presignData;
  }

  static async getAccessToken(lessonId: number): Promise<ApiResponse<string>> {
    const res = await api.post<ApiResponse<string>>(
      `${process.env.NEXT_PUBLIC_API_URL}/modules/${lessonId}/access`
    );
    return res.data;
  }
}