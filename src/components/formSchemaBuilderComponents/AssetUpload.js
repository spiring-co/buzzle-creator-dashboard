import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Radio,
  FormControlLabel,
  FormControl,
} from "@material-ui/core";
import AssetUploader from "./AssetUploader";
import { makeStyles } from "@material-ui/core/styles";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import { zipMaker } from "services/helper";
import { ArrowForward, ArrowBack } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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
    flexWrap: "wrap",
    justifyContent: "center",
  },
}));

export default function AssetUpload({
  setActiveDisplayIndex,
  activeDisplayIndex,
  handleSubmitForm,
}) {
  const classes = useStyles();
  const [videoObj] = useContext(VideoTemplateContext);
  const [uploadType, setUploadType] = useState(
    videoObj.assetsUri ? "file" : ""
  );
  const [assetsArray, setAssetsArray] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { editVideoKeys } = useActions();

  useEffect(() => {
    //sets asset array retrieve it from composition
    setAssetsArray([
      { type: "image", name: "banner.png" },
      { type: "audio", name: "background.mp4" },
    ]);
  }, []);

  useEffect(() => {
    if (
      assets.length === assetsArray.length &&
      assetsArray.length !== 0 &&
      uploadType === "file"
    ) {
      handleZipAssetUpload();
    } else if (
      assetsArray.length !== 0 &&
      uploadType === "folder" &&
      assets.length !== 0
    ) {
      handleZipAssetUpload();
    }
  }, [assets]);

  useEffect(() => {
    setAssets([]);
  }, [uploadType]);

  const handleChange = (e) => {
    setUploadType(e.target.value);
  };

  const renderAssetFileUploader = () => {
    return (
      <div className={classes.rowWrapped}>
        {assetsArray.map((asset, index) => (
          <AssetUploader
            key={index}
            assetsUri={videoObj.assetsUri}
            setAssets={setAssets}
            assets={assets}
            uploadType={uploadType}
            accept={asset.type}
            uploadFileName={asset.name}
          />
        ))}
      </div>
    );
  };

  const handleZipAssetUpload = async () => {
    try {
      setError(null);
      setLoading(true);
      // filter only files required in template with all files
      const assetNames = assetsArray.map((i) => i.name.toLowerCase());

      const newAssets = assets.filter(({ name }) =>
        assetNames.includes(name.toLowerCase())
      );
      // call zipMaker and upload it to s3 get the uri
      const uri = await zipMaker(newAssets);
      console.log(uri);
      // save this uri to global State
      editVideoKeys({ assetsUri: uri });

      setLoading(false);
    } catch (err) {
      setLoading(false);

      setError("Something Went Wrong, Please Retry...");
    }
  };

  const renderAssetUploader = () => {
    switch (uploadType) {
      case "folder":
        return (
          <AssetUploader
            assetsUri={videoObj.assetsUri}
            setAssets={setAssets}
            uploadType={uploadType}
            uploadFileName="assets"
            assetsArray={assetsArray}
          />
        );
      case "file":
        return renderAssetFileUploader();

      default:
        return;
    }
  };
  if (error) {
    return (
      <div className={classes.container}>
        <p style={{ color: "red" }}>{error}</p>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleZipAssetUpload}
          children="Retry"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={classes.container}>
        <h4>Uploading Assets...</h4>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <FormControl component="fieldset">
        <h4>Upload Asset Files</h4>
        <p style={{ color: "grey" }}>
          Assets Files includes, files which are not associated with user input,
          and used in template
        </p>
        <p>
          <b>Choose Asset Upload Structure</b>
        </p>
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
      </FormControl>
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
          endIcon={<ArrowForward />}
          style={{ margin: 10 }}
          color="primary"
          variant="contained"
          children={"Submit"}
          onClick={() => handleSubmitForm(videoObj)}
        />
      </div>
    </div>
  );
}
