import BuzzleSdk from "buzzle-sdk";
const API = BuzzleSdk.apiClient({
  baseUrl: process.env.REACT_APP_API_URL,
  authToken: localStorage.getItem("jwtoken"),
});

const uri = `http://34.229.239.151:3050/api/v1/jobs`;

export const ServerJobs = {
  getAll: async () => {
    const response = await fetch(uri, {
      headers: { "nexrender-secret": "myapisecret" },
    });
    console.log("im trying to get jobs");
    if (response.ok) {
      return await response
        .json()
        .then((v) =>
          v.sort((a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt))
        );
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
