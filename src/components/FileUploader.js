import React, { useState, useEffect } from "react";
import {
  Button,
  FormHelperText,
} from "@material-ui/core";
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
  const [taskController, setTaskController] = useState(null)
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(value
    ? value.substring(value.lastIndexOf("/") + 1) : "No file choosen")
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
      setName(file.name)
      setLoading(true);
      const task = upload(`${fieldName}s/${Date.now()}${file.name.substr(file.name.lastIndexOf("."))}`, file);
      setTaskController(task)
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(`${parseInt((loaded * 100) / total)}%`)
      );
      const { Location: uri } = await task.promise();
      setLoading(false);

      onChange(uri);
    } catch (err) {
      setName(value
        ? value.substring(value.lastIndexOf("/") + 1) : "No file choosen")
      setLoading(false);
      onError(err.message);
    }
  };

  const handleUploadCancel = async () => {
    try {
      await taskController?.abort()
    }
    catch (err) {
      setName(value
        ? value.substring(value.lastIndexOf("/") + 1) : "No file choosen")
      setLoading(false)
      onError(err.message);
    }
  }
  return (
    <><p style={{ marginBottom: 0, }}>
      {label}
    </p>
      <div
        style={{
          display: "flex",
          paddingLeft: 5,
          paddingRight: 5,
          alignItems: "center"
        }}
      >

        <label
          style={{
            padding: 5,
            margin: 5,
            marginTop: 0, marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            background: "white",
            border: "1px solid grey",
            fontFamily: "Arial",
            borderRadius: 5
          }}
        >
          {value ? `Change` : `Upload`}

          <input
            onFocus={() => onTouched(true)}
            accept={accept}
            style={{ display: "none" }}
            type="file"
            onChange={uploadFile}
          />

        </label>
        <p style={{
          fontSize: 13,
          marginLeft: 5,
          marginRight: 5,
          color: value ? "#3742fa" : "black"
        }}>
          <b>{name} {loading && `(${progress})`}</b>
        </p>
        {
          loading &&
          <>
            <div
              style={{
                height: 13,
                width: 80,
                margin: 5,
                marginTop: 0,
                marginBottom: 0,
                border: "1px solid black",
                transition: "background-color 0.5s ease",
                background: `linear-gradient(90deg, #3742fa ${progress}, #fff ${progress})`
              }} />
            <Button
              color="secondary"
              size="small"
              onClick={handleUploadCancel}>cancel</Button>
          </>
        }
      </div >
      <FormHelperText style={{ marginBottom: 10, marginTop: 0 }} error={error}>{error ? error : helperText}</FormHelperText>
    </>
    // <TextField
    //   InputProps={{
    //     startAdornment: loading && (
    //       <InputAdornment position="start">
    //         <CircularProgress size={18} />
    //         <p style={{ color: "grey", marginLeft: 10, fontSize: 15 }}>
    //           Uploading - {progress}
    //         </p>
    //       </InputAdornment>
    //     ),
    //   }}
    //   accept="image/*"
    //   type="file"
    //   fullWidth={fullWidth}
    //   margin={"dense"}
    //   variant={"outlined"}
    //   label={label}
    //   onChange={uploadFile}
    //   InputLabelProps={{
    //     shrink: true,
    //   }}
    //   error={error}
    //   helperText={}
    // />
  );
};
