import { Box, Button, CircularProgress, Container, Divider, IconButton, TextField, Typography } from "@material-ui/core"
import { Text, ExtraSmallText, Heading, SmallText, SubHeading, } from "../../../../common/Typography"
import React, { useCallback, useState } from "react"
import { useAuth } from "services/auth"
import { useAPI } from "services/APIContext"
import { useReAuthFlow } from "services/Re-AuthContext"
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { User } from "services/buzzle-sdk/types"
import { useSnackbar } from "notistack"
import AlertHandler from "common/AlertHandler"
import { copyToClipboard } from "helpers"
import { Visibility, VisibilityOff } from "@material-ui/icons"
export default () => {
    const { reAuthInit } = useReAuthFlow()
    const { user, refreshUser } = useAuth()
    const { User } = useAPI()
    const [loading, setLoading] = useState<"update" | "revoke" | "">("")
    const { enqueueSnackbar } = useSnackbar()
    const [isHidden, setIsHidden] = useState<boolean>(true)
    const handleGenerate = useCallback(async (mode: "update" | "generate") => {
        try {
            setLoading("update")
            await reAuthInit()
            const updated = await User.update({}, { keyOperation: mode })
            await refreshUser(updated.data)
            enqueueSnackbar(`API key ${mode}ed Successfully`, {
                variant: 'success'
            })
            setLoading("")

        } catch (err) {
            setLoading("")
            enqueueSnackbar(`Operation dismissed, Failed to authenticate!`, {
                variant: 'error'
            })
        }
    }, [])
    const handleRevoke = useCallback(async () => {
        try {
            setLoading("revoke")
            await reAuthInit()
            const updated = await User.update({}, { keyOperation: "revoke" })
            await refreshUser(updated.data)
            enqueueSnackbar("API key Revoked Successfully", {
                variant: 'success'
            })
            setLoading("")
        } catch (err) {
            setLoading("")

            enqueueSnackbar("Failed to authenticate, key revokation failed!", {
                variant: 'error'
            })
        }
    }, [])

    const handleCopy = useCallback(async () => {
        try {
            await copyToClipboard(user?.APIKey ?? "")
            enqueueSnackbar("API key copied successfully!", {
                variant: 'success'
            })
        } catch (err) {
            enqueueSnackbar(`${(err as Error).message || "Failed to copy API Key"}`, {
                variant: 'error'
            })
        }
    }, [user])

    const toggleAPIVisibility = () => {
        setIsHidden(v => !v)
    }
    return <Container
        style={{
            padding: 20, paddingLeft: 25, paddingRight: 25,
            margin: 0,
        }}>
        <SubHeading style={{ marginBottom: 15 }}>API Key</SubHeading>
        <AlertHandler message={user?.APIKey ? "Do not disclose API key in public, Use it on server side to make API calls, Using it on client is not recommendable, If you find your API key compromised Revoke or Regenerate the key!" : "API Key is for developers who wants to integerate and automate video rendering on their platform or service!"} severity={user?.APIKey ? "warning" : "info"} />
        {user?.APIKey ? <Box style={{ marginBottom: 15 }}>
            <TextField
                type={!isHidden ? "text" : "password"}
                contentEditable={"false"}
                margin="dense"
                size="small"
                style={{
                    marginBottom: 2, fontSize: 12,
                    maxWidth: 350,
                }}
                InputProps={{
                    endAdornment: <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={toggleAPIVisibility} aria-label="showKey">
                            {isHidden ? <Visibility
                                color="inherit" fontSize={"small"} /> : <VisibilityOff
                                color="inherit" fontSize={"small"} />}
                        </IconButton>
                        <Divider style={{
                            height: 28,
                            margin: 4,
                        }} orientation="vertical" />
                        <IconButton onClick={handleCopy} aria-label="copyKey">
                            <FileCopyOutlinedIcon color="inherit" fontSize={"small"} />
                        </IconButton>
                    </Box>
                }}
                variant="outlined" value={`${user?.APIKey}`} />
        </Box> : <div />}
        <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Button
                disabled={loading === "update"}

                children={loading === "update" ? <CircularProgress color="inherit" size={20} /> : user?.APIKey ? "Re-Generate" : "Generate Key"}
                onClick={() => handleGenerate(user?.APIKey ? "update" : "generate")}
                variant="contained" color="primary" />
            {user?.APIKey ? <Button
                disabled={loading === "revoke"}
                style={{ marginLeft: 15 }} children={loading === "revoke" ? "revoking..." : "Revoke"}
                onClick={handleRevoke}
                color="secondary" /> : <div />}
        </Box>

    </Container>
}