import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Container,
    TextField,
    Typography,
} from "@material-ui/core";
import {
    Redirect,
    useHistory,
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "services/auth";
import * as Yup from "yup";
import firebase from "firebase/app"
import { firebaseAuth } from "services/firebase";
import { useSnackbar } from "notistack";
import { SubHeading } from "common/Typography";
type submitProps = {
    email?: string,
    name?: string, password?: string,
    newPassword?: string
}
type modes = "check" | "login" | "forgot-pass" | "change-pass" | "register" | "re-auth"
export default ({ message = "", email = "", onSubmit, handleClose, initialMode = "check", onModeChange }: {
    message?: string, email?: string,
    initialMode?: modes,
    handleClose?: Function,
    onModeChange?: (mode: "check" | "login" | "forgot-pass" | "change-pass" | "register" | "re-auth") => void,
    onSubmit?: (props: submitProps) => void
}) => {
    const { enqueueSnackbar } = useSnackbar()
    const history = useHistory();
    const [mode, setMode] = useState<modes>(initialMode || "check")
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { signUpWithEmailPassword, user, forgotPassword, checkUserExist, signInWithPassword } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleCredentialSubmit = React.useCallback(async ({ email, password, name, newPassword }: submitProps) => {
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
                onSubmit && onSubmit({ email, password, name })
                await signUpWithEmailPassword(email || "", password || "", name || "")
            }
            else if (mode === 'login') {
                onSubmit && onSubmit({ email, password, })
                await signInWithPassword(email || "", password || "")
            }
            else if (mode === "forgot-pass") {
                onSubmit && onSubmit({ email })
                await forgotPassword(email)
                history.replace(`/login?email=${email}&message=Follow the instructions sent to ${email} to recover your password`)
                setMode("login")
            }
            else if (mode === "re-auth") {
                const credential = firebase.auth.EmailAuthProvider.credential((firebaseAuth.currentUser?.email || user?.email || email || ""), password || "");
                await firebaseAuth.currentUser?.reauthenticateWithCredential(credential)
                onSubmit && onSubmit({ email, password })
            }
            else if (mode === "change-pass") {
                try {
                    onSubmit && onSubmit({ password, newPassword })
                    const credential = firebase.auth.EmailAuthProvider.credential((firebaseAuth.currentUser?.email || user?.email || email || ""), password || "");
                    await firebaseAuth.currentUser?.reauthenticateWithCredential(credential)
                    await firebaseAuth.currentUser?.updatePassword(newPassword || password || "")
                    enqueueSnackbar("Password updated successfully!", {
                        variant: "success",
                    })
                } catch (err) {
                    enqueueSnackbar((err as Error)?.message || "Failed to update password", {
                        variant: "error",
                    })
                }

            }
        } catch (e) {
            if ((e as any)?.code === "auth/email-already-in-use") {
                setError(new Error("Something went wrong from our side, Try after sometime"))
            } else {
                setError(e as Error);
            }

        } finally {
            setLoading(false);
        }
    }, [mode])
    useEffect(() => {
        if (email && mode === "check") {
            handleCredentialSubmit({ email })
        }
    }, [email])
    useEffect(() => {
        setError(null)
        onModeChange && onModeChange(mode)
    }, [mode])

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
        } : ((mode === 'login' || mode === 're-auth') ? {
            email,
            password: "",
        } : mode === "change-pass"
            ? { password: "", newPassword: "" }
            : {
                name: "",
                email: email,
                password: "",
            }),
        validationSchema: Yup.object((mode === "check" || mode === "forgot-pass") ? {
            email: Yup.string().email("Invalid email").required("Enter your email to continue"),
        } : ((mode === 'login' || mode === 're-auth') ? {
            email: Yup.string().email("Invalid email").required("Enter your email to continue"),
            password: Yup.string().required("Invalid password"),
        } : mode === "change-pass" ? {
            password: Yup.string().required("Invalid password"),
            newPassword: Yup.string().required("New password cannot be empty, required!"),
        } : {
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email").required("Enter your email to continue"),
            password: Yup.string().required("Invalid password"),
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
                return "Confirming access";
            case "change-pass":
                return "Change password";
            default:
                return ""
        }
    }, [mode])

    return (<Container component="form"
        style={{
            padding: 20, paddingLeft: 25, paddingRight: 25, maxWidth: 375,
            margin: 0,
        }}
        //@ts-ignore
        onSubmit={handleSubmit}
        noValidate
    >
        <SubHeading style={{ marginBottom: 10 }}>{getHeading()}</SubHeading>
        {error ? <Alert style={{ marginBottom: 10 }} severity="error" children={error?.message ?? error} /> : message ? <Alert style={{ marginBottom: 10 }} severity="info" children={message} /> : <div />}
        {mode !== 'change-pass' ? <TextField
            name={"email"}
            InputProps={{
                readOnly: mode === "re-auth",
            }}
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
        /> : <div />}
        {mode === "register" ? <TextField
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
                {`${mode === "change-pass" ? "Current " : ""}Password`}
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                name="password"
                labelWidth={75}
                placeholder={`${mode === "change-pass" ? "Current " : ""}Password`}
                error={touched.password && !!errors.password}
                endAdornment={
                    <>
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end">
                                {!showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    </>
                }
            />
            {touched.password && !!errors.password ? <FormHelperText error={touched.password && !!errors.password}>
                {errors.password}
            </FormHelperText> : <div />}
        </FormControl> : <div />}
        {(mode !== "check" && mode !== 'forgot-pass' && mode === "change-pass") ? <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-newPassword">
                New Password
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-newPassword"
                type={showNewPassword ? "text" : "password"}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newPassword}
                name="newPassword"
                labelWidth={75}
                placeholder="New Password"
                error={touched.newPassword && !!errors.newPassword}
                endAdornment={
                    <>
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle newPassword visibility"
                                onClick={() => setShowNewPassword(v => !v)}
                                onMouseDown={handleMouseDownPassword}
                                edge="end">
                                {!showNewPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    </>
                }
            />
            {touched.newPassword && !!errors.newPassword ? <FormHelperText error={touched.newPassword && !!errors.newPassword}>
                {errors.newPassword}
            </FormHelperText> : <div />}
        </FormControl> : <div />}
        <Box style={{
            width: '100%', marginTop: 20, display: 'flex', alignItems: 'center',
            justifyContent: mode === "change-pass" ? "flex-start" : 'space-between'
        }}>
            {mode === "login" ? <Button style={{ textTransform: "none", fontWeight: 'normal' }}
                size={"small"} color="primary" onClick={() => setMode("forgot-pass")} >
                Trouble signing in?
            </Button> : <div />}
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                {handleClose !== undefined ? <Button
                    onClick={() => handleClose()}
                    disabled={loading || !handleClose}
                    color="primary"
                    style={{ textTransform: "none", fontWeight: 'normal', marginRight: 15 }}
                    children={"cancel"}
                /> : <div />}
                <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    color="primary"
                    children={loading ? <CircularProgress color="inherit" size={20} /> : mode === "change-pass" ? "Update" : mode === "re-auth" ? "Confirm" : mode === "forgot-pass" ? "Send" : mode === "check" ? "Next" : (mode === "register" ? "Create Account" : "Sign in")}
                />
            </Box>
        </Box>
    </Container>
    );
};
