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
import AuthOperations from "common/AuthOperations";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default () => {
  const param = useQuery()
  const { state = {}, } = useLocation<{ message?: string, email?: string, mode?: "change-pass" | "check" | "forgot-pass" | "login" | "register" | "re-auth" }>()
  const { user, isUserLoadingFromFirebase, } = useAuth();
  const email = ((state)?.email || param.get("email") || "")
  const message = ((state)?.message || param.get("message") || "")

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
      <Paper style={{ marginLeft: 10, marginRight: 10,  }}>
        <AuthOperations message={message} email={email} />
      </Paper>
      <Branding mt={5} />
    </Box>
  );
};
