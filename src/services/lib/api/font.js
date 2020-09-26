const apiRequest = require("../helpers/apiRequest");

module.exports = function Font(baseUrl, headers) {
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
};
