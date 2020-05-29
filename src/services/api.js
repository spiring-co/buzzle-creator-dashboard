import { useEffect, useState } from "react";
import { jobSchemaConstructor } from "./helper";
const baseUrl = process.env.REACT_APP_API_URL;

/**
 * Create a new use api hook.
 * @param  {String} url - url relative to the base url
 * @param  {Object} options - http options
 * @param  {String} type="json" - expected response type
 */
export default (url, fetchOptions = {}, type = "json") => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const controller = new AbortController();
  const { signal } = controller;
  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(baseUrl + url, { ...fetchOptions, signal });

      response.ok
        ? setData(await response.json())
        : setError(await response.json());
      setLoading(false);
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }
  useEffect(() => {
    fetchData();
    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error, onReferesh: fetchData };
};

export const deleteTemplate = async (id) => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL + `/videoTemplates/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const renderTestJob = async (data) => {
  try {
    var jobs = jobSchemaConstructor(data);

    await Promise.all(
      jobs.map((job) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(job);
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        fetch("http://localhost:5000/jobs", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
          })
          .catch((error) => console.log("error", error));
      })
    );
    window.location.assign("/home/jobs");
  } catch (err) {
    console.log(err);
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/auth/resetPasswordEmail",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

export const registerUser = async (s) => {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL + "/creator", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(s),
    });
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteJob = async () => {
  return "ok";
};
