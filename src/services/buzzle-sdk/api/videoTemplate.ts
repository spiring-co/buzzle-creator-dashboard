import {apiRequest} from "../helpers/apiRequest";
import { VideoTemplate as VideoTemplateType } from "../types";
import objectToQueryString from "../helpers/objectToQueryString";

export default function VideoTemplate(
  baseUrl: String,
  headers: HeadersInit
) {
  return {
    getAll: async (
      page: number,
      size: number,
      query: string,
      sortBy: string,
      orderBy: string,
      idCreator: string,
      extraParams?: Record<string, any>
    ): Promise<{ data: Array<VideoTemplateType | []>; count: number }> => {
      return apiRequest(
        `${baseUrl}/videoTemplates?page=${page}&size=${size}&sortBy=${sortBy}&orderBy=${orderBy}&${query}&${objectToQueryString(
          extraParams
        )}`,
        {
          method: "GET",
          headers,
        }
      );
    },
    get: async (id: string, query: string, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/videoTemplates/${id}?${query}&${objectToQueryString(
        extraParams
      )}`, {
        method: "GET",
        headers,
      });
    },

    create: async (data: Partial<VideoTemplateType>, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/videoTemplates?${objectToQueryString(
        extraParams
      )}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: Partial<VideoTemplateType>, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/videoTemplates/${id}?${objectToQueryString(
        extraParams
      )}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
    },
    updateMany: async (data: Partial<VideoTemplateType>, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/videoTemplates?${objectToQueryString(
        extraParams
      )}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/videoTemplates/${id}?${objectToQueryString(
        extraParams
      )}`, {
        method: "DELETE",
        headers,
      });
    },
    deleteMany: async (data: any, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/videoTemplates?${objectToQueryString(
        extraParams
      )}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify(data),
      });
    },
  };
}
