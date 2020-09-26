const apiRequest = require("../helpers/apiRequest");

module.exports = function VideoTemplate(baseUrl, headers) {
  return {
    getAll: async (page, size) => {
      return apiRequest(`${baseUrl}/videoTemplates?page=${page}&size=${size}`, {
        method: "GET",
        headers,
      });
    },
    get: async (id) => {
      return apiRequest(`${baseUrl}/videoTemplates/${id}`, {
        method: "GET",
        headers,
      });
    },

    create: async (data) => {
      return apiRequest(`${baseUrl}/videoTemplates`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
    },

    update: async (id, data) => {
      return apiRequest(`${baseUrl}/videoTemplates/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
    },

    delete: async (id) => {
      return apiRequest(`${baseUrl}/videoTemplates/${id}`, {
        method: "DELETE",
        headers,
      });
    },
  };
};
