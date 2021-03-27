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
import { Job, VideoTemplate, User } from "services/api";
import Branding from "common/Branding";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as Yup from "yup";

function renderCountryMenuItem(country) {
  return <MenuItem value={country}>{country}</MenuItem>;
}

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

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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
      name: "",
      email: "",
      // countryCode: "",
      password: "",
      confirmPassword: "",
      role: "Creator",
      // gender: "",
      // country: "",
      // phoneNumber: "",
      birthDate: new Date().toISOString().substr(0, 10),
    },
    validationSchema,
    onSubmit: async (s, { setSubmitting }) => {
      console.log("called onsubmit");
      try {
        const cp = Object.assign({}, s)
        delete cp["confirmPassword"];
        await User.create(cp);
        history.push("/login", {
          message:
            "Please check your mail for a verification mail and click the link to continue.",
        });
      } catch (e) {
        setError(e);
        setSubmitting(false);
      }
    },
  });

  const onFormSubmit = (e) => {
    console.log("onformsubmit");
    console.log(errors);
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Box mt={4}>
      <Container
        component="form"
        isValidated={Object.keys(errors).length}
        onSubmit={onFormSubmit}
        noValidate
        maxWidth={"sm"}>
        <Paper className={classes.content}>
          <Typography className={classes.spacedText} variant="h4">
            Register
          </Typography>
          <Typography>{t("register")}</Typography>
          {error && (
            <Alert severity="error" children={error.message || t("wrong")} />
          )}
          <TextField
            required
            fullWidth
            margin={"dense"}
            variant={"outlined"}
            name={"name"}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            placeholder="Your name here"
            label="Name"
            error={touched.name && !!errors.name}
            helperText={errors?.name ?? ""}
          />
          <TextField
            required
            fullWidth
            margin={"dense"}
            variant={"outlined"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            name={"email"}
            type="email"
            placeholder="Your email here"
            label="Email Address"
            error={touched.email && !!errors.email}
            helperText={errors?.email ?? t("wontShareEmail")}
          />
          <OutlinedInput
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
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            type={showPassword ? "text" : "password"}
            helperText={errors?.password ?? t("passwordMust")}
          />
          <p style={{ margin: 10 }}> </p>
          <OutlinedInput
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
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword2}
                  onMouseDown={handleMouseDownPassword}
                  edge="end">
                  {showPassword2 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            type={showPassword2 ? "text" : "password"}
            helperText={errors?.confirmPassword}
          />
          {/* <FormControl
              required
              fullWidth
              margin="dense"
              error={touched.gender && !!errors.gender}
              variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Gender
              </InputLabel>
              <Select
                style={{ textAlign: "left" }}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.gender}
                name={"gender"}
                type="text"
                placeholder="Select gender"
                label="Gender">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              <FormHelperText error={touched.gender && !!errors.gender}>
                {errors?.gender}
              </FormHelperText>
            </FormControl> */}
          {/* <TextField
              required
              fullWidth
              margin={"dense"}
              variant={"outlined"}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phoneNumber}
              name={"phoneNumber"}
              type="tel"
              placeholder="Enter Phone Number"
              label="Phone Number"
              error={touched.phoneNumber && !!errors.phoneNumber}
              helperText={errors?.phoneNumber ?? ""}
            /> */}
          <TextField
            required
            fullWidth
            margin={"dense"}
            variant={"outlined"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.birthDate}
            name={"birthDate"}
            type="date"
            placeholder="Enter Birth Date"
            label="Birth Date"
            error={touched.birthDate && !!errors.birthDate}
            helperText={errors?.birthDate ?? ""}
          />
          {/* <TextField
              required
              fullWidth
              margin={"dense"}
              variant={"outlined"}
              onChange={handleChange}
              onBlur={handleBlur}
              type="tel"
              placeholder="Enter Country Code"
              name={"countryCode"}
              defaultValue={new Date().toISOString().substr(0, 10)}
              value={values.countryCode}
              label="Country Code"
              error={touched.countryCode && !!errors.countryCode}
              helperText={errors.countryCode ?? ""}
            /> */}
          {/* <FormControl
              required
              fullWidth
              margin="dense"
              error={touched.country && !!errors.country}
              variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Country
              </InputLabel>
              <Select
                style={{ textAlign: "left" }}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.country}
                name={"country"}
                placeholder="Select country"
                label="Country">
                {countryList.map(renderCountryMenuItem)}
              </Select>
              <FormHelperText error={touched.country && !!errors.country}>
                {errors?.country ?? ""}
              </FormHelperText>
            </FormControl> */}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            children={isSubmitting ? "Loading..." : "Register"}
            disabled={isSubmitting}
          />
          <Typography align="center" className={classes.spacedText}>
            Already registered?{" "}
            <Link component={RouterLink} to="/login">
              Sign In.
            </Link>
          </Typography>
        </Paper>
      </Container>{" "}
      <Branding dark />
    </Box>
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
  name: Yup.string()
    .min(3, "Should be at least 3 characters")
    .max(40, "Should not be more than 40 characters")
    .matches(/^[a-zA-Z ]*$/, "Should only contain alphabetic characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .max(100, "Should not be more than 100 characters")
    .required("Email is Required"),
  password: Yup.string()
    .min(8, "Should be at least 8 characters")
    .max(40, "Should not be more than 40 characters")
    .required("Password is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required!"),
  // countryCode: Yup.string()
  //   .matches(/^(\+?\d{1,3}|\d{1,4})$/gm, "Country code is not valid")
  //   .required("Country code is required"),
  // phoneNumber: Yup.string()
  //   .matches(/^\d{10}$/, "Phone number isn't valid")
  //   .required("Phone number is required"),

  birthDate: Yup.date().required("Birth date is required"),
  // country: Yup.string().required("Country name is required"),
  // gender: Yup.string().required("Gender field is required"),
});
