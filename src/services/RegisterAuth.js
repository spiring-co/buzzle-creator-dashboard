import React, { useState } from "react";
import { User } from "services/api";

export default () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const submition = async (s) => {
    try {
      const response = await User.create(s).catch((err) => {
        return setError(err);
      });//new api change
      if (response) {
        setSuccess(true);
      }
      console.log(`line 16 ${response}`);
      if (response) {
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
