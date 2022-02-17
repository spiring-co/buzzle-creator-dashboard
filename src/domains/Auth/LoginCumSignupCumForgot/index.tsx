import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Alert } from "@material-ui/lab";
import Branding from "common/Branding";
import { useFormik } from "formik";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "services/auth";
import * as Yup from "yup";

import { useAPI } from "services/APIContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default () => {
  const { t } = useTranslation();
  const param = useQuery()
  const { state = {}, } = useLocation<{ message?: string, email?: string, mode?: "change-pass" | "check" | "forgot-pass" | "login" | "register" | "re-auth" }>()
  const history = useHistory();
  const { message = param.get("message") || "" } = state
  const [mode, setMode] = useState<"check" | "login" | "forgot-pass" | "change-pass" | "register" | "re-auth">(state?.mode ?? "check")
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { signUpWithEmailPassword, user, isUserLoadingFromFirebase, forgotPassword, checkUserExist, signInWithPassword } = useAuth();
  const email = ((state)?.email || param.get("email") || "")
  const [showPassword, setShowPassword] = useState(false);
  const handleCredentialSubmit = React.useCallback(async ({ email, password, name }: {
    email: string,
    name?: string, password?: string
  }) => {
    try {
      setLoading(true);
      setError(null)
      if (mode === 'check') {
        if (await checkUserExist(email || "")) {
          setMode("login")
        } else {
          setMode("register")
        }
      } else if (mode === 'register') {
        await signUpWithEmailPassword(email, password || "", name || "")
      }
      else if (mode === 'login') {
        await signInWithPassword(email, password || "")
      }
      else if (mode === "forgot-pass") {
        await forgotPassword(email)
        history.replace(`/login?email=${email}&message=Follow the instructions sent to ${email} to recover your password`)
        setMode("login")
      }
      else if (mode === "re-auth") {
        //TODO
      }
      else if (mode === "change-pass") {
        //TODO
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [mode])
  useEffect(() => {
    if (email) {
      handleCredentialSubmit({ email })
    }
  }, [email])

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: (mode === "check" || mode === "forgot-pass") ? {
      email,
    } : (mode === 'login' ? {
      email,
      password: "",
    } : {
      name: "",
      email: email,
      password: "",
    }),
    validationSchema: Yup.object((mode === "check" || mode === "forgot-pass") ? {
      email: Yup.string().email("Invalid email").required("Enter your email to continue"),
    } : (mode === 'login' ? {
      email: Yup.string().email("Invalid email").required("Enter your email to continue"),
      password: Yup.string().required(t("passwordRequired")),
    } : {
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Enter your email to continue"),
      password: Yup.string().required(t("passwordRequired")),
    })),
    onSubmit: handleCredentialSubmit
  });



  const handleClickShowPassword = useCallback(() => {
    setShowPassword(value => !value);
  }, [])

  const handleMouseDownPassword = useCallback((event: any) => {
    event.preventDefault();
  }, [])
  const getHeading = useCallback(() => {
    switch (mode) {
      case 'check':
        return "Get Started";
      case 'forgot-pass':
        return "Recover password"
      case 'login':
        return "Login";
      case 'register':
        return "Create Account";
      case 're-auth':
        return "Re-Authenticate";
      default:
        return ""
    }
  }, [mode])
  if (user && !isUserLoadingFromFirebase) {
    return <Redirect to="/home" />
  }
  return (
    <Box style={{
      display: 'flex', height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }} >
      <Typography
        variant="h4"
        style={{
          textAlign: "center",
          marginBottom: 30,
          fontWeight: 800,
          fontSize: "2.5rem",
          fontFamily: "Poppins",
        }}>
        Buzzle!
      </Typography>
      <Paper component="form"
        style={{ padding: 20, paddingLeft: 25, paddingRight: 25, maxWidth: 375, width: '100%', marginLeft: 10, marginRight: 0 }}
        //@ts-ignore
        onSubmit={handleSubmit}
        noValidate
      >
        <CssBaseline />
        <Typography style={{ marginBottom: 15 }} variant="h5">{getHeading()}</Typography>
        {message ? <Alert style={{ marginBottom: 10 }} severity="info" children={message} /> : <div />}
        {error ? <Alert style={{ marginBottom: 10 }} severity="error" children={error?.message ?? error} /> : <div />}
        <TextField

          name={"email"}
          margin="dense"
          value={values.email}
          label="Email address"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.email && !!errors.email}
          fullWidth
          variant={"outlined"}
          placeholder="Enter email"
          helperText={
            touched.email && errors.email
              ? errors?.email
              : mode === "forgot-pass" ? "Instructions for password reset will be sent to this email." : mode === "check" ? "Welcome, Enter email address to get started" : ""
          }
        />{mode === "register" ? <TextField

          name={"name"}
          margin="dense"
          value={values.name}
          label="Your name"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.name && !!errors.name}
          fullWidth
          variant={"outlined"}
          placeholder="Enter your name"
          helperText={
            touched.name && errors.name
              ? errors?.name
              : ""
          }
        /> : <div />}
        {(mode !== "check" && mode !== 'forgot-pass') ? <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            name="password"
            labelWidth={75}
            placeholder="Password"
            error={touched.password && !!errors.password}
            endAdornment={
              <>
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              </>
            }
          />
          <FormHelperText error={touched.password && !!errors.password}>
            {errors.password}
          </FormHelperText>
        </FormControl> : <div />}
        <Box style={{ width: '100%', marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {mode === "login" ? <Button style={{ textTransform: "none", fontWeight: 'normal' }}
            size={"small"} color="primary" onClick={() => setMode("forgot-pass")} >
            Trouble signing in?
          </Button> : <div />}
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            color="primary"
            children={loading ? <CircularProgress color="inherit" size={20} /> : mode === "re-auth" ? "Confirm" : mode === "forgot-pass" ? "Send" : mode === "check" ? "Next" : (mode === "register" ? "Create Account" : "Sign in")}
          />
        </Box>
      </Paper>
      <Branding mt={5} />
    </Box>
  );
};
