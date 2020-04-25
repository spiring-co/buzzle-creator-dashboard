import React, { useState } from "react";

export default () => {
  const [error, setError] = useState(null);
  const [otpEmailSent, setOtpEmailSent] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const resetPassword = async (email, newPassword, otp) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/creator/resetPassword",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      console.log(await response.json());
      setPasswordResetSuccess(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const sendPasswordResetOtp = async (email) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/creator/resetPasswordEmail",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      console.log(await response.json());
      setOtpEmailSent(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  return {
    sendPasswordResetOtp,
    resetPassword,
    error,
    otpEmailSent,
    passwordResetSuccess,
  };
};
