// import { apiClient } from "./buzzle-sdk";

// const getBuzzleApi = () => {
//   return apiClient({
//     baseUrl: process.env.REACT_APP_API_URL,
//   });
// };
// let API = getBuzzleApi();

// window.onstorage = () => {
//   API = getBuzzleApi();
// };

const uri = `http://52.54.195.156:3000/api/v1/jobs`;

export const ServerJobs = {
  getAll: async () => {
    const response = await fetch(uri, {
      headers: { "nexrender-secret": "myapisecret" },
    });
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
export const getCountry = async () => {
  const result = await fetch('http://ip-api.com/json');
  const code = (await result.json())?.countryCode;
  return code;
};

// // export const {
// //   Job,
// //   User,
// //   VideoTemplate,
// //   Font,
// //   Search,
// //   Auth,
// //   Webhook,
// //   Creator,
// // } = API;

