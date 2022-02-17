import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Divider,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Alert } from "@material-ui/lab";
import { useAPI } from "services/APIContext";
import Branding from "common/Branding";
import { countryList } from "common/CountryList";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../services/auth";

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      padding: theme.spacing(3),
    },
    spacedText: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
  })
);

export default () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { user } = useAuth();
  const { Auth } = useAPI()
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [status, setStatus] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (s) => {
      try {
        delete s["confirmPassword"];
        const result = await Auth.resetPassword(user?.id, s);
        setStatus(result?.message ?? "Changed Successfully");
      } catch (e) {
        setError(e);
      }
    },
  });

  return (
    <Container
      component="form"
      isValidated={Object.keys(errors).length}
      onSubmit={handleSubmit}
      noValidate
      maxWidth={"sm"}>
      <Typography className={classes.spacedText} variant="h5">
        Change Password
      </Typography>
      <Divider />
      <Container style={{ height: 10 }} />
      {(error || status) && (
        <Alert
          severity={error ? "error" : "success"}
          children={error ? error?.message ?? t("wrong") : status}
        />
      )}
      <TextField
        required
        fullWidth
        margin={"dense"}
        variant={"outlined"}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.oldPassword}
        name={"oldPassword"}
        type="password"
        placeholder="Old Password"
        label="Old Password"
        error={touched.oldPassword && !!errors.oldPassword}
        helperText={errors?.oldPassword}
      />
      <TextField
        required
        fullWidth
        margin={"dense"}
        variant={"outlined"}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
        name={"password"}
        placeholder="Password"
        error={touched.password && !!errors.password}
        type={showPassword ? "text" : "password"}
        helperText={
          touched.password
            ? errors?.password ?? t("passwordMust")
            : t("passwordMust")
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        required
        fullWidth
        margin={"dense"}
        variant={"outlined"}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.confirmPassword}
        name={"confirmPassword"}
        placeholder="Confirm Password"
        error={touched.confirmPassword && !!errors.confirmPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword2}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {showPassword2 ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        type={showPassword2 ? "text" : "password"}
        helperText={touched.confirmPassword && errors?.confirmPassword}
      />
      <Button
        style={{ marginTop: 10 }}
        variant="contained"
        color="primary"
        type="submit"
        children={isSubmitting ? "Updating..." : "Change Password"}
        disabled={isSubmitting}
      />
    </Container>
  );
};
function equalTo(ref, msg) {
  return Yup.mixed().test({
    name: "equalTo",
    exclusive: false,
    message: msg || "${path} must be the same as ${reference}",
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}
Yup.addMethod(Yup.string, "equalTo", equalTo);
const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old Password is Required"),
  password: Yup.string()
    .min(8, "Should be at least 8 characters")
    .max(40, "Should not be more than 40 characters")
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .equalTo(Yup.ref("password"), "Incorrect password!")
    .required("Confirm password is required!"),
});
