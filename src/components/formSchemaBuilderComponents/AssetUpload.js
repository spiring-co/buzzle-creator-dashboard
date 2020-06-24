import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Radio,
  FormControlLabel,
  FormControl,
  Typography,
} from "@material-ui/core";

import AssetUploader from "./AssetUploader";
import { makeStyles, CircularProgress } from "@material-ui/core";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import { zipMaker } from "services/helper";
import { ArrowBack } from "@material-ui/icons";
import upload from "services/s3Upload";


const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 30,
    marginBottom: 50,
    padding: 50,
  },
  rowWrapped: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
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
  console.log(staticAssets)
  const [videoObj] = useContext(VideoTemplateContext);
  const [uploadType, setUploadType] = useState(
    (staticAssets[0]?.src ?? false) === "" ? null : "file"
  );
  const [assets, setAssets] = useState(
    staticAssets
  );
  const { editVideoKeys } = useActions();
  const [isFolderResolved, setIsFolderResolved] = useState(
    (typeof staticAssets[0]?.src === "object" || staticAssets[0]?.src !== "")
      ? true
      : false)

  useEffect(() => {
    // set the value to global state of videoTemplate
    editVideoKeys({ staticAssets: assets });
  }, [assets]);



  const handleChange = (e) => {
    setUploadType(e.target.value);
  };

  const renderAssetFileUploader = () => {
    return (
      <div className={classes.rowWrapped}>
        {assets?.length !== 0 ? assets?.map((asset, index) => (
          <AssetUploader
            key={index}
            handleDelete={() => {
              setAssets(assets.filter((a, i) => i !== index))
            }}
            setAssets={src => {
              assets[index] = { ...assets[index], src }
              setAssets(assets)
            }}
            asset={asset}
            isFolderResolved={isFolderResolved}
          />
        )) : <p>No Assets Found!</p>}
      </div>
    );
  };


  const renderAssetUploader = () => {
    switch (uploadType) {
      case "folder":
        return (
          <AssetUploader
            type={uploadType}
            assetsName={assets.map(({ name }) => name)}
            setAssets={(data) => {
              const resolvedAssetNames = data.map(({ name }) => name)
              setAssets(assets.map((asset, index) =>
                resolvedAssetNames.includes(asset?.name)
                  ? data[resolvedAssetNames.indexOf(asset?.name)]
                  : asset))
              setIsFolderResolved(true)
              setUploadType("file")
            }}
            asset={{ name: "Asset Folder" }}
            isFolderResolved={isFolderResolved}

          />
        );
      case "file":
        return renderAssetFileUploader();

      default:
        return;
    }
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4">Upload Asset Files</Typography>
      <p style={{ color: "grey" }}>
        Assets Files includes, files which are not associated with user input,
        and used in template
      </p>
      {!isFolderResolved && <><p>
        <b>Choose Asset Upload Structure</b>
      </p>
        <FormControl component="fieldset">

          <FormControlLabel
            value="folder"
            control={
              <Radio
                onChange={handleChange}
                checked={uploadType === "folder"}
                color="primary"
              />
            }
            label="Complete Assets Folder"
            labelPlacement="end"
          />
          <FormControlLabel
            value="file"
            control={
              <Radio
                onChange={handleChange}
                checked={uploadType === "file"}
                color="primary"
              />
            }
            label="Individual Assets"
            labelPlacement="end"
          />
        </FormControl></>}
      {renderAssetUploader(uploadType)}
      <div style={{ display: "flex", justifyContent: "center" }}>
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
          disabled={isSubmitting}
          style={{ margin: 10 }}
          color={submitError ? "secondary" : "primary"}
          variant={submitError ? "outlined" : "contained"}
          children={
            submitError ? "Retry?" : isSubmitting ? "Submitting" : "Submit"
          }
          onClick={() => handleSubmitForm(videoObj)}
        />
      </div>
    </div>
  );
}
