import React, { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import {
    Link as RouterLink,
    Redirect,
    useLocation,
    useHistory,
} from "react-router-dom";

import { useAuth } from "services/auth";
import * as Yup from "yup";

import {
    Box,
    Container,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    Link,
    Paper,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Alert } from "@material-ui/lab";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Branding from "components/Branding";

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
    const { state } = useLocation();
    const history = useHistory();
    const { message } = state || {};

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
    } = useFormik({
        initialValues: {
            email: "harshb.work@gmail.com",
            password: "butter",
            role: "user"
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t("enterEmail")).required(t("required")),
            password: Yup.string().required(t("passwordRequired")),
            role: Yup.string().required()
        }),
        onSubmit: async ({ email, password, role }) => {
            try {
                setLoading(true);
                await login(email, password, role);
                setIsLoggedIn(true);
                history.push("/home");
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        },
    });
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    if (isLoggedIn) return <Redirect to={"/home"} />;

    return (
        <Box mt={5}>
            <Container
                component="form"
                onSubmit={handleSubmit}
                noValidate
                maxWidth={"xs"}>
                <Paper className={classes.content}>
                    <CssBaseline />
                    <Typography
                        variant="h4"
                        style={{
                            textAlign: "center",
                            marginBottom: 16,
                            fontWeight: 800,
                            fontSize: "2.5rem",
                            fontFamily: "Poppins",
                        }}>
                        Buzzle!
          </Typography>
                    <Typography variant="h6">Sign In</Typography>
                    <Typography className={classes.spacedText}>
                        Welcome back fam, what&apos;s cooking?{" "}
                        <span aria-label="cool" role="img" children="😎" />
                    </Typography>

                    {error && <Alert severity="error" children={error.message} />}
                    {message && <Alert severity="info" children={message} />}

                    <TextField
                        required
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
                                : t("wontShareEmail")
                        }
                    />
                    <FormControl
                        required
                        fullWidth margin="dense" variant="outlined">
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
                        />
                        <FormHelperText error={errors.password}>
                            {errors.password}
                        </FormHelperText>
                    </FormControl>

                    <Box textAlign="end">
                        <Button size={"small"} component={RouterLink} to="/forgotPassword">
                            Forgot Password
            </Button>
                    </Box>

                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        children={loading ? "Loading..." : "Login"}
                        disabled={loading}
                    />
                </Paper>
            </Container>
            <Branding dark />
        </Box>
    );
};
