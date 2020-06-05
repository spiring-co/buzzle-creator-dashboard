import createTestJobs from "helpers/createTestJobs";

const baseUrl = process.env.REACT_APP_API_URL;
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
};

export const Job = {
  get: async (id, populateVideoTemplate) => {
    const response = await fetch(
      `${baseUrl}/jobs/${id}?populateVideoTemplate=${populateVideoTemplate}`,
      {
        headers,
      }
    );

    if (!response.ok) throw new Error("request failed.");
    return await response.json();
  },

  create: async ({ actions, assets, videoTemplateId, versionId }) => {
    const response = await fetch(`${baseUrl}/jobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ actions, assets, videoTemplateId, versionId }),
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },

  update: async (id, { actions, assets }) => {
    const response = await fetch(`${baseUrl}/jobs/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ actions, assets }),
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${baseUrl}/jobs/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error("request failed.");
    return await response.json();
  },

  renderTests: async (data) => {
    const jobs = createTestJobs(data);

    await Promise.all(
      jobs.map((job) => {
        fetch("http://localhost:5000/jobs", {
          method: "POST",
          headers,
          body: JSON.stringify(job),
        }).then((response) => response.json());
      })
    );
  },
};

export const VideoTemplate = {
  get: async () => {},
  create: async () => {},
  update: async () => {},

  delete: async (id) => {
    const response = await fetch(`${baseUrl}/videoTemplates/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },
};

export const Creator = {
  get: async (id) => {
    const response = await fetch(`${baseUrl}/creators/${id}`, {
      headers,
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },
  create: async () => {},
  update: async () => {},
};

export const sendOtp = async (email) => {
  const response = await fetch(baseUrl + "/auth/resetPasswordEmail", {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error((await response.json()).message);
  return await response.json();
};

export const registerUser = async (s) => {
  const response = await fetch(baseUrl + "/creator", {
    method: "POST",
    headers,
    body: JSON.stringify(s),
  });
  if (!response.ok) throw new Error((await response.json()).message);
  return await response.json();
};
