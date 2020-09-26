const apiRequest = require("../helpers/apiRequest");

module.exports = function Creator(baseUrl, headers) {
    return {
        get: async (text, page, size) => {
            return apiRequest(`${baseUrl}/search?text=${text}&page=${page}&size=${size}`, {
                method: "GET",
                headers,
            })
        }
    }

};
