import { apiClient } from "buzzle-sdk";

const API = apiClient({
  baseUrl: "http://localhost:5000",
  authToken: localStorage.getItem("jwtoken"),
});
const uri = `http://34.229.239.151:3050/api/v1/jobs`;

export const ServerJobs = {
  getAll: async () => {
    const response = await fetch(uri, {
      headers: { "nexrender-secret": "myapisecret" },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        "Wrong or no authentication secret provided. Please check the nexrender-secret header."
      );
    }
  },
  get: async (id) => {
    const response = await fetch(`${uri}/${id}`, {
      headers: { "nexrender-secret": "myapisecret" },
    });
    return await response.json();
  },
  delete: async (id) => {
    await fetch(`${uri}/${id}`, {
      method: "DELETE",
      headers: { "nexrender-secret": "myapisecret" },
    });
    return true;
  },
  deleteAll: async (idArray = []) => {
    await Promise.all(
      idArray.map((id) =>
        fetch(`${uri}/${id}`, {
          method: "DELETE",
          headers: { "nexrender-secret": "myapisecret" },
        })
      )
    );
    return true;
  },
};

export const { Job, Creator, VideoTemplate, Font, Search } = API;
