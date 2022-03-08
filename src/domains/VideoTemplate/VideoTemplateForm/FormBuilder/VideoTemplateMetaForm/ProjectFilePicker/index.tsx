import React, { useState, useEffect, useRef } from "react";
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
import { getLayersFromComposition, extractStructureFromFile, extractedDataSample } from "helpers";
import JSZip from "jszip";
import { getExtractionServerIP } from "services/api";
import { SmallText, Text } from "common/Typography";
import { useAuth } from "services/auth";
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
  placeholder: string,
  name: string, templateType: "ae" | "remotion",
  onTouched: (value: boolean) => void,
  onError: (message: string) => void,
}
export default ({
  value: defaultValue,
  compositions,
  assets,
  isEdit,
  placeholder,
  onData,
  name, templateType,
  onTouched,
  onError,
}: IProps) => {
  const classes = useStyles();
  const { user } = useAuth()
  const [value, setValue] = useState<string>(defaultValue);
  const [extractionServer, setExtractionServer] = useState<string>("")
  const [isUploadFailed, setIsUploadFailed] = useState<boolean>(false)
  const [extractionUrlError, setExtractionUrlError] = useState<Error | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [edit, setEdit] = useState(isEdit);
  const [type, setType] = useState<"url" | "file">("file");
  const [hasPickedFile, setHasPickedFile] = useState(!!defaultValue);
  const [hasExtractedData, setHasExtractedData] = useState(
    isEdit ? compositions.length !== 0 : !!defaultValue
  );
  const [extractionUrlLoading, setExtractionUrlLoading] = useState<boolean>(!hasExtractedData)
  const [message, setMessage] = useState(
    compositions.length === 0 ? null : getCompositionDetails(compositions, templateType)
  );
  const filePickerRef = useRef<any>(null)

  const [error, setError] = useState<Error | null>(null);
  const handleFetchExtractionUrl = async () => {
    try {
      setExtractionUrlLoading(true)
      const url = (await getExtractionServerIP(templateType) as string)
      if (url) {
        setExtractionServer(url)
      } else {
        throw new Error("Failed")
      }
      setExtractionUrlLoading(false)
    } catch (err) {
      setExtractionUrlError(new Error("Failed to fetch extraction server state, try afer some time"))
      setExtractionUrlLoading(false)
    }
  }
  useEffect(() => {
    if (!hasExtractedData) {
      handleFetchExtractionUrl()
    }
  }, [])
  useEffect(() => {
    // if template is in edit mode and no error in server and not loading
    if (edit && value && !extractionUrlLoading && !!!extractionUrlError) {
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
      if (value && !edit) {
        onData({
          compositions,
          staticAssets: assets,
          fileUrl: value,
        });
      }
    }
  }, [edit, extractionUrlLoading, extractionUrlError]);
  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true)
      setIsUploadFailed(false)
      const task = upload(
        `${user?.uid ?? "users"}/templates/${Date.now()}.${file.name.split(".").pop()}`,
        file
      );
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setMessage(`${Math.floor((loaded / total) * 100)}% uploaded`)
      );
      const { Location } = await task.promise();
      setIsUploading(false)
      return Location
    } catch (err) {
      setIsUploading(false)
      setIsUploadFailed(true)
      return ''
    }
  }
  const handlePickFile = async (e?: any, forceExtract?: boolean) => {
    e && e.preventDefault()
    e && e.stopPropagation()
    setMessage(null);
    setError(null);
    setHasPickedFile(true);
    setHasExtractedData(false);
    var config = null
    var uri = ""
    try {
      if (!value) {
        var file =
          (e?.target?.files ?? [null])[0] ||
          (e?.dataTransfer?.files ?? [null])[0];
        if (!file) return;
        if (templateType === 'remotion' && file.name.split(".").pop() !== 'zip') {
          setHasPickedFile(false);
          setHasExtractedData(false);
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
            onError("buzzle.config.json file not found, Please upload zip file with the same");
            return
          }
        }
        setMessage("Processing...");
        uri = await uploadFile(file)

        if (!uri) {
          setHasPickedFile(false);
          setHasExtractedData(false);
          onError("Failed to upload file, Try again");
          return
        }
        setValue(uri);
      } else {
        uri = value;
      }
      setMessage("Extracting Layer and compositions ...");
      const { compositions, staticAssets } = await extractStructureFromFile(extractionServer,
        uri ? uri : value,
        templateType
      );
      if (!compositions) {
        setError(new Error("Could not extract project structure."));
      } else {
        setHasExtractedData(true);
        setMessage(getCompositionDetails(compositions, templateType));
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
      }

    } catch (error) {
      setHasPickedFile(false);
      setHasExtractedData(false);
      setError((error as Error));
    }
  };

  const handleReset = (e?: any) => {
    // filePickerRef.current.click()////TODO
    e && e.preventDefault();
    setError(null)
    setHasPickedFile(false);
    setHasExtractedData(false);
    setMessage("");
    setValue("");

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
        onError((err as Error)?.message);
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
            disabled={extractionUrlLoading || isUploading || extractionUrlError !== null}
            label="File URL"
            placeholder="Paste URL here"
            margin="dense"
            style={{ marginRight: 20 }}
            variant="outlined"
            value={value}
            onChange={({ target: { value } }) => {
              if (!(hasPickedFile && !hasExtractedData || extractionUrlLoading || extractionUrlError !== null)) {
                setValue(value)
              }
              if (hasExtractedData) {
                setMessage("");
                setHasExtractedData(false);
                setHasPickedFile(false)
              }
            }
            }
          />
          <Button
            disabled={hasPickedFile && !hasExtractedData || extractionUrlLoading || extractionUrlError !== null
              || hasExtractedData || !value}
            variant="contained"
            color="primary"
            children={
              isUploading ? "Uploading File" : error !== null ? "Retry" : hasExtractedData && hasPickedFile
                ? "Extract"
                : hasPickedFile
                  ? "Extracting Data"
                  : "Extract"
            }
            onClick={(e) => {
              handlePickFile();
            }}
          />
        </Box>
        {!isUploadFailed ? <FormHelperText error={error !== null || extractionUrlError !== null}
          style={hasExtractedData && hasPickedFile ? { color: "green" } : {}}>
          {(extractionUrlError?.message) || (error?.message ?? message)}
        </FormHelperText> : <div />}
      </Box>
    ),
    file: (
      <Box>
        <label onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
          onDrop={e => (hasPickedFile || extractionUrlLoading || extractionUrlError !== null || error !== null) ? console.log("Disabled drop") : handlePickFile(e)} htmlFor="contained-button-file">
          <Box className={classes.content}>
            {extractionUrlError !== null ?
              <SmallText color="error">{extractionUrlError?.message}</SmallText>
              : extractionUrlLoading ? <>
                <CircularProgress color="primary" size={20} />
                <SmallText style={{ marginTop: 10 }}>Please wait while we load some resources...</SmallText>
              </>
                : !hasPickedFile && !!!error ? (<>
                  <CloudUploadIcon fontSize={"large"} />
                  <Text>{placeholder}</Text>
                  <Text>OR</Text>
                  <Text color="primary">Browse file</Text>
                </>
                ) :
                  (<>
                    {hasExtractedData ? (
                      <Button
                        style={{ marginBottom: 5 }}
                        color="primary"
                        variant="contained"
                        children="Change"
                        disabled={!hasExtractedData}
                        onClick={handleReset}
                      />
                    ) : <div />}
                  </>)}
            {!isUploadFailed
              ? <Text color={error !== null ? "error" : "initial"}
                style={hasExtractedData && hasPickedFile ? { color: "green" } : {}}>
                {(error?.message ?? message)}
              </Text>
              : <div />}
            {error !== null && !isUploadFailed ? (<Box style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
              <Button
                style={{ marginRight: 10 }}
                color="primary"
                size="small"
                children="Change File"
                onClick={handleReset}
              />
              <Button
                onClick={handlePickFile}
                size="small"
                children="Retry"
                color="secondary"
                variant="contained"
              />
            </Box>
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
      <input
        ref={filePickerRef}
        disabled={hasPickedFile || extractionUrlLoading || extractionUrlError !== null || error !== null}
        onChange={handlePickFile}
        style={{ display: 'none' }}
        id="contained-button-file"
        type="file"
        name={name}
        accept={templateType === 'remotion' ? "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" : ".aepx,.aep"}
      />
      {render[type]}
    </>
  );
};
