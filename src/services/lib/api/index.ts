import Job from "./job";
import Font from "./font";
import Creator from "./creator";
import VideoTemplate from "./videoTemplate";
import Search from "./search";
import APIInterface, { APIParam } from "../interfaces";

export default function Api(params: APIParam): APIInterface {
  const { baseUrl, authToken } = params;
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
    Search: Search(baseUrl, headers),
  };
}
