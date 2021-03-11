import React, { useState } from "react";

export default () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const submition = async (s) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/creator", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(s),
      });//TODO fetch
      setSuccess(response.ok);
      console.log(`line 16 ${response.ok}`);
      if (response.ok) {
        return window.location.assign("/");
      } else {
        const res = await response.json();
        console.log(`line 23 ${res.message}`);
        let resSlice = res.message.slice(0, 6);
        if (resSlice == "E11000") {
          return setError({
            message: "the email is already used for registration",
          });
        }
        return setError(res.message);
      }
    } catch (e) {
      setError(e);
    }
  };
  return { submition, error, success };
};
