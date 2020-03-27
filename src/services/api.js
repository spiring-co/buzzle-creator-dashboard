import { useEffect, useState } from "react";

const controller = new AbortController();
const { signal } = controller;

const baseUrl = process.env.REACT_APP_API_URL;

/**
 * Create a new use api hook.
 * @param  {String} url - url relative to the base url
 * @param  {Object} options - http options
 * @param  {String} type="json" - expected response type
 */
export default (url, options, type = "json") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(baseUrl + url, { ...options, signal })
      .then(response => {
        if (response.ok) {
          if (type === "text") {
            setData(response.text());
          }
          setData(response.json());
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
    return controller.abort;
  }, [url, options, type]);

  return { data, loading, error };
};
