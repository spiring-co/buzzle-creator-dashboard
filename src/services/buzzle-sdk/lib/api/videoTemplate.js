const apiRequest = require("../helpers/apiRequest");

module.exports = function VideoTemplate(baseUrl, headers) {
  return {
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
