import { useFormik } from "formik";
import React, { useState } from "react";
import Confetti from "react-dom-confetti";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Button, TextField, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'

const config = {
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

const useStyles = makeStyles((theme) => ({
  alert: {
    margin: 15
  }, container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 50,
    margin: 'auto',
    width: 400
  },

}))
export default () => {
  const classes = useStyles()
  const { t, i18n } = useTranslation();
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
      email: Yup.string()
        .email(t('enterEmail'))
        .required(t('required')),
    }),
    onSubmit: async ({ email, newPassword, otp }) => {
      otpEmailSent ? resetPassword(email, newPassword, otp) : sendPasswordResetOtp(email);
    },
  });

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
      setPasswordResetSuccess(true)
    }
    catch (e) {
      console.log(e)
      setError(e)
    }

  }

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
      setOtpEmailSent(true)
    } catch (e) {
      console.log(e);
      setError(e);
    }
  }
  return (
    <div className={classes.container}>
      <Confetti active={passwordResetSuccess} config={config} />
      {passwordResetSuccess ? (
        <>
          <h3 className="text-center mb-4 mt-5">
            {t('passwordSuccess')}{" "}
          </h3>

          <p className="text-muted text-center mb-4">
            {t('woohoo')}
          </p>
          <Confetti active={passwordResetSuccess} config={config} />
          <Button
            onClick={() => window.location = "/login"}
            variant="contained"
            color="primary"
            children="Login"

          />
        </>
      ) : (
          <>
            <form onSubmit={handleSubmit} noValidate >
              <Typography variant="h4" >Forgot Password</Typography>
              <p style={{ margin: 10, marginBottom: 20 }}>
                {t('noWorries')}
              </p>
              {error && <Alert severity="error" children={error.message} />}
              {otpEmailSent && (
                <Alert severity="info">
                  {t('checkEmail')}
                </Alert>
              )}
              <TextField
                fullWidth
                margin={'dense'}
                variant={'outlined'}
                disabled={otpEmailSent}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name={"email"}
                type="email"
                readOnly={otpEmailSent}
                plaintext={otpEmailSent}
                placeholder="Enter email"
                label="Email Adresss"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors?.email}
              />


              {otpEmailSent && (
                <>
                  <TextField
                    fullWidth
                    margin={'dense'}
                    variant={'outlined'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.OTP}
                    name={"otp"}
                    type="otp"
                    placeholder="Enter otp"
                    label="OTP"
                    error={touched.otp && !!errors.otp}
                    helperText={errors?.otp}
                  /> <TextField
                    fullWidth
                    margin={'dense'}
                    variant={'outlined'}
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
                style={{ marginTop: 10 }}
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
            </form>
            <Typography style={{ marginTop: 15 }}>
              {t('dontHave')} <Link to="/register">Sign up.</Link>
            </Typography>
          </>
        )}
    </div>
  );
}