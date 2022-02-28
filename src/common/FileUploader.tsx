import React, { useState, useEffect, forwardRef } from "react";
import { FormHelperText, Typography, Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { upload } from "services/awsService";

import { readFile, ORIENTATION_TO_ANGLE, getRotatedImage } from "helpers/CreateImage"
import { getOrientation } from 'get-orientation/browser'
import ImageCropperDialog from "common/ImageCropperDialog"
import { ManagedUpload } from "aws-sdk/clients/s3";
import { useAuth } from "services/auth";
type IProps = {
  required?: boolean,
  name: string,
  value: string,
  onChange: Function,
  label: string, extension?: string,
  accept?: string,
  uploadDirectory: string,
  onError?: (message: string) => void,
  cropEnabled?: boolean,
  uploadFileNameColor?: string,
  error?: Error,
  helperText: string,
  height?: number, width?: number,
  onTouched?: Function,
  forceUploadDirectory?: boolean,
  storageType: "archive" | "deleteAfter7Days" | "deleteAfter90Days"
}
export default forwardRef(({
  required,
  name,
  value,
  onChange,
  forceUploadDirectory = false,
  label, extension = 'png',
  accept,
  uploadDirectory,
  onError,
  cropEnabled = false,
  error,
  uploadFileNameColor = "",
  helperText,
  height = 400, width = 600,
  onTouched,
  storageType = 'archive'
}: IProps, ref: any) => {
  ref = ref ? ref : { current: "" }
  const [isError, setIsError] = useState<Error | null>(error || null)
  const { user } = useAuth()
  const [type, setType] = useState('file')
  const [progress, setProgress] = useState(0);
  const [taskController, setTaskController] = useState<ManagedUpload | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cropImage, setCropImage] = useState("")
  const [filename, setFilename] = useState<string>(
    value ? value.substring(value.lastIndexOf("/") + 1) : ""
  );
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, []);

  useEffect(() => {
    if (value && !value.startsWith("http")) {
      setIsError(error || new Error("Invalid url, Please re-check the url"))
    } else {
      setIsError(error || null)
    }
  }, [error, value])

  const handleFile = async (e: any) => {

    const file =
      (e?.target?.files ?? [null])[0] ||
      (e?.dataTransfer?.files ?? [null])[0];
    if (!file) {
      return;
    }
    onError ? onError("") : setIsError(null)
    setFilename(file.name);
    await handleUpload(file, file.name.split(".").pop())
  }
  const handleUpload = async (file: any, extension: string) => {
    try {
      setLoading(true);
      const task = upload(
        `${forceUploadDirectory ? "" : `${user?.uid ?? 'user'}/`}${uploadDirectory}/${Date.now()}.${extension}`,
        file, storageType
      );
      setTaskController(task);
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(Math.floor((loaded / total) * 100))
      );
      const { Location: uri } = await task.promise();
      setLoading(false);
      setFilename(uri.substring(uri.lastIndexOf("/") + 1))
      onChange(uri);
      onTouched && onTouched(true)
    } catch (err) {
      setTaskController(null)
      setFilename(value ? value.substring(value.lastIndexOf("/") + 1) : "");
      setLoading(false);
      onError ? onError((err as Error).message) : setIsError((err as Error))
    }

  }
  const handleUploadCancel = async () => {
    if (taskController === null) {
      onTouched && onTouched(true)
      onError ? onError("Failed to cancel upload") : setIsError(new Error("Failed to cancel upload"))
      return
    }
    try {
      await taskController?.abort()//?.bind(taskController);
    } catch (err) {
      setFilename(value ? value.substring(value.lastIndexOf("/") + 1) : "");
      setLoading(false);
      onError ? onError((err as Error).message) : setIsError((err as Error))
      setTaskController(null)
    }
  };
  const handleCropImage = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFilename(file.name);
      let imageDataUrl = await readFile(file)
      const orientation = await getOrientation(file)
      //@ts-ignore
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }
      setCropImage(imageDataUrl)
      setIsCropperOpen(true)
    }
  }
  ref.current = { handleCropImage, handleUploadCancel, handleUpload }
  return (
    <Box mt={2} mb={2}>
      <Typography>{label}{required && " *"}</Typography>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="type"
          name="type"
          value={type}
          onChange={({ target: { value } }) => setType(value)}
          row>
          <FormControlLabel value="file" control={<Radio />} label="File" />
          <FormControlLabel value="url" control={<Radio />} label="URL" />
        </RadioGroup>
      </FormControl>
      <Box my={1}>
        {type === 'file' ?
          <>
            <input
              // onClick={(event) => {
              //   event.target.value = null
              // }}
              accept={accept}
              id={name}
              type="file"
              onChange={cropEnabled ? handleCropImage : handleFile}
              style={{ display: "none" }}
            />
            <label htmlFor={name}>
              <Button
                disabled={loading}
                variant="contained"
                size="small"
                color="primary"
                startIcon={<CloudUploadIcon />}
                component="span">
                {value ? `Change` : `Upload`}
              </Button>
            </label>
            <Typography style={{ marginLeft: 10, ...(uploadFileNameColor ? { color: uploadFileNameColor } : {}) }} variant="body2" component={"span"} color="textSecondary">
              {loading ? ` Uploading: ${progress}% ` : ` ${filename} `}
            </Typography>
            {loading && (
              <Button
                onClick={handleUploadCancel}
                size="small"
                color="secondary"
                component="span">
                Cancel
              </Button>
            )}
          </> : <TextField
            label="File URL"
            placeholder="Paste URL here"
            margin="dense"
            style={{ marginRight: 20 }}
            variant="outlined"
            value={value}
            onChange={({ target: { value } }) => {
              setFilename(value.substring(value.lastIndexOf("/") + 1))
              setIsError(null)
              onChange(value)
            }}
          />}
      </Box>
      <FormHelperText error={isError != null}>
        {isError ? isError?.message : helperText}
      </FormHelperText>
      {isCropperOpen && <ImageCropperDialog
        image={cropImage}
        cropSize={{ height, width }}
        setIsCropperOpen={setIsCropperOpen}
        onUpload={(base64: string) => {
          setIsCropperOpen(false)
          //@ts-ignore
          const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
          handleUpload(base64Data, extension)
        }
        }
        onCancel={() => {
          setFilename(value ? value.substring(value.lastIndexOf("/") + 1) : "");
          setIsCropperOpen(false)
        }} />
      }
    </Box>
  );
})