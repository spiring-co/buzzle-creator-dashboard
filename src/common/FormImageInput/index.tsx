import { Box, Card, Chip, TextField, TextFieldProps, CircularProgress, CircularProgressProps, Button, FormHelperText } from "@material-ui/core"
import FileUploader from "common/FileUploader"
import { ExtraSmallText, SmallText } from "common/Typography"
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import React, { useEffect, useState } from "react"
import { FieldInterface } from "services/buzzle-sdk/types"
import { useAuth } from "services/auth";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { CameraAlt } from "@material-ui/icons";
import { upload } from "services/awsService";
type IProps = {
    mode: "preview" | "form",
    value?: string
    onBlur?: (name: string, touched: boolean) => void,
    onChange?: (name: string, value: string) => void,
    onError?: (name: string, message: string) => void,
    name: string,
    tags?: React.ReactNode
    otherProps?: TextFieldProps,
    helperText?: string
}
function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <ExtraSmallText color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</ExtraSmallText>
            </Box>
        </Box>
    );
}

export default ({ mode, label, tags, type, onError, constraints = {}, onBlur, value = "", helperText, onChange,
    name, placeholder, rendererData, key, otherProps = {} }: IProps & FieldInterface) => {
    const { required = false, width, height } = constraints
    const { user } = useAuth()
    const [fileName, setFileName] = useState<string>("")
    const [error, setError] = useState<Error | null>(null)
    const [progress, setProgress] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [taskController, setTaskController] = useState<ManagedUpload | null>(null);
    const { layerName, extension } = rendererData
    const [input, setInput] = useState<string>(mode === "form" ? value : "")
    const handleBlur = (e?: any) => {
        onBlur && onBlur(name || key, true)
    }
    const handleChange = async (e: any) => {
        setError(null)
        onError && onError(name || key, "")
        const file: File =
            (e?.target?.files ?? [null])[0] ||
            (e?.dataTransfer?.files ?? [null])[0];
        if (!file) {
            return;
        }
        setFileName(file.name)
        const fileExt = file.name.split(".").pop() || ""
        console.log(fileExt, extension)
        if (fileExt !== extension) {
            handleBlur()
            onError ? onError(name || key, `Image required in ${extension} format`) : setError(new Error(`Image required in ${extension} format`))
            return;
        }
        if (mode === 'preview') {
            setInput(URL.createObjectURL(file))
            return
        }
        await handleUpload(file, fileExt)
    }

    const handleUpload = async (file: any, extension: string) => {
        try {
            setLoading(true);
            const task = upload(
                `jobData/${Date.now()}.${extension}`,
                file, 'deleteAfter90Days'
            );
            setTaskController(task);
            task.on("httpUploadProgress", ({ loaded, total }) =>
                setProgress(Math.floor((loaded / total) * 100))
            );
            const { Location: uri } = await task.promise();
            setLoading(false);
            setInput(uri);
        } catch (err) {
            handleBlur()
            setTaskController(null)
            setLoading(false);
            onError ? onError(name || key, (err as Error).message) : setError((err as Error))
        }

    }
    useEffect(() => {
        if (input) {
            let isValid = (input.split('.').pop() === extension || fileName.split('.').pop() === extension)
            if (isValid) {
                onChange && onChange(name || key, input)
                handleBlur()
            } else {
                onError ? onError(name || key, `Image required in ${extension} format`) : setError(new Error(`Image required in ${extension} format`))
                onChange && onChange(name || key, "")
            }
        }
    }, [input])
    return <Box key={key}>
        {mode === "preview" ? <Box>
            <Chip color="primary" style={{
                fontSize: 12, height: 20,
                alignSelf: 'flex-start',
                marginRight: 10, marginBottom: 15
            }} label={`Field Preview for ${layerName}`} size="small" />
            {tags ? tags : <div />}
        </Box> : <div />}
        <input type="file" accept={`.${extension}`} id={key || name || label} onChange={handleChange}
            style={{ display: 'none' }} />

        <Card variant="outlined" style={{
            borderRadius: 5, padding: input ? 0 : 10, display: 'flex',
            width: 110, height: 110,
            alignItems: 'center', justifyContent: 'center'
        }}>
            {loading ?
                <CircularProgressWithLabel value={progress} /> : input ? <img height={"100%"}
                    width="100%" src={input} /> : <Box style={{
                        display: 'flex',
                        flexDirection: 'column', textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <ExtraSmallText>{label}{required ? "*" : ""}{`${mode === 'preview' ? ` (${extension})` : ""}`}</ExtraSmallText>
                    <ImageOutlinedIcon fontSize="large" />
                    {mode == "preview" ? <ExtraSmallText color="textPrimary">{width} x {height}</ExtraSmallText> : <div />}
                </Box>}
        </Card>
        <FormHelperText error={!!error}>
            {!!error ? error?.message : mode === "preview" ? required ? "* Required Field" : "" : helperText}
        </FormHelperText>
        <label htmlFor={key || name || label}>
            <Button style={{ marginTop: 15, alignSelf: 'center' }}
                size="small"
                component="span"
                disabled={loading}
                startIcon={<CameraAlt color="inherit" fontSize={"small"} />}
                children={input ? "Change" : "Upload"} color="primary" variant="outlined" />
        </label>
    </Box>
}