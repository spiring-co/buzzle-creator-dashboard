import React, { useState, useEffect } from "react";
import { FormHelperText, Typography, Box, Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import upload from "services/s3Upload";
export default ({
  required,
  name,
  value,
  onChange,
  label,
  accept,
  uploadDirectory,
  onError,
  error,
  helperText,
  onTouched,
}) => {
  const [isError, setIsError] = useState(error)
  const [progress, setProgress] = useState(0);
  const [taskController, setTaskController] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState(
    value ? value.substring(value.lastIndexOf("/") + 1) : ""
  );

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, []);

  const uploadFile = async (e) => {
    try {
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) {
        return;
      }
      onError({})
      setFilename(file.name);
      setLoading(true);
      const task = upload(
        `${uploadDirectory}/${Date.now()}${file.name.substr(
          file.name.lastIndexOf(".")
        )}`,
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
  };

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
          onChange={uploadFile}
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
    </Box>
  );
};
