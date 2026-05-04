import { ContactSchemaType, ContactResponseType } from "@/schemas/contact-schema";
import {ApiResponse, BaseResponse} from "@/schemas/response-schema";
import api from "@/lib/axiosInstance";

export const contactService = {
  create: async (data: ContactSchemaType): Promise<BaseResponse> => {
    const response = await api.post<BaseResponse>(
      "/contact",
      data
    );
    return response.data;
  },
};

