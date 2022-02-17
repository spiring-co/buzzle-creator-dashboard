import { apiRequest } from "../helpers/apiRequest";
import { User as UserType } from "../types";
import objectToQueryString from "../helpers/objectToQueryString";

export default function User(
  baseUrl: String,
  headers: HeadersInit
) {
  return {
    getAll: async (page: number,
      size: number,
      extraParams?: Record<string, any>
    ): Promise<{ data: Array<UserType | []>; count: number }> => {
      return apiRequest(
        `${baseUrl}/users?page=${page}&size=${size}&${objectToQueryString(
          extraParams || {}
        )}`,
        {
          method: "GET",
          headers,
        }
      );
    },
    get: async (id: string, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/users/${id}?${objectToQueryString(
        extraParams || {}
      )}`, {
        method: "GET",
        headers,
      });
    },

    delete: async (id: string, data: Record<string, any>, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/users/${id}?${objectToQueryString(
        extraParams
      )}`, {
        method: "DELETE",
        headers,
        body: JSON.stringify(data),
      });
    },

    create: async (data: Partial<UserType>, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/users?${objectToQueryString(
        extraParams
      )}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: Partial<UserType>, extraParams?: Record<string, any>) => {
      return apiRequest(`${baseUrl}/users/${id}?${objectToQueryString(
        extraParams
      )}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
    },
  };
}
