import React, { useState } from "react";

import {
  Button,
  CircularProgress,
  Container,
  Box,
  Typography,
} from "@material-ui/core";
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

export default ({ value, onData, name, onTouched, onError }) => {
  const classes = useStyles();

  const [hasPickedFile, setHasPickedFile] = useState(!!value);
  const [hasExtractedData, setHasExtractedData] = useState(!!value);
  const [message, setMessage] = useState(null);

  const handlePickFile = async (e) => {
    e.preventDefault();
    setHasPickedFile(true);
    setHasExtractedData(false);

    try {
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;

      setMessage(
        <>
          <p>Processing...</p>
        </>
      );

      const task = upload(`templates/${file.name}`, file);

      task.on("httpUploadProgress", ({ loaded, total }) =>
        setMessage(
          <>
            <CircularProgress style={{ margin: 10 }} size={28} />
            <p>{`${parseInt((loaded / total) * 100)}% uploaded`}</p>
          </>
        )
      );
      const { Location: uri } = await task.promise();

      setMessage(
        <>
          <CircularProgress style={{ margin: 10 }} size={28} />
          <p>Extracting Layer and compositions ...</p>
        </>
      );

      // un comment it when aeinteract configures extraction using url
      // const { compositions, staticAssets } = await extractStructureFromFile(
      //   uri
      // );
      var { compositions, staticAssets } = await extractStructureFromFile(file);

      setHasExtractedData(true);
      if (!compositions)
        throw new Error("Could not extract project structure.");
      setMessage(<p>{getCompositionDetails(compositions)}</p>);
      setHasExtractedData(true);
      onData({
        compositions,
        staticAssets: staticAssets.map((asset) => ({
          name: asset.substring(asset.lastIndexOf("\\") + 1),
        })),
        fileUrl: uri,
      });
      onTouched(true);
    } catch (error) {
      console.log(error);
      // setHasPickedFile(false);
      setHasExtractedData(false);

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
            {message}
            <br />
            {hasExtractedData && (
              <Button
                color="primary"
                variant="contained"
                children="Change"
                disabled={!hasExtractedData}
                onClick={() => {
                  setHasPickedFile(false);
                  setHasExtractedData(false);
                }}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};
