import api from "@/lib/axiosInstance";
import {
  ApiResponse,
  ApiResponseItems,
  BaseResponse,
  Pagination,
} from "@/schemas/response-schema";
import {
  SponsorResponse,
  CreateSponsorRequest,
  UpdateSponsorRequest,
  LogoPresignRequest,
  PresignResponse,
  GetSponsorsParams,
  SponsorListItem,
} from "@/schemas/sponsors-schema";

export class SponsorsService {
  static async getAllSponsors(
    params?: GetSponsorsParams
  ): Promise<Pagination<ApiResponseItems<SponsorListItem[]>>> {
    const res = await api.get<Pagination<ApiResponseItems<SponsorListItem[]>>>(
      `${process.env.NEXT_PUBLIC_API_URL}/sponsors`,
      {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 10,
        },
      }
    );
    return res.data;
  }

  static async getSponsorById(
    id: number
  ): Promise<ApiResponse<SponsorResponse>> {
    const res = await api.get<ApiResponse<SponsorResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/sponsors/${id}`
    );
    return res.data;
  }

  static async createSponsor(
    dto: CreateSponsorRequest
  ): Promise<ApiResponse<SponsorResponse>> {
    const res = await api.post<ApiResponse<SponsorResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/sponsors/create`,
      dto
    );
    return res.data;
  }

  static async updateSponsor(
    id: number,
    dto: UpdateSponsorRequest
  ): Promise<BaseResponse> {
    const res = await api.patch<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/sponsors/${id}/edit`,
      dto
    );
    return res.data;
  }
  static async deleteSponsor(id: number): Promise<BaseResponse> {
    const res = await api.delete<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/sponsors/${id}/delete`
    );
    return res.data;
  }

  static async getLogoPresignUrl(
    id: number,
    dto: LogoPresignRequest
  ): Promise<ApiResponse<PresignResponse>> {
    const res = await api.post<ApiResponse<PresignResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL}/sponsors/${id}/logo/presign`,
      dto
    );
    return res.data;
  }

  static async confirmLogoUpload(
    id: number,
    key: string
  ): Promise<BaseResponse> {
    const res = await api.post<BaseResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/sponsors/${id}/logo/confirm`,
      null,
      { params: { key } }
    );
    return res.data;
  }

  static async uploadLogo(id: number, file: File): Promise<BaseResponse> {
    try {
      if (!file) throw new Error("File not selected");
      if (!file.type.startsWith("image/"))
        throw new Error("Only images allowed");

      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) throw new Error("File too large (max 10MB)");

      // Prepare filename
      const fileExtension = file.name.split(".").pop();
      const cleanBaseName = file.name
        .split(".")
        .slice(0, -1)
        .join(".")
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-]/g, "");

      const filename = `${cleanBaseName}_${Date.now()}.${fileExtension}`;

      // 1. Get presign URL
      const presign = await this.getLogoPresignUrl(id, { filename });

      if (!presign?.data?.upload_url || !presign?.data?.key) {
        throw new Error("Failed to get presign URL");
      }

      // 2. Upload file directly to S3
      const uploadRes = await fetch(presign.data.upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": presign.data.content_type },
      });

      if (!uploadRes.ok) {
        throw new Error(`S3 upload error: ${uploadRes.status}`);
      }

      // 3. Confirm upload to backend
      return await this.confirmLogoUpload(id, presign.data.key);
    } catch (error: any) {
      console.error("uploadLogo error:", error);
      throw error;
    }
  }
}

