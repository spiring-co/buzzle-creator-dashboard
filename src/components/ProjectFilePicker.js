import React, { useState, useEffect } from "react";
import { Button, Container, Box, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import upload from "services/s3Upload";
import { extractStructureFromFile } from "services/ae";
import { getLayersFromComposition } from "services/helper";
const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      border: " dashed #ccc",
      display: "flex",
      height: "10rem",
      borderRadius: "0.2rem",
      padding: theme.spacing(2),
      textAlign: "center",
      justifyContent: "center",
    },
    label: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    spacedText: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    invisible: {
      opacity: 0,
      height: 0,
      width: 0,
    },
  })
);
export default ({
  value,
  compositions,
  assets,
  isEdit,
  onData,
  name,
  onTouched,
  onError,
}) => {
  const classes = useStyles();
  const [edit, setEdit] = useState(isEdit);
  const [hasPickedFile, setHasPickedFile] = useState(!!value);
  const [hasExtractedData, setHasExtractedData] = useState(
    isEdit ? compositions.length !== 0 : !!value
  );
  const [message, setMessage] = useState(
    compositions.length === 0 ? null : getCompositionDetails(compositions)
  );
  useEffect(() => {
    // if template is in edit mode
    if (isEdit) {
      // in edit mode and no composition is extracted till yet
      if (compositions.length === 0) {
        handlePickFile();
      }
      // in edit mode but compositions are already extracted (i.e. when  user press back button)
      else {
        onData({
          compositions,
          staticAssets: assets,
          fileUrl: value,
        });
      }
    } else {
      // if in create mode and value is there that means user pressed the back button
      if (value) {
        onData({
          compositions,
          staticAssets: assets,
          fileUrl: value,
        });
      }
    }
  }, []);
  const handlePickFile = async (e) => {
    e && e.preventDefault();
    setMessage(null);
    setHasPickedFile(true);
    setHasExtractedData(false);
    try {
      if (!edit) {
        var file =
          (e?.target?.files ?? [null])[0] ||
          (e?.dataTransfer?.files ?? [null])[0];
        if (!file) return;
        setMessage("Processing...");
        const task = upload(`templates/${file.name}`, file);
        task.on("httpUploadProgress", ({ loaded, total }) =>
          setMessage(`${parseInt((loaded / total) * 100)}% uploaded`)
        );
        var { Location: uri } = await task.promise();
      } else {
        var uri = value;
      }
      setMessage("Extracting Layer and compositions ...");
      const { compositions, staticAssets } = await extractStructureFromFile(
        uri
      );
      setHasExtractedData(true);
      if (!compositions) {
        onError("Could not extract project structure.");
      } else {
        setMessage(getCompositionDetails(compositions));
        setHasExtractedData(true);
        onData({
          compositions,
          staticAssets: staticAssets.map((asset) => ({
            name: asset.substring(asset.lastIndexOf("\\") + 1),
            type: "static",
            src: "",
          })),
          fileUrl: uri,
        });
        onTouched(true);
      }
    } catch (error) {
      setHasPickedFile(false);
      setHasExtractedData(false);
      onTouched(true);
      setMessage(`Error: ${error.message}`);
      onError(error.message);
    }
  };
  function getCompositionDetails(c) {
    try {
      const allLayers = Object.values(c)
        .map((c) => {
          const { textLayers, imageLayers } = getLayersFromComposition(c);
          return [...textLayers, ...imageLayers];
        })
        .flat();
      return `${Object.keys(c).length} compositions & ${
        allLayers.length
      } layers found`;
    } catch (err) {
      onError(err);
    }
  }
  return (
    <Container
      onDragOver={(e) => e.preventDefault()}
      onDrop={hasPickedFile ? null : handlePickFile}
      onChange={hasPickedFile ? null : handlePickFile}
      htmlFor={name}
      className={classes.content}>
      <Box>
        {!hasPickedFile && (
          <label className={classes.label}>
            <Typography>
              Drag Your File Here
              <br /> OR
            </Typography>
            <CloudUploadIcon fontSize={"large"} />
            Pick File
            <input
              className={classes.invisible}
              id={name}
              name={name}
              type="file"
              accept={[".aepx", ".aep"]}
            />
          </label>
        )}
        {hasPickedFile && (
          <>
            <br />
            {hasExtractedData && (
              <Button
                color="primary"
                variant="contained"
                children="Change"
                disabled={!hasExtractedData}
                onClick={() => {
                  // change will work in edit mode
                  setMessage("");
                  isEdit && setEdit(false);
                  setHasPickedFile(false);
                  setHasExtractedData(false);
                }}
              />
            )}
          </>
        )}
        <Typography>{message}</Typography>
      </Box>
    </Container>
  );
};
