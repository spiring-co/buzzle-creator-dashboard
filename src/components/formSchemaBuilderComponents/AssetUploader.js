import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  FormControl, FormControlLabel, Radio,
  List,
  ListItem, RadioGroup, FormLabel,
  ListItemText, FormHelperText,
  Divider, makeStyles, CircularProgress,
  ListItemIcon,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { CloudUpload, Done } from "@material-ui/icons";
import upload from "services/s3Upload";
import { OndemandVideo, MusicVideo, Folder, Image } from "@material-ui/icons"
export default function AssetUploader({
  asset,
  handleDelete,
  setAssets,
  type,
  assetsName,
  isFolderResolved
}) {
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState(Boolean(asset?.src));
  const [progress, setProgress] = useState('0%')
  const [error, setError] = useState(null)
  const [taskController, setTaskController] = useState(null)
  const extension = asset?.name.substr(asset?.name.lastIndexOf("."))
  const audioExtensions = [".opus", ".flac", ".webm", ".weba", ".wav", ".ogg", ".m4a", ".mp3", ".oga", ".mid", ".amr", ".aiff", ".wma", ".au", ".aac"]
  const videoExtensions = [".ogm", ".wmp", ".mpg", ".webm", ".ogv", ".mov", ".asx", ".mpeg", ".mp4", ".m4v", ".avi"]
  const imageExtensions = [".tiff", ".pjp", ".pjpeg", ".jfif", ".tif", ".gif", ".svg", ".bmp", ".png", ".jpeg", ".svgz", ".jpg", ".webp", ".ico", ".xbm", ".dib"]
  useEffect(() => {
    if (isFolderResolved && typeof asset?.src === "object") {
      handleUpload(asset.src)
    }
  }, [])
  const handleAssetUpload = async (e) => {

    if (type !== 'folder') {
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;
      handleUpload(file)
    } else {
      const temp = Object.assign([], e?.target.files)
      setAssets(
        temp.filter(({ name }) => assetsName.includes(name))
          .map(file => ({ name: file?.name, type: "static", src: file })))
    }
  };

  const handleUpload = async (file) => {
    try {
      setLoading(true)
      const task = upload(
        `staticAssets/${Date.now()}${file.name.substr(file.name.lastIndexOf("."))}`,
        file
      )
      setTaskController(task)
      task.on('httpUploadProgress', ({ loaded, total }) => setProgress(`${parseInt(loaded * 100 / total)}%`))
      const { Location: uri } = await task.promise()
      setLoading(false)
      setAssets(uri)
      setSrc(true);
      setLoading(false);
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }
  const handleUploadCancel = async () => {
    try {
      await taskController?.abort()
    }
    catch (err) {
      setLoading(false)
      setError(err)
    }
  }
  return (
    <Box>
      <ListItem> <ListItemIcon>
        {videoExtensions.includes(extension)
          ? <OndemandVideo fontSize="large" />
          : audioExtensions.includes(extension) ?
            <MusicVideo fontSize="large" />
            : imageExtensions.includes(extension)
              ? <Image fontSize="large" />
              : <Folder fontSize="large" />}
      </ListItemIcon>
        <ListItemText
          primary={asset.name}
          secondary={
            src ? (
              <>
                <Done style={{ paddingTop: 10 }} color={'green'} size="small" />
                <Typography variant="span" style={{ color: 'green' }}>Uploaded</Typography>
              </>
            ) : (
                "Upload or Ignore to continue"
              )
          }
        />
        <ListItemSecondaryAction>
          <Button
            onClick={handleDelete}
            color="secondary">
            Ignore
  </Button>
        </ListItemSecondaryAction>
      </ListItem>
      <Box m={1}>
        <Box my={1}>
          {type === "folder" ? <input
            id={asset?.name}
            style={{ display: "none" }}
            type="file"
            name={asset?.name}
            webkitdirectory=""
            mozdirectory=""
            onChange={handleAssetUpload}
          />
            : <input
              id={asset?.name}
              style={{ display: "none" }}
              type="file"
              name={asset?.name}
              accept={extension}
              onChange={handleAssetUpload}
            />}
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
          <Typography style={{ marginLeft: 10 }} variant="body2" component={"span"} color="textSecondary">
            {loading ? ` Uploading: ${progress} ` : `${type === "folder"
              ? 'Asset Folder'
              : asset?.name}`}
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
        {error && <FormHelperText error={true} children={error?.message} />}
      </Box>
    </Box>


  );
}
