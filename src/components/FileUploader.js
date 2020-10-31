import React, { useState, useEffect } from "react";
import { FormHelperText, Typography, Box, Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import upload from "services/s3Upload";

import { readFile, ORIENTATION_TO_ANGLE, getRotatedImage } from "helpers/CreateImage"
import { getOrientation } from 'get-orientation/browser'
import ImageCropperDialog from "components/ImageCropperDialog"

export default ({
  required,
  name,
  value,
  onChange,
  label,
  accept,
  uploadDirectory,
  onError,
  cropEnabled = false,
  error,
  helperText,
  height = 400, width = 600,
  onTouched,
}) => {
  const [isError, setIsError] = useState(error)
  const [progress, setProgress] = useState(0);
  const [taskController, setTaskController] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropImage, setCropImage] = useState("")
  const [filename, setFilename] = useState(
    value ? value.substring(value.lastIndexOf("/") + 1) : ""
  );
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, []);

  const handleFile = async (e) => {
    const file =
      (e?.target?.files ?? [null])[0] ||
      (e?.dataTransfer?.files ?? [null])[0];
    if (!file) {
      return;
    }
    onError ? onError({}) : setIsError(null)
    setFilename(file.name);
    await handleUpload(file, file.name.substr(
      file.name.lastIndexOf(".")
    ))
  }
  const handleUpload = async (file, extension) => {
    try {
      setLoading(true);
      const task = upload(
        `${uploadDirectory}/${Date.now()}${extension}`,
        file
      );
      setTaskController(task);
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(parseInt((loaded * 100) / total))
      );
      const { Location: uri } = await task.promise();
      setLoading(false);
      onChange(uri);
    } catch (err) {
      setTaskController(null)
      setFilename(value ? value.substring(value.lastIndexOf("/") + 1) : "");
      setLoading(false);
      onError ? onError(err.message) : setIsError(err.message)
    }

  }
  const handleUploadCancel = async () => {
    try {
      await taskController?.abort().bind(taskController);
    } catch (err) {
      setFilename(value ? value.substring(value.lastIndexOf("/") + 1) : "");
      setLoading(false);
      onError ? onError(err.message) : setIsError(err.message)
      setTaskController(null)
    }
  };
  const handleCropImage = async e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFilename(file.name);
      let imageDataUrl = await readFile(file)
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }
      setCropImage(imageDataUrl)
      setIsCropperOpen(true)
    }
  }
  return (
    <Box m={1}>
      <Typography>{label}{required && " *"}</Typography>
      <Box my={1}>
        <input
          onClick={(event) => {
            event.target.value = null
          }}
          accept={accept}
          id={name}
          type="file"
          onFocus={() => onTouched(true)}
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
        <Typography style={{ marginLeft: 10 }} variant="body2" component={"span"} color="textSecondary">
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
      </Box>
      <FormHelperText error={isError}>
        {isError ? isError : helperText}
      </FormHelperText>
      {isCropperOpen && <ImageCropperDialog
        image={cropImage}
        cropSize={{ height, width }}
        setIsCropperOpen={setIsCropperOpen}
        onUpload={base64 => {
          setIsCropperOpen(false)
          const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
          handleUpload(base64Data, ".png")
        }
        }
        onCancel={() => {
          setFilename(value ? value.substring(value.lastIndexOf("/") + 1) : "");
          setIsCropperOpen(false)
        }} />
      }
    </Box>
  );
};