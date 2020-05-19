import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import {
  Container,
  Button,
  TextField,
  IconButton,
  FormControl, OutlinedInput
  , InputLabel,
  FormHelperText,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import useAuth from "services/auth";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({

  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: 50,
  },
  rightEnd: {
    textAlign: 'right'
  }
  , loginButton: {
    margin: 10
  }
}));
export default () => {
  const classes = useStyles()
  const [showPassword, setShowPassword] = useState(false)
  const { t, i18n } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      email: "shivam.sasalol@yahoo.com",
      password: "password",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('enterEmail'))
        .required(t('required')),
      password: Yup.string().required(t('passwordRequired')),
    }),
    onSubmit: async ({ email, password }) => {
      try {
        setLoading(true);
        await login(email, password);
        window.location = "/home"; // should we change getcreator in backend to search for isVeirified is true also
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
  });
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Container>
      <div className={classes.container}>

        <form onSubmit={handleSubmit} noValidate >
          <Typography variant="h4" >Sign In</Typography>
          <p style={{ margin: 10, marginBottom: 20 }}>
            Welcome back fam, what's cooking? 😎
            </p>
          {error && <Alert variant="danger" children={error.message} />}
          <TextField
            fullWidth
            margin={'dense'}
            variant={'outlined'}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            name={"email"}

            placeholder="Enter email"
            label="Email address"
            error={touched.email && !!errors.email}
            helperText={touched.email ? errors?.email : t('wontShareEmail')}
          />
          <div className={classes.rightEnd}>
            <Link to="/forgotPassword">Forgot Password</Link>
          </div>
          <FormControl
            fullWidth
            margin={'dense'}
            variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              name="password"
              labelWidth={75}
              placeholder="Password"
              error={touched.password && !!errors.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText error={errors.password}
            >{errors.password}</FormHelperText>
          </FormControl>

          <Button
            className={classes.loginButton}
            color="primary"
            variant="contained"
            type="submit"
            children={loading ? "Loading..." : "Login"}
            disabled={loading}
          />
        </form>
        <p >
          Don't have an account yet? <Link to="/register">Sign up.</Link>
        </p>
      </div>
    </Container>
  );
};
