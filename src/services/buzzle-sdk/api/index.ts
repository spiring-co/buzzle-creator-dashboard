import Job from "./job";
import User from "./user";
import VideoTemplate from "./videoTemplate";
import { APIParam } from "../types";
import { firebaseAuth } from "services/firebase";

export default (params: APIParam) => {
  const { baseUrl, authToken } = params;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `bearer ${authToken || firebaseAuth.currentUser?.getIdToken(true)}`,
  };

  return {
    Job: Job(baseUrl, headers),
    User: User(baseUrl, headers),
    VideoTemplate: VideoTemplate(baseUrl, headers),
  };
}
