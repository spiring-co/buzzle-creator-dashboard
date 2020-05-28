import { useFormik } from "formik";
import React, { useState } from "react";
import Confetti from "react-dom-confetti";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Link,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default () => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [otpEmailSent, setOtpEmailSent] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t("enterEmail")).required(t("required")),
    }),
    onSubmit: async ({ email, newPassword, otp }) => {
      otpEmailSent
        ? resetPassword(email, newPassword, otp)
        : sendPasswordResetOtp(email);
    },
  });

  const resetPassword = async (email, newPassword, otp) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/auth/resetPassword",
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
    // TODO move to api

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
      console.log(await response.json());
      setOtpEmailSent(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };
  return (
    <Box mt={4}>
      <Container maxWidth={"sm"}>
        <Confetti active={passwordResetSuccess} config={confettiConfig} />
        {passwordResetSuccess ? (
          <>
            <Typography variant="h3">{t("passwordSuccess")} </Typography>
            <Typography>{t("woohoo")} </Typography>

            <Button
              component={RouterLink}
              to={"/login"}
              //TODO implement with redirect
              onClick={() => (window.location = "/login")}
              variant="contained"
              color="primary"
              children="Login"
            />
            <Confetti active={passwordResetSuccess} config={confettiConfig} />
          </>
        ) : (
          <>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h4">Forgot Password</Typography>
              <Typography>{t("noWorries")}</Typography>
              {error && <Alert severity="error" children={error.message} />}
              {otpEmailSent && <Alert severity="info">{t("checkEmail")}</Alert>}
              <TextField
                fullWidth
                margin={"dense"}
                variant={"outlined"}
                disabled={otpEmailSent}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name={"email"}
                type="email"
                readOnly={otpEmailSent}
                plaintext={otpEmailSent}
                placeholder="Enter email"
                label="Email Address"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors?.email}
              />

              {otpEmailSent && (
                <>
                  <TextField
                    fullWidth
                    margin={"dense"}
                    variant={"outlined"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.OTP}
                    name={"otp"}
                    type="otp"
                    placeholder="Enter otp"
                    label="OTP"
                    error={touched.otp && !!errors.otp}
                    helperText={errors?.otp}
                  />{" "}
                  <TextField
                    fullWidth
                    margin={"dense"}
                    variant={"outlined"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    name={"password"}
                    type="password"
                    placeholder="Enter password"
                    label="New Password"
                    error={touched.password && !!errors.password}
                    helperText={errors.password}
                  />
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                children={
                  otpEmailSent
                    ? isSubmitting
                      ? "Resetting password..."
                      : "Reset"
                    : isSubmitting
                    ? "Sending OTP..."
                    : "Proceed"
                }
                disabled={isSubmitting}
              />
              <Typography>
                {t("dontHave")}{" "}
                <Link component={RouterLink} to="/register">
                  Sign up.
                </Link>
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

const confettiConfig = {
  angle: 45,
  spread: 45,
  startVelocity: 45,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 3000,
  stagger: 0,
  width: "10px",
  height: "10px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};
