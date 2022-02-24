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
  CircularProgress,
} from "@material-ui/core";
import path from "path"
import { createStyles, makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { upload } from "services/awsService";
import { getLayersFromComposition, extractStructureFromFile } from "helpers";
import JSZip from "jszip";
import { getExtractionServerIP } from "services/api";
import { SmallText, Text } from "common/Typography";
const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      border: " dashed #ccc",
      flexDirection: 'column',
      display: "flex",
      minHeight: "10rem",
      borderRadius: "0.2rem",
      alignItems: 'center',
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
type IProps = {
  value: string,
  compositions: any,
  assets: Array<{ name: string, type: 'static', src: string }>,
  isEdit: boolean,
  onData: Function,
  name: string, templateType: "ae" | "remotion",
  onTouched: Function,
  onError: Function,
}
export default ({
  value: defaultValue,
  compositions,
  assets,
  isEdit,
  onData,
  name, templateType,
  onTouched,
  onError,
}: IProps) => {
  const classes = useStyles();
  const [value, setValue] = useState<string>(defaultValue);
  const [extractionServer, setExtractionServer] = useState<string>("")
  const [extractionUrlError, setExtractionUrlError] = useState<Error | null>(null)
  const [extractionUrlLoading, setExtractionUrlLoading] = useState<boolean>(true)
  const [edit, setEdit] = useState(isEdit);
  const [type, setType] = useState<"url" | "file">("file");
  const [hasPickedFile, setHasPickedFile] = useState(!!defaultValue);
  const [hasExtractedData, setHasExtractedData] = useState(
    isEdit ? compositions.length !== 0 : !!defaultValue
  );
  const [message, setMessage] = useState(
    compositions.length === 0 ? null : getCompositionDetails(compositions, templateType)
  );
  const [error, setError] = useState<Error | null>(null);
  const handleFetchExtractionUrl = async () => {
    try {
      setExtractionUrlLoading(true)
      setExtractionServer(await getExtractionServerIP(templateType) as string)
      setExtractionUrlLoading(false)
    } catch (err) {
      setExtractionUrlError(new Error("Failed to fetch extraction server state, try afer some time"))
      setExtractionUrlLoading(false)
    }
  }
  useEffect(() => {
    handleFetchExtractionUrl()
  }, [])
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

  const handlePickFile = async (e?: any) => {
    if (hasPickedFile) {
      return
    }
    e && e.preventDefault();
    setMessage(null);
    setError(null);
    setHasPickedFile(true);
    setHasExtractedData(false);
    var config = null
    try {
      if (!edit && !value) {
        var file =
          (e?.target?.files ?? [null])[0] ||
          (e?.dataTransfer?.files ?? [null])[0];
        if (!file) return;
        if (templateType === 'remotion' && file.name.split(".").pop() !== 'zip') {
          setHasPickedFile(false);
          setHasExtractedData(false);
          onTouched(true);
          setError(new Error("Invalid file, Remotion project zip file required!"));
          onError("Invalid file, Remotion project zip file required!");
          return
        }
        if (templateType === 'remotion') {
          //check for buzzle.config.json in zip, if found proceedd further else set error config.json file required!
          config = await JSZip.loadAsync(file)
          const fileNames = Object.keys(config.files)

          if (fileNames.toString().includes("node_modules")) {
            setHasPickedFile(false);
            setHasExtractedData(false);
            onTouched(true);
            setError(new Error("Remove node_modules folder from the zip and try again!"));
            onError("Remove node_modules folder from the zip and try again!");
            return
          }
          try {
            config = await (config?.file('buzzle.config.json')?.async('text'))
            //@ts-ignore
            config = (JSON.parse(config))
          } catch (err) {
            config = null
            console.log(err)
            setHasPickedFile(false);
            setHasExtractedData(false);
            onTouched(true);
            setError(new Error("buzzle.config.json file not found, Please upload zip file with the same"));
            onError("buzzle.config.json file not found, Please upload zip file with the same");
            return
          }
        }
        setMessage("Processing...");
        const task = upload(
          `templates/${Date.now()}.${file.name.split(".").pop()}`,
          file
        );
        task.on("httpUploadProgress", ({ loaded, total }) =>
          setMessage(`${Math.floor((loaded / total) * 100)}% uploaded`)
        );
        var { Location: uri } = await task.promise();
        setValue(uri);
      } else {
        var uri = value;
      }
      setHasExtractedData(true);
      setMessage("Extracting Layer and compositions ...");
      const { compositions, staticAssets } = await extractStructureFromFile(extractionServer,
        uri ? uri : value,
        templateType
      );
      if (!compositions) {
        setError(new Error("Could not extract project structure."));
        onError("Could not extract project structure.");
      } else {
        setMessage(getCompositionDetails(compositions, templateType));
        console.log(compositions);
        setHasExtractedData(true);
        onData({
          compositions,
          staticAssets: staticAssets.map((asset: string) => ({
            name: path.basename(asset),
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
      setError(error as Error);
      onError((error as Error).message);
    }
  };

  const handleReset = () => {
    // change will work in edit mode
    setMessage("");
    setValue("");
    isEdit && setEdit(false);
    setHasPickedFile(false);
    setHasExtractedData(false);
  }
  function getCompositionDetails(comp: any, fileType?: "ae" | "remotion") {
    if (fileType === 'ae') {
      try {
        const allLayers = Object.values(comp)
          .map((c) => {
            const { textLayers, imageLayers } = getLayersFromComposition(c, undefined, fileType || "ae");
            return [...textLayers, ...imageLayers];
          })
          .flat();
        return `${Object.keys(comp).length} compositions & ${allLayers.length
          } layers found`;
      } catch (err) {
        onError(err);
      }
    } else {
      const allFields: Array<string> = Object.keys(comp)?.map(key => comp[key]?.fields ?? [])?.flat()
      const uniqueFields: Array<string> = []
      for (let index = 0; index < allFields.length; index++) {
        const field = allFields[index];
        if (!uniqueFields.includes(field)) {
          uniqueFields.push(field)
        }

      }
      return `${Object.keys(comp)?.length} Compositions & ${uniqueFields?.length} Input Fields Found`;
    }

  }

  const render = {
    url: (
      <Box>
        <Box style={{ display: "flex", alignItems: "center" }}>
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
            disabled={hasPickedFile && !hasExtractedData || extractionUrlLoading || extractionUrlError !== null}
            variant="contained"
            color="primary"
            children={
              error !== null ? "Retry" : hasExtractedData && hasPickedFile
                ? "Change"
                : hasPickedFile
                  ? "Extracting ..."
                  : "Extract"
            }
            onClick={() => {
              setEdit(true);
            }}
          />
        </Box>
        <FormHelperText error={error !== null}
          style={hasExtractedData && hasPickedFile ? { color: "green" } : {}}>
          {(error?.message ?? message)}
        </FormHelperText>
      </Box>
    ),
    file: (
      <Box>
        <input
          disabled={hasPickedFile || extractionUrlLoading || extractionUrlError !== null}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handlePickFile}
          onChange={handlePickFile}
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          name={name}
          accept={templateType === 'remotion' ? "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" : ".aepx,.aep"}
        />
        <label htmlFor="contained-button-file">
          <Box className={classes.content}>
            {extractionUrlError !== null ?
              <SmallText color="error">{extractionUrlError?.message}</SmallText>
              : extractionUrlLoading ? <>
                <CircularProgress color="primary" size={20} />
                <SmallText style={{ marginTop: 10 }}>Please wait while we load some resources...</SmallText>
              </>
                : !hasPickedFile ? (<>
                  <CloudUploadIcon fontSize={"large"} />
                  <Text>Drag & Drop Your {templateType === 'remotion' ? "Remotion project zip file here" : "After effects file here"}</Text>
                  <Text>OR</Text>
                  <Text color="primary">Browse file</Text>
                </>
                ) :
                  (
                    <>
                      {hasExtractedData ? (
                        <Button
                          color="primary"
                          variant="contained"
                          children="Change"
                          disabled={!hasExtractedData}
                          onClick={handleReset}
                        />
                      ) : <div />}

                    </>
                  )}
            <Text color={error !== null ? "error" : "initial"}>
              {(error?.message ?? message)}
            </Text>
            {error !== null ? (
              <Button
                onClick={handlePickFile}
                size="small"
                children="Retry"
                color="secondary"
                variant="contained"
              />
            ) : <div />}
          </Box>
        </label>
      </Box>
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
          onChange={({ target: { value } }) => setType(value as ("file" | "url"))}
          row>
          <FormControlLabel value="file" control={<Radio />} label="File" />
          <FormControlLabel value="url" control={<Radio />} label="URL" />
          {/* {templateType === 'ae' && <TextField
            label="AE extract URL"
            placeholder="Paste URL here"
            margin="dense"
            style={{ marginLeft: 20 }}
            variant="outlined"
            value={extractionServer}
            onChange={({ target: { value } }) => setExtractionServer(value)}
          />} */}
        </RadioGroup>
      </FormControl>
      {render[type]}
    </>
  );
};
