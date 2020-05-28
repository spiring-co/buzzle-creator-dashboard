import { useFormik } from "formik";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Alert } from "@material-ui/lab";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import {
  TextField,
  Button,
  Typography,
  FormHelperText,
  FormControl,
  Paper,
  InputLabel,
  Select,
  Link,
  Container,
  MenuItem,
  Box,
} from "@material-ui/core";

import { countryList } from "components/CountryList";

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

  const [error, setError] = useState(null);

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
      countryCode: "",
      password: "",
      gender: "",
      country: "",
      phoneNumber: "",
      birthDate: new Date().toISOString().substr(0, 10),
    },
    validationSchema,
    onSubmit: async (s) => {
      console.log(s);
      try {
        // TODO abstract in api as addCreator
        const response = await fetch(
          process.env.REACT_APP_API_URL + "/creator",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(s),
          }
        );
        if (response.ok) {
          return window.location.assign("/");
        } else {
          const res = await response.json();
          console.log(res.message);
          let resSlice = res.message.slice(0, 6);
          if (resSlice == "E11000") {
            return setError({ message: t("emailUsed") });
          }
          return setError(res.message);
        }
      } catch (e) {
        setError(e);
      }
    },
  });

  return (
    <Box mt={4}>
      <Container
        component="form"
        isValidated={Object.keys(errors).length}
        onSubmit={handleSubmit}
        noValidate
        maxWidth={"sm"}
      >
        <Paper className={classes.content}>
          <Typography className={classes.spacedText} variant="h4">
            Register
          </Typography>
          <Typography>{t("register")}</Typography>
          {error && (
            <Alert severity="error" children={error.message || t("wrong")} />
          )}
          <TextField
            fullWidth
            margin={"normal"}
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
            fullWidth
            margin={"normal"}
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
          <TextField
            fullWidth
            margin={"normal"}
            variant={"outlined"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            name={"password"}
            type="password"
            placeholder="Password"
            label="Password"
            error={touched.password && !!errors.password}
            helperText={errors?.password ?? t("passwordMust")}
          />
          <FormControl
            fullWidth
            margin="normal"
            error={touched.gender && !!errors.gender}
            variant="outlined"
          >
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
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            <FormHelperText error={touched.gender && !!errors.gender}>
              {errors?.gender}
            </FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            margin={"normal"}
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
          />
          <TextField
            fullWidth
            margin={"normal"}
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
          <TextField
            fullWidth
            margin={"normal"}
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
          />
          <FormControl
            fullWidth
            margin="normal"
            error={touched.country && !!errors.country}
            variant="outlined"
          >
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
              label="Country"
            >
              {countryList.map(renderCountryMenuItem)}
            </Select>
            <FormHelperText error={touched.country && !!errors.country}>
              {errors?.country ?? ""}
            </FormHelperText>
          </FormControl>
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
      </Container>
    </Box>
  );
};

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
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,40}$/,
      "Should have  at least a number, and at least a special character"
    )
    .required("Password is Required"),
  countryCode: Yup.string()
    .matches(/^(\+?\d{1,3}|\d{1,4})$/gm, "Country code is not valid")
    .required("Country code is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number isn't valid")
    .required("Phone number is required"),

  birthDate: Yup.date().required("Birth date is required"),
  country: Yup.string().required("Country name is required"),
  gender: Yup.string().required("Gender field is required"),
});
