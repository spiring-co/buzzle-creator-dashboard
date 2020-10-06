import apiRequest from "../helpers/apiRequest";
import { SearchInterface } from "../interfaces";
export default function Creator(
  baseUrl: String,
  headers: Object
): SearchInterface {
  return {
    get: async (text, page, size) => {
      return apiRequest(
        `${baseUrl}/search?q=${text}&page=${page}&size=${size}`,
        {
          method: "GET",
          headers,
        }
      );
    },
    getJobs: async (text, page, size) => {
      return apiRequest(
        `${baseUrl}/search/jobs?q=${text}&page=${page}&size=${size}`,
        {
          method: "GET",
          headers,
        }
      );
    },
    getVideoTemplates: async (text, page, size) => {
      return apiRequest(
        `${baseUrl}/search/videoTemplates?q=${text}&page=${page}&size=${size}`,
        {
          method: "GET",
          headers,
        }
      );
    },
    getCreators: async (text, page, size) => {
      return apiRequest(
        `${baseUrl}/search/creators?q=${text}&page=${page}&size=${size}`,
        {
          method: "GET",
          headers,
        }
      );
    },
  };
}
