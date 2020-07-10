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

  create: async ({
    actions = {},
    data = {},
    renderPrefs = {},
    idVideoTemplate,
    idVersion,
  }) => {
    const response = await fetch(`${baseUrl}/jobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        actions,
        data,
        idVideoTemplate,
        idVersion,
        renderPrefs,
      }),
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },

  update: async (id, { actions = {}, data = {}, renderPrefs = {} }) => {
    const response = await fetch(`${baseUrl}/jobs/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ actions, data, renderPrefs }),
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
      jobs.map(async (job) => {
        const response = await fetch(`${baseUrl}/jobs`, {
          method: "POST",
          headers,
          body: JSON.stringify(job),
        });
        if (!response.ok) throw new Error("request failed.");
        return await response.json();
      })
    );
  },
};

export const VideoTemplate = {
  get: async () => {},
  create: async (data) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + `/videoTemplates`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${baseUrl}/videoTemplates/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${baseUrl}/videoTemplates/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },
};
export const Fonts = {
  getStatus: async (name) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/fonts?name=${name}`
      );
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        return { name, src: "" };
      }
    } catch (err) {
      console.log(err);
      return { name, src: "" };
    }
  },
  addFont: async (fontObj) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/fonts`, {
        method: "POST",
        headers,
        body: JSON.stringify(fontObj),
      });
    } catch (err) {
      console.log(err);
    }
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
  create: async (user) => {
    const response = await fetch(`${baseUrl}/creators`, {
      method: "POST",
      headers,
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },

  update: async (data) => {
    const response = await fetch(`${baseUrl}/creators`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error((await response.json()).message);
    return await response.json();
  },
};
//TODO move to auth
export const sendOtp = async (email) => {
  const response = await fetch(baseUrl + "/auth/resetPasswordEmail", {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error((await response.json()).message);
  return await response.json();
};
