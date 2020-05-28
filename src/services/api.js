import { useEffect, useState } from "react";

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

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      const response = await fetch(baseUrl + url, { ...fetchOptions, signal });

      response.ok
        ? setData(await response.json())
        : setError(await response.json());
      setLoading(false);
    }
    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
};

export const deleteTemplate = async (id) => {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL +
      `/videoTemplates/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
        },
      }
    );
    return response
  }
  catch (err) {
    throw new Error(err)
  }
}