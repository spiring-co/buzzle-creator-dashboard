import apiRequest from "../helpers/apiRequest";
import { FontInterface } from "../interfaces";

export default function Font(baseUrl: String, headers: Object): FontInterface {
  return {
    get: async (name) => {
      return apiRequest(`${process.env.REACT_APP_API_URL}/fonts?name=${name}`, {
        method: "GET",
        headers,
      });
    },

    create: async (data) => {
      return apiRequest(`${baseUrl}/fonts`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
    },
  };
}
