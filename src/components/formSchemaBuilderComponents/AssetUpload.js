import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import AssetUploader from "./AssetUploader";

export default function AssetUpload({
  setActiveDisplayIndex,
  activeDisplayIndex,
  handleSubmitForm,
}) {
  const [uploadType, setUploadType] = useState("");
  const [assetsArray, setAssetsArray] = useState([]);

  useEffect(() => {
    //sets asset array retrieve it from composition
    setAssetsArray([
      { type: "image", name: "banner.png" },
      { type: "audio", name: "background.mp4" },
    ]);
  }, []);

  const handleSubmit = () => {
    if (
      window.confirm(
        "You can edit your template any time after submit, Submit Template ?"
      )
    ) {
      alert("form submitted");
      // call it to submit handleSubmitForm()
    }
  };
  const handleChange = (e) => {
    setUploadType(e.target.value);
  };
  const renderAssetFileUploader = () => {
    return (
      <div>
        {assetsArray.map((asset) => (
          <AssetUploader
            uploadType={uploadType}
            accept={asset.type}
            uploadFileName={asset.name}
          />
        ))}
      </div>
    );
  };
  const renderAssetUploader = () => {
    switch (uploadType) {
      case "folder":
        return (
          <AssetUploader
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

  return (
    <div style={styles.container}>
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
          // style={{ justifyContent: "center" }}
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
      <Button
        children={"back"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
      />
      <br />
      <Button children={"Submit"} onClick={handleSubmit} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    backgroundColor: "white",
    marginTop: 30,
    marginBottom: 30,
    padding: 50,
  },
};
