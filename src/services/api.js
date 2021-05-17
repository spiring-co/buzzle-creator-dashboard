import BuzzleSdk from "buzzle-sdk";

const getBuzzleApi = () => {
  return BuzzleSdk.apiClient({
    baseUrl: process.env.REACT_APP_API_URL,
    authToken: localStorage.getItem("jwtoken"),
  });
};
let API = getBuzzleApi();

const uri = `http://52.54.195.156:3000/api/v1/jobs`;

export const Billing = {
  getPricing: async () => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/billing/pricing`)).json()
  },
  createSubscription: async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/billing/subscription`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
      },
      body: JSON.stringify(data)
    })).json()
  },
  getInvoice: async () => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/billing/invoice/upcoming`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
      },
    })).json()
  },
  getAllInvoices: async ({ limit = 5, startAfter = '', subscriptionId = '' }) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/billing/invoice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
      },
      body: JSON.stringify({ limit , startAfter, subscriptionId })
    })).json()
  },
  updatePaymentMethod: async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/billing/paymentMethod`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
      },
      body: JSON.stringify(data)
    })).json()
  },
  createSubscriptionSetupIntent: async (data) => {
    return await (await fetch(`${process.env.REACT_APP_API_URL}/billing/subscription/setupIntent`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
      },
      body: JSON.stringify(data)
    })).json()
  }
}

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
  const result = await fetch('http://ip-api.com/json')
  return (await result.json())?.countryCode
}

export const {
  Job,
  User,
  VideoTemplate,
  Font,
  Search,
  Auth,
  Webhook,
  Creator,
} = API;

