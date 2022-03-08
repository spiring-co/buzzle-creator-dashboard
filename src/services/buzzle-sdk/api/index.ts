import Job from "./job";
import User from "./user";
import Analytics from "./analytics";
import Pricing from "./pricing";
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
    Pricing: Pricing(baseUrl, headers),
    Analytics: Analytics(baseUrl, headers),
    User: User(baseUrl, headers),
    VideoTemplate: VideoTemplate(baseUrl, headers),
  };
}
