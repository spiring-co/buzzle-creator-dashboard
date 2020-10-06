import apiRequest from "../helpers/apiRequest";
import { JobInterface } from "../interfaces";
export default function Job(baseUrl: String, headers: Object): JobInterface {
  return {
    getAll: async (page, size, query) => {
      return apiRequest(`${baseUrl}/jobs?page=${page}&size=${size}&${query}`, {
        method: "GET",
        headers,
      });
    },

    get: async (id, populateVideoTemplate) => {
      return apiRequest(
        `${baseUrl}/jobs/${id}?populateVideoTemplate=${populateVideoTemplate}`,
        { method: "GET", headers }
      );
    },

    create: async ({
      actions,
      data,
      idVideoTemplate,
      idVersion,
      renderPrefs,
    }) => {
      return apiRequest(`${baseUrl}/jobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          actions,
          data,
          idVideoTemplate,
          idVersion,
          renderPrefs,
        }),
      });
    },

    update: async (id, { actions, data, renderPrefs }) => {
      return apiRequest(`${baseUrl}/jobs/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ actions, data, renderPrefs }),
      });
    },

    updateMultiple: async (data) => {
      await Promise.all(
        data.map(({ id, actions, data, renderPrefs }) =>
          apiRequest(`${baseUrl}/jobs/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ actions, data, renderPrefs }),
          })
        )
      );
    },

    delete: async (id) => {
      return apiRequest(`${baseUrl}/jobs/${id}`, {
        method: "DELETE",
        headers,
      });
    },
    deleteMultiple: async (data) => {
      await Promise.all(
        data.map(({ id }) =>
          apiRequest(`${baseUrl}/jobs/${id}`, {
            method: "DELETE",
            headers,
          })
        )
      );
    },
  };
}
