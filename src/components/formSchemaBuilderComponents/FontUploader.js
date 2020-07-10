import { Button, FormHelperText, Tooltip } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { apiClient } from "buzzle-sdk";
import React, { useState } from "react";
import upload from "services/s3Upload";
const { Fonts } = apiClient({
  baseUrl: process.env.REACT_APP_API_URL,
  authToken: localStorage.getItem("jwtoken"),
});

export default ({ font, handleDelete, setFont }) => {
  const [name, setName] = useState(
    font?.name !== "" ? font?.name : "No File Choosen"
  );
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState(Boolean(font?.src));
  const [progress, setProgress] = useState("0%");
  const [error, setError] = useState(null);
  const [taskController, setTaskController] = useState(null);
  const handleFontUpload = async (e) => {
    try {
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;
      const temp = font?.name !== "" ? font?.name : file.name.split(".")[0];
      setName(temp);
      setLoading(true);
      const task = upload(
        `fonts/${Date.now()}${file.name.substr(file.name.lastIndexOf("."))}`,
        file
      );
      setTaskController(task);
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(`${parseInt((loaded * 100) / total)}%`)
      );
      const { Location: uri } = await task.promise();
      setLoading(false);
      setFont({ name: temp, src: uri });
      setSrc(true);

      await Fonts.addFont({ name: temp, src: uri });
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };
  const handleUploadCancel = async () => {
    try {
      await taskController?.abort();
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
      }}>
      <div
        style={{
          display: "flex",
          marginTop: 4,
          paddingLeft: 5,
          paddingRight: 5,
          background: "lightgrey",
          alignItems: "center",
        }}>
        <label
          style={{
            padding: 5,
            margin: 5,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            background: "white",
            border: "1px solid grey",
            fontSize: "13.3333px",
            fontFamily: "Arial",
            borderRadius: 5,
          }}>
          {src ? "Change Font" : "Upload Font"}

          <input
            onClick={(event) => {
              event.target.value = null;
            }}
            style={{ display: "none" }}
            type="file"
            onChange={handleFontUpload}
          />
        </label>

        <p
          style={{
            fontSize: 13,
            marginLeft: 5,
            marginRight: 5,
            color: src ? "#3742fa" : "black",
          }}>
          <b>
            {name} {loading && `(${progress})`}
          </b>
        </p>
        {loading ? (
          <>
            <div
              style={{
                height: 13,
                width: 80,
                margin: 5,
                marginTop: 0,
                marginBottom: 0,
                border: "1px solid white",
                transition: "background-color 0.5s ease",
                background: `linear-gradient(90deg, #3742fa ${progress}, #fff ${progress})`,
              }}
            />
            <Button color="secondary" size="small" onClick={handleUploadCancel}>
              cancel
            </Button>
          </>
        ) : (
          <Tooltip arrow={true} placement="right" title="Remove Font">
            <Close
              onClick={handleDelete}
              align="right"
              style={{
                margin: 5,
                marginTop: 0,
                marginBottom: 0,
                color: "grey",
              }}
              fontSize="small"
            />
          </Tooltip>
        )}
      </div>
      {error && <FormHelperText error={true} children={error?.message} />}
    </div>
  );
};
