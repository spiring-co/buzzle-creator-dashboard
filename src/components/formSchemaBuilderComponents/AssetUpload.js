import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Typography,
  Box,
  FormControl, FormControlLabel, Radio,
  List,
  ListItem, RadioGroup, FormLabel,
  ListItemText,
  Divider, makeStyles, CircularProgress,
  ListItemSecondaryAction,
} from "@material-ui/core";
import AssetUploader from "./AssetUploader";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import { getLayersFromComposition } from "services/helper";
// TODO split into individuals
import { ArrowForward, ArrowBack, Done } from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export default function AssetUpload({
  staticAssets,
  setActiveDisplayIndex,
  isSubmitting,
  submitError,
  activeDisplayIndex,
  handleSubmitForm,
}) {
  const classes = useStyles();

  const [isValid, setIsValid] = useState(false);
  const [videoObj] = useContext(VideoTemplateContext);
  const [uploadType, setUploadType] = useState(
    (staticAssets[0]?.src ?? false) === "" ? null : "file"
  );
  const [assets, setAssets] = useState(staticAssets);
  const { editVideoKeys } = useActions();
  const [isFolderResolved, setIsFolderResolved] = useState(
    typeof staticAssets[0]?.src === "object" || staticAssets[0]?.src !== ""
      ? true
      : false
  );

  useEffect(() => {
    // set the value to global state of videoTemplate
    editVideoKeys({ staticAssets: assets });
    console.log(assets)
    setIsValid(assets.every((i) => !!i.src));
  }, [assets]);

  useEffect(() => { }, [isValid]);

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
                  key={asset.name}
                  handleDelete={() => {
                    setAssets(assets.filter((a, i) => i !== index));
                  }}
                  setAssets={(src) => {
                    console.log(src)
                    setAssets(assets =>
                      assets?.map((asset, i) =>
                        i === index ? { ...asset, src } : asset
                      )
                    );
                  }}
                  asset={asset}
                  isFolderResolved={isFolderResolved}
                />
                {index !== assets.length - 1 && <Divider />}</>
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
            /></List>
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
        <FormControl style={{ marginTop: 5 }} component="fieldset" >
          <FormLabel component="legend">Choose Asset Upload Structure</FormLabel>
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
{/*
export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const { editVideoKeys } = useActions();
  const [fontList, setFontList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const classes = useStyles();
  // takes all font used in template
  useEffect(() => {
    const allTextLayers = Object.values(compositions)
      .map((c) => getLayersFromComposition(c, "textLayers"))
      .flat();

    const fontNames = Array.from(new Set(allTextLayers.map((l) => l.font)));
    // this is without checking font Status
    Promise.all(fontNames.map((f) => Fonts.getStatus(f))).then((data) => {
      setFontList(data);
      setLoading(false);
    });
  }, [compositions]);

  useEffect(() => {
    editVideoKeys({ fonts: fontList });
    setIsValid(fontList.every((i) => !!i.src));
  }, [fontList]);

  return (
    <Box>
      <Typography variant="h5">Upload Font Files</Typography>
      <Typography color="textSecondary">
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </Typography>
      {loading ? (
        <Box mt={4}>
          <CircularProgress size={20} />
          <Typography>Resolving Fonts...</Typography>
        </Box>
      ) : (
         
              {fontList && fontList.length ? (
                fontList.map((font, index) => (
                 
                ))
              ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    minHeight={200}>
                    <Typography>No Fonts Found!</Typography>
                  </Box>
                )}
         
        )}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          startIcon={<ArrowBack />}
          color="primary"
          variant="outlined"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}>
          Back
        </Button>

        <Button
          disabled={!isValid}
          endIcon={<ArrowForward />}
          color="primary"
          variant="contained"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
*/}