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
const apiURL = process.env.REACT_APP_API_URL
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
          //@ts-ignore
          v.sort((a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt))
        );
    } else {
      throw new Error(
        "Wrong or no authentication secret provided. Please check the nexrender-secret header."
      );
    }
  },
  get: async (id: string) => {
    const response = await fetch(`${uri}/${id}`, {
      headers: { "nexrender-secret": "myapisecret" },
    });
    return await response.json();
  },
  delete: async (id: string) => {
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
export const getExtractionServerIP = async () => {
  if (apiURL) {
    const result = await fetch(`${apiURL}/status/instances`)
    if (result.ok) {
      let response = await result.json()
      response = response?.map(({ PublicIpAddress = "" }) => PublicIpAddress)
      return (await getIPWhichRunningExtractionServer(response as Array<string>))[Math.floor(random(0, 2))]
    } else {
      throw new Error("Failed to fetch extraction server state!")
    }
  }
}
function random(mn: number, mx: number) {
  return Math.random() * (mx - mn) + mn;
}
const getIPWhichRunningExtractionServer = async (ipList: Array<string>) => {
  const runningIp: Array<string> = []
  await Promise.all(ipList?.map(async (ip) => {
    if ((await fetch(ip)).ok) {
      runningIp.push(ip)
      return true
    } else {
      return false
    }
  }))
  return runningIp
}
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

