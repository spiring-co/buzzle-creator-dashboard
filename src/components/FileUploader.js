import React, { useState, useEffect } from "react";
import {
  TextField,
  CircularProgress,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import upload from "services/s3Upload";

export default ({
  value,
  required,
  onChange,
  label,
  fullWidth,
  fieldName,
  onError,
  error,
  helperText,
  onTouched,
}) => {
  const [progress, setProgress] = useState("0%");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const task = upload(`${fieldName}/${file.name}`, file);
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(`${parseInt((loaded * 100) / total)}%`)
      );
      const { Location: uri } = await task.promise();
      setLoading(false);

      onChange(uri);
    } catch (err) {
      onError(err.message);
    }
  };
  return (
    <TextField
      onFocus={() => onTouched(true)}
      InputProps={{
        startAdornment: loading && (
          <InputAdornment position="start">
            <CircularProgress size={18} />
            <p style={{ color: "grey", marginLeft: 10, fontSize: 15 }}>
              Uploading - {progress}
            </p>
          </InputAdornment>
        ),
      }}
      accept="image/*"
      type="file"
      fullWidth={fullWidth}
      margin={"dense"}
      variant={"outlined"}
      label={label}
      onChange={uploadFile}
      InputLabelProps={{
        shrink: true,
      }}
      error={error}
      helperText={error ? error : helperText}
    />
  );
};
