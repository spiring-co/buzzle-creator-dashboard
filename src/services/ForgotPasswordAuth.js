import React, { useState } from "react";
import { Auth } from "services/api";

export default () => {
  const [error, setError] = useState(null);
  const [otpEmailSent, setOtpEmailSent] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const resetPassword = async (email, newPassword, otp) => {
    try {
      Auth.resetPassword({ email, otp, newPassword }); //new api change
      console.log(await response.json());
      setPasswordResetSuccess(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const sendPasswordResetOtp = async (email) => {
    try {
      Auth.resetPasswordEmail({ email });//new api change
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
