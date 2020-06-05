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
  const controller = new AbortController();
  const { signal } = controller;
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(baseUrl + url, { ...fetchOptions, signal });

      response.ok
        ? setData(await response.json())
        : setError(await response.json());
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err);
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
