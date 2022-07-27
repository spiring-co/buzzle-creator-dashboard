import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import path from "path"
import {
  CloudUpload,
  Done,
  Folder,
  Image,
  MusicVideo,
  OndemandVideo,
} from "@material-ui/icons";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { Text } from "common/Typography";
import React, { useContext, useEffect, useState } from "react";
import { upload } from "services/awsService";
import { useAuth } from "services/auth";
import { VideoTemplateContext } from "contextStore/store";
import { VideoTemplate } from "services/buzzle-sdk/types";

type IProps = {
  asset: { name: string, type: 'static', src: string | File },
  handleDelete?: Function,
  setAssets: (uri: Array<{ name: string, src: File }> | string) => void,
  type: "folder" | "file",
  assetsNames: Array<string>,
  isFolderResolved: boolean,
}
export default function AssetUploader({
  asset,
  handleDelete = undefined,
  setAssets,
  type,
  assetsNames,
  isFolderResolved,
}: IProps) {
  const [loading, setLoading] = useState(false);
  const [videoObj]: Array<VideoTemplate> = useContext(VideoTemplateContext)
  const { user } = useAuth()
  const [src, setSrc] = useState<string>(
    typeof asset?.src === "string" ? asset?.src : ''
  );
  const [inputType, setInputType] = useState<'file' | 'url'>('file')
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [taskController, setTaskController] = useState<ManagedUpload | null>(null);
  const extension = `.${asset?.name.split(".").pop()}`
  const audioExtensions = [
    ".opus",
    ".flac",
    ".webm",
    ".weba",
    ".wav",
    ".ogg",
    ".m4a",
    ".mp3",
    ".oga",
    ".mid",
    ".amr",
    ".aiff",
    ".wma",
    ".au",
    ".aac",
  ];
  const videoExtensions = [
    ".ogm",
    ".wmp",
    ".mpg",
    ".webm",
    ".ogv",
    ".mov",
    ".asx",
    ".mpeg",
    ".mp4",
    ".m4v",
    ".avi",
  ];
  const imageExtensions = [
    ".tiff",
    ".pjp",
    ".pjpeg",
    ".jfif",
    ".tif",
    ".gif",
    ".svg",
    ".bmp",
    ".png",
    ".jpeg",
    ".svgz",
    ".jpg",
    ".webp",
    ".ico",
    ".xbm",
    ".dib",
  ];
  useEffect(() => {
    if (isFolderResolved && typeof asset?.src !== "string") {
      handleUpload(asset.src as File);
    }
  }, []);
  useEffect(() => {
    if (typeof asset.src === 'string' && asset.src && !asset.src.startsWith('http')) {
      setError(new Error("Invalid url, Please re-check the url"))
    }
  }, [asset])
  const handleAssetUpload = async (e: any) => {
    if (type !== "folder") {
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;
      handleUpload(file);
    } else {
      const temp: Array<File> = Object.assign([], e?.target.files);
      setAssets(temp.filter(({ name }) => assetsNames.includes(name))?.map((file) => ({ name: file.name, src: file }))
      );
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setError(null);
      setProgress(null)
      setLoading(true);
      const task = upload(
        `templates/${videoObj?.title}/assets/${file.name || `${Date.now()}.${file?.name.split(".").pop()}`}`,
        file
      );
      setTaskController(task);
      task.on("httpUploadProgress", ({ loaded, total }) =>
        setProgress(`${Math.floor((loaded / total) * 100)}%`)
      );
      let { Location: uri } = await task.promise();
      uri = uri.startsWith("http") ? uri : `https://${uri}`
      setLoading(false);
      setAssets(uri);
      setSrc(uri);
      setProgress(null)
      setLoading(false);
    } catch (err) {
      setProgress(null)
      setLoading(false);
      setError(err as Error);
      setTaskController(null);
    }
  };
  const handleUploadCancel = async () => {
    try {
      await taskController?.abort();
    } catch (err) {
      setLoading(false);
      setError(err as Error);
      setTaskController(null);
    }
  };
  return (
    <Box>
      <ListItem>
        <ListItemIcon>
          {videoExtensions.includes(extension) ? (
            <OndemandVideo fontSize="large" />
          ) : audioExtensions.includes(extension) ? (
            <MusicVideo fontSize="large" />
          ) : imageExtensions.includes(extension) ? (
            <Image fontSize="large" />
          ) : (
            <Folder fontSize="large" />
          )}
        </ListItemIcon>
        <Box>
          <Text style={{ fontWeight: 600 }}>{asset?.name}</Text>
          {type === "file" ? <FormControl component="fieldset">
            <RadioGroup
              aria-label="type"
              name="type"
              value={inputType}
              onChange={({ target: { value } }) => setInputType(value as "file" | "url")}
              row>
              <FormControlLabel value="file" control={<Radio />} label="File" />
              <FormControlLabel value="url" control={<Radio />} label="URL" />
            </RadioGroup>
          </FormControl> : <div />}
          {inputType == 'file' || type !== 'file' ? <Box m={1} ml={0}>
            {type === "folder" ? (
              <input
                id={asset?.name}
                style={{ display: "none" }}
                type="file"
                name={asset?.name}
                //@ts-ignore
                webkitdirectory=""
                mozdirectory=""
                onChange={handleAssetUpload}
              />
            ) : (
              <input
                id={asset?.name}
                style={{ display: "none" }}
                type="file"
                name={asset?.name}
                accept={extension}
                onChange={handleAssetUpload}
              />
            )}
            <label htmlFor={asset?.name}>
              <Button
                disabled={loading}
                variant="contained"
                size="small"
                color="primary"
                startIcon={<CloudUpload />}
                component="span">
                {src ? `Change` : `Upload`}
              </Button>
            </label>
            <Typography
              style={{ marginLeft: 10, ...(typeof asset?.src === 'string' && type === 'file' && !loading ? { color: 'green' } : {}) }}
              variant="body2"
              component={"span"}
              color="textSecondary">
              {loading
                ? ` Uploading: ${progress || "0%"} `
                : `${type === "folder" ? "" : typeof asset.src === 'string' ? path.basename(asset?.src as string) : ""}`}
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
            : <Box>
              <TextField
                label="File URL"
                placeholder="Paste URL here"
                margin="dense"
                style={{ marginRight: 20 }}
                variant="outlined"
                value={src}
                onChange={({ target: { value } }) => {
                  setError(null)
                  setAssets(value);
                  setSrc(value);
                }}
              /></Box>}
          <FormHelperText error={!!error} children={error ? error?.message : asset?.src ? "" : `Upload ${type === 'folder' ? "Folder" : 'or ignore to continue'}`} />
        </Box>
        <ListItemSecondaryAction>
          <Button disabled={!!!handleDelete || !!src} onClick={() => handleDelete ? handleDelete() : console.log("disabled")} color="secondary">
            Ignore
          </Button>
        </ListItemSecondaryAction>
      </ListItem >

    </Box >
  );
}
