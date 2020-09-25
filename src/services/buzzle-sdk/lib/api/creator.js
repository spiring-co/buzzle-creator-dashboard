const apiRequest = require("../helpers/apiRequest");

module.exports = function Creator(baseUrl, headers) {
  return {

    getAll: async (page, size) => {
      return apiRequest(`${baseUrl}/creators?page=${page}&size=${size}`, {
        method: "GET",
        headers,
      });
    },
    get: async (id) => {
      return apiRequest(`${baseUrl}/creators/${id}`, {
        method: "GET",
        headers,
      });
    },

    create: async (user) => {
      return apiRequest(`${baseUrl}/creators`, {
        method: "POST",
        headers,
        body: JSON.stringify(user),
      });
    }, changePassword: async (id, data) => {
      return apiRequest(`${baseUrl}/creators/${id}/changePassword`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
    },

    update: async (id, data) => {
      return apiRequest(`${baseUrl}/creators/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
    },
    getVideoTemplates: async (id, page, size) => {
      return apiRequest(`${baseUrl}/creators/${id}/videoTemplates?page=${page}&size=${size}`, {
        method: "GET",
        headers,
      });
    },
    getJobs: async (id, page, size) => {
      return apiRequest(`${baseUrl}/creators/${id}/jobs?page=${page}&size=${size}`, {
        method: "GET",
        headers,
      });
    },


  };
};
