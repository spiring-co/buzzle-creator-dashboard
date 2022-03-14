import { apiRequest } from "../helpers/apiRequest";
import { Job as JobType, JobParam } from "../types";
import objectToQueryString from "../helpers/objectToQueryString";

export default function Job(baseUrl: String, headers: HeadersInit) {
  return {
    getAll: async (
      page: number,
      size: number,
      query: string,
      sortBy?: string,
      orderBy?: string,
      extraParams?: Record<string, any>
    ): Promise<{ data: Array<JobType | []>; count: number }> => {
      return apiRequest(
        `${baseUrl}/jobs?page=${page}&size=${size}&sortBy=${sortBy || "dateCreated"}&orderBy=${orderBy || "desc"}&${query}&${objectToQueryString(
          extraParams || {}
        )}`,
        { method: "GET", headers }

      );
    },

    get: async (id: string,
      query: string,
      extraParams?: Record<string, any>
    ): Promise<JobType | []> => {
      return apiRequest(
        `${baseUrl}/jobs/${id}?&${query}&${objectToQueryString(extraParams || {})}`,
        { method: "GET", headers }
      );
    },
    create: async ({
      actions,
      data,
      idVideoTemplate,
      idVersion,
      renderPrefs,
      extra,
      extraParams,
    }: JobParam) => {
    
      return apiRequest(`${baseUrl}/jobs${extraParams ? `?${objectToQueryString(extraParams || {})}` : ""}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          actions,
          data,
          idVideoTemplate,
          idVersion,
          renderPrefs,
          ...(extra ? { extra } : {}),
        }),
      });
    },

    update: async (id: string, data: Record<string, any>, extraParams?: Record<string, any>): Promise<any> => {
      return apiRequest(
        `${baseUrl}/jobs/${id}?${objectToQueryString(extraParams)}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        }
      );
    },

    updateMultiple: async (data: Record<string, any>, extraParams?: Record<string, any>): Promise<any> => {
      return apiRequest(`${baseUrl}/jobs?${objectToQueryString(extraParams)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string, extraParams?: Record<string, any>) => {
      return apiRequest(
        `${baseUrl}/jobs/${id}?${objectToQueryString(extraParams || {})}`,
        {
          method: "DELETE",
          headers,
        }
      );
    },
    deleteMultiple: async (data: Record<string, any>, extraParams?: Record<string, any>): Promise<any> => {
      return apiRequest(`${baseUrl}/jobs?${objectToQueryString(extraParams)}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify(data),
      });
    },
  };
}
