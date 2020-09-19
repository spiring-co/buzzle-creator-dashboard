
import { apiClient } from "./buzzle-sdk/lib/index";


const API = apiClient({
    baseUrl: process.env.REACT_APP_API_URL,
    authToken: localStorage.getItem("jwtoken"),
});

export const { Job, Creator, VideoTemplate, Font } = API