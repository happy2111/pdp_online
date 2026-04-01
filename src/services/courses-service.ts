import api from "@/lib/axiosInstance";
import {
  ApiResponse,
  ApiResponseItems, BaseResponse,
  Pagination
} from "@/schemas/response-schema";

import {
  CourseListItem,
  CourseDetails, GetAllCoursesParams, WithPagination, CreateCourseSchema,
  CreateCourseRequest, GetMyCoursesParams, ThumbnailPresignRequest,
  ThumbnailPresignResponse, UpdateCourseRequest,
} from "@/schemas/courses-schema";

export class CoursesService {

  static async create(dto: CreateCourseRequest): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(`${process.env.NEXT_PUBLIC_API_URL}/courses/create`, dto)
    return res.data
  }

  static async getMyCourses(
    params?: GetMyCoursesParams
  ): Promise<Pagination<ApiResponseItems<CourseListItem[]>>> {
    const res = await api.get<Pagination<ApiResponseItems<CourseListItem[]>>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/my`,
      {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      }
    );

    return res.data;
  }

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


  static async getThumbnailPresignUrl(
    slug: string,
    dto: ThumbnailPresignRequest
  ): Promise<ApiResponse<ThumbnailPresignResponse>> {
    const res = await api.post<ApiResponse<ThumbnailPresignResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/thumbnail/presign`,
      dto
    );
    return res.data;
  }

  static async confirmThumbnail(slug: string, key: string): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/thumbnail/confirm`,
      null,
      { params: { key } }
    );
    return res.data;
  }

  static async uploadThumbnail(slug: string, file: File): Promise<BaseResponse> {
    try {
      if (!file) throw new Error('Файл не выбран');
      if (!file.type.startsWith('image/')) throw new Error('Можно загружать только изображения');

      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) throw new Error('Файл слишком большой (макс 10MB)');

      // Подготовка имени файла
      const fileExtension = file.name.split('.').pop();
      const cleanBaseName = file.name
        .split('.')
        .slice(0, -1)
        .join('.')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_\-]/g, '');

      const filename = `${cleanBaseName}_${Date.now()}.${fileExtension}`;

      // 1. Получаем URL для загрузки
      const presign = await this.getThumbnailPresignUrl(slug, { filename });

      if (!presign?.data?.upload_url || !presign?.data?.key) {
        throw new Error('Ошибка получения presign URL');
      }

      // 2. Загружаем файл напрямую в S3 (используем fetch, чтобы не мешать заголовки axios)
      const uploadRes = await fetch(presign.data.upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': presign.data.content_type,
        }
      });

      if (!uploadRes.ok) {
        throw new Error(`Ошибка загрузки в S3: ${uploadRes.status}`);
      }

      // 3. Сообщаем бэкенду, что файл успешно загружен
      return await this.confirmThumbnail(slug, presign.data.key);

    } catch (error: any) {
      console.error('uploadThumbnail error:', error);
      throw error;
    }
  }

  static async updateCourse(
    slug: string,
    dto: UpdateCourseRequest
  ): Promise<BaseResponse> {
    const res = await api.patch<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/edit`, dto
    );

    return res.data;
  }


  static async UploadPreviewVideo(
    slug: string,
    file: File
  ): Promise<ThumbnailPresignResponse> {
    try {
      if (!file) throw new Error('Файл не выбран');
      if (!file.type.startsWith('video/')) throw new Error('Можно загружать только видео');

      const fileExtension = file.name.split('.').pop();
      const cleanBaseName = file.name
        .split('.')
        .slice(0, -1)
        .join('.')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_\-]/g, '');

      const filename = `${cleanBaseName}_${Date.now()}.${fileExtension}`;

      const res = await api.post<ApiResponse<ThumbnailPresignResponse>>(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/video/presign`,
        { filename }
      );

      if (!res.data?.data?.upload_url || !res?.data?.data?.key) {
        throw new Error('Ошибка получения presign URL для видео');
      }

      const presignData = res.data.data;

      const uploadRes = await fetch(presignData.upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': presignData.content_type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error(`Ошибка загрузки видео в S3: ${uploadRes.status}`);
      }

      return presignData;

    } catch (error: any) {
      console.error('getPreviewVideoPresignUrl error:', error);
      throw error;
    }
  }

  static async publishCourse(
    slug: string
  ) : Promise<BaseResponse>{
    const res = await api.patch<BaseResponse>(`${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}/publish`, )
    return res.data
  }
}