import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import AssetUploader from "./AssetUploader";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export default function AssetUpload({
  staticAssets,
  activeDisplayIndex,
  setActiveDisplayIndex,
  isSubmitting,
  submitError,
  handleSubmitForm,
}) {
  const classes = useStyles();

  const [isValid, setIsValid] = useState(false);

  const [videoObj] = useContext(VideoTemplateContext);
  const { editVideoKeys } = useActions();

  const [uploadType, setUploadType] = useState(
    (staticAssets[0]?.src ?? false) === "" ? null : "file"
  );

  const [assets, setAssets] = useState(staticAssets);
  const [isFolderResolved, setIsFolderResolved] = useState(
    typeof staticAssets[0]?.src === "object" || staticAssets[0]?.src !== ""
      ? true
      : false
  );

  useEffect(() => {
    // set the value to global state of videoTemplate
    editVideoKeys({ staticAssets: assets });
    setIsValid(assets.every((i) => !!i.src));
  }, [assets]);

  useEffect(() => {}, [isValid]);

  const handleChange = (e) => {
    setUploadType(e.target.value);
  };

  const renderAssetFileUploader = () => {
    return (
      <Box mt={2}>
        <List className={classes.root}>
          {assets?.length !== 0 ? (
            assets?.map((asset, index) => (
              <>
                <AssetUploader
                  key={index}
                  handleDelete={() => {
                    setAssets(assets.filter((a, i) => i !== index));
                  }}
                  setAssets={(src) => {
                    setAssets(
                      assets?.map((asset, i) =>
                        i === index ? { ...asset, src } : asset
                      )
                    );
                  }}
                  asset={asset}
                  isFolderResolved={isFolderResolved}
                />
                {index !== assets.length - 1 && <Divider />}
              </>
            ))
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minHeight={200}>
              <Typography>No Assets Found!</Typography>
            </Box>
          )}
        </List>
      </Box>
    );
  };

  const renderAssetUploader = () => {
    switch (uploadType) {
      case "folder":
        return (
          <List className={classes.root}>
            <AssetUploader
              type={uploadType}
              assetsName={assets.map(({ name }) => name)}
              setAssets={(data) => {
                const resolvedAssetNames = data.map(({ name }) => name);
                setAssets(
                  assets.map((asset, index) =>
                    resolvedAssetNames.includes(asset?.name)
                      ? data[resolvedAssetNames.indexOf(asset?.name)]
                      : asset
                  )
                );
                setIsFolderResolved(true);
                setUploadType("file");
              }}
              asset={{ name: "Asset Folder" }}
              isFolderResolved={isFolderResolved}
            />
          </List>
        );
      case "file":
        return renderAssetFileUploader();

      default:
        return;
    }
  };

  return (
    <Box>
      <Typography variant="h5">Upload Asset Files</Typography>

      {!isFolderResolved && (
        <FormControl style={{ marginTop: 5 }} component="fieldset">
          <FormLabel component="legend">
            Choose Asset Upload Structure
          </FormLabel>
          <RadioGroup value={uploadType} onChange={handleChange} row>
            <FormControlLabel
              value="folder"
              control={<Radio />}
              label="Complete Assets Folder"
              labelPlacement="end"
            />
            <FormControlLabel
              value="file"
              control={<Radio />}
              label="Individual Assets"
              labelPlacement="end"
            />
          </RadioGroup>
        </FormControl>
      )}
      {renderAssetUploader(uploadType)}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          startIcon={<ArrowBack />}
          style={{ margin: 10 }}
          color="primary"
          variant="outlined"
          children={"Back"}
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
        />
        <Button
          endIcon={isSubmitting && <CircularProgress color="white" size={15} />}
          disabled={isSubmitting || !isValid}
          style={{ margin: 10 }}
          color={submitError ? "secondary" : "primary"}
          variant={submitError ? "outlined" : "contained"}
          children={
            submitError ? "Retry" : isSubmitting ? "Submitting" : "Submit"
          }
          onClick={() => handleSubmitForm(videoObj)}
        />
      </Box>
    </Box>
  );
}
