import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Box,
  RadioGroup,
  Radio,
  Paper,
  FormHelperText,
  Snackbar,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
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
export default ({
  value: v,
  compositions,
  assets,
  isEdit,
  onData,
  name,
  onTouched,
  onError,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(v);
  const [aeURL, setAEURL] = useState(process.env.REACT_APP_AE_SERVICE_URL)
  const [edit, setEdit] = useState(isEdit);
  const [type, setType] = useState("file");
  const [hasPickedFile, setHasPickedFile] = useState(!!v);
  const [hasExtractedData, setHasExtractedData] = useState(
    isEdit ? compositions.length !== 0 : !!v
  );
  const [message, setMessage] = useState(
    compositions.length === 0 ? null : getCompositionDetails(compositions)
  );
  const [error, setError] = useState(null);
  useEffect(() => {
    // if template is in edit mode
    if (edit && value) {
      // in edit mode and no composition is extracted till yet
      if (compositions.length === 0) {
        setType("file");
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
  }, [edit]);

  const handlePickFile = async (e) => {
    e && e.preventDefault();
    setMessage(null);
    setError(null);
    setHasPickedFile(true);
    setHasExtractedData(false);
    try {
      if (!edit && !value) {
        var file =
          (e?.target?.files ?? [null])[0] ||
          (e?.dataTransfer?.files ?? [null])[0];
        if (!file) return;
        setMessage("Processing...");
        const task = upload(
          `templates/${Date.now()}${file.name.substr(
            file.name.lastIndexOf(".")
          )}`,
          file
        );
        task.on("httpUploadProgress", ({ loaded, total }) =>
          setMessage(`${parseInt((loaded / total) * 100)}% uploaded`)
        );
        var { Location: uri } = await task.promise();
        setValue(uri);
      } else {
        var uri = value;
      }
      setMessage("Extracting Layer and compositions ...");
      const { compositions, staticAssets } = await extractStructureFromFile(aeURL,
        uri
      );
      console.log(staticAssets);
      setHasExtractedData(true);
      if (!compositions) {
        setError({ message: "Could not extract project structure." });
        onError("Could not extract project structure.");
      } else {
        setMessage(getCompositionDetails(compositions));
        console.log(compositions);
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
      setError(error);
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
      return `${Object.keys(c).length} compositions & ${allLayers.length
        } layers found`;
    } catch (err) {
      onError(err);
    }
  }

  const render = {
    url: (
      <>
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="File URL"
            placeholder="Paste URL here"
            margin="dense"
            style={{ marginRight: 20 }}
            variant="outlined"
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
          />
          <Button
            disabled={
              hasExtractedData && hasPickedFile
                ? false
                : hasPickedFile
                  ? true
                  : false
            }
            size="small"
            variant="outlined"
            color="primary"
            children={
              hasExtractedData && hasPickedFile
                ? "Change"
                : hasPickedFile
                  ? "Extracting ..."
                  : "Extract"
            }
            onClick={() => {
              setEdit(true);
            }}
          />
        </div>
        <FormHelperText style={{ color: "green" }}>
          {hasExtractedData && hasPickedFile ? message : ""}
        </FormHelperText>
      </>
    ),
    file: (
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
                    setValue("");
                    isEdit && setEdit(false);
                    setHasPickedFile(false);
                    setHasExtractedData(false);
                  }}
                />
              )}
            </>
          )}
          <Typography color={error ? "error" : "initial"}>
            {error?.message ?? message}
          </Typography>
          {error && (
            <Button
              onClick={handlePickFile}
              size="small"
              children="Retry"
              color="secondary"
              variant="contained"
            />
          )}
        </Box>
      </Container>
    ),
  };

  return (
    <>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select file input type</FormLabel>
        <RadioGroup
          aria-label="type"
          name="type"
          value={type}
          onChange={({ target: { value } }) => setType(value)}
          row>
          <FormControlLabel value="file" control={<Radio />} label="File" />
          <FormControlLabel value="url" control={<Radio />} label="URL" />
          <TextField
            label="AE extract URL"
            placeholder="Paste URL here"
            margin="dense"
            style={{ marginLeft: 20 }}
            variant="outlined"
            value={aeURL}
            onChange={({ target: { value } }) => setAEURL(value)}
          />
        </RadioGroup>
      </FormControl>
      {render[type]}
    </>
  );
};
