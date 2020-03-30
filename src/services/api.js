import { useEffect, useState } from "react";

const baseUrl = process.env.REACT_APP_API_URL;

/**
 * Create a new use api hook.
 * @param  {String} url - url relative to the base url
 * @param  {Object} options - http options
 * @param  {String} type="json" - expected response type
 */
export default (url, options = {}, type = "json") => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(baseUrl + url, { ...options, signal })
      .then(response => {
        if (response.ok) {
          if (type === "text") {
            response.text().then(setData);
          } else {
            response.json().then(setData);
          }
        } else {
          response.json().then(setError);
        }
      })
      .catch(e => {
        if (e.name === "AbortError") {
          return console.log(e);
        }
        return setError(e);
      })
      .finally(() => setLoading(false));
    return () => {
      return controller.abort();
    };
  }, [url, options, type]);

  return { data, loading, error };
};
