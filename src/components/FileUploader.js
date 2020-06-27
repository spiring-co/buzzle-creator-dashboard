import React, { useState, useEffect } from "react";
import { FormHelperText, Typography, Box, Button } from "@material-ui/core";
import upload from "services/s3Upload";

export default ({
  value,
  onChange,
  label,
  accept,
  fieldName,
  onError,
  error,
  helperText,
  onTouched,
}) => {
  const [progress, setProgress] = useState("0%");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(
    value ? value.substring(value.lastIndexOf("/") + 1) : "No file chosen"
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
      setName(file.name);
      setLoading(true);
      const task = upload(`${fieldName}s/${file.name}`, file);
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
    <Box m={1}>
      <Typography>{label}</Typography>
      <Box p={1}>
        <input
          accept={accept}
          id="contained-button-file"
          type="file"
          onFocus={() => onTouched(true)}
          onChange={uploadFile}
          style={{ display: "none" }}
        />
        <label htmlFor="contained-button-file" style={{ paddingRight: 10 }}>
          <Button
            disabled={loading}
            variant="outlined"
            size="small"
            color="primary"
            component="span">
            {value ? `Change` : `Upload`}
          </Button>
        </label>
        <Typography component={"span"}>
          {loading ? `Uploading: ${progress}` : name}
        </Typography>
      </Box>
      <FormHelperText error={error}>
        {error ? error : helperText}
      </FormHelperText>
    </Box>
  );
};
