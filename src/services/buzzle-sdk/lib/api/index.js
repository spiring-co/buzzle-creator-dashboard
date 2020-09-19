const Job = require("./job");
const Font = require("./font");
const Creator = require("./creator");
const VideoTemplate = require("./videoTemplate");

/**
 * @param  {} baseUrl API URl
 * @param  {} authToken JWT token for auth
 */
module.exports = function Api({ baseUrl, authToken }) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `bearer ${authToken}`,
  };

  return {
    Job: Job(baseUrl, headers),
    Font: Font(baseUrl, headers),
    Creator: Creator(baseUrl, headers),
    VideoTemplate: VideoTemplate(baseUrl, headers),
  };
};
