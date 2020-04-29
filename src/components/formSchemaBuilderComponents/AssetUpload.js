import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Form, Col } from "react-bootstrap";

import AssetUploader from "./AssetUploader";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import { zipMaker } from "services/helper";

export default function AssetUpload({
  setActiveDisplayIndex,
  activeDisplayIndex,
  handleSubmitForm,
}) {
  const [videoObj] = useContext(SegmentsContext);
  const [uploadType, setUploadType] = useState("");
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
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {assetsArray.map((asset) => (
          <AssetUploader
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

  const handleZipAssetUpload = () => {
    try {
      setError(null);
      setLoading(true);
      // filter only files required in template with all files
      const assetNames = assetsArray.map((i) => i.name.toLowerCase());

      const newAssets = assets.filter(({ name }) =>
        assetNames.includes(name.toLowerCase())
      );
      // call zipMaker and upload it to s3 get the uri
      const uri = zipMaker(newAssets);
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
      <Container style={styles.container}>
        <p style={{ color: "red" }}>{error}</p>
        <Button
          style={{
            color: "red",
            border: "1px solid red",
            backgroundColor: "white",
          }}
          onClick={handleZipAssetUpload}
        >
          Retry
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container style={styles.container}>
        <h4>Uploading Assets...</h4>
      </Container>
    );
  }

  return (
    <Container fluid style={styles.container}>
      <Form>
        <h4>Upload Asset Files</h4>
        <p style={{ color: "grey" }}>
          Assets Files includes, files which are not associated with user input,
          and used in template
        </p>
        <p>
          <b>Choose Asset Upload Structure</b>
        </p>
        <Col sm={10}>
          <Form.Check
            onChange={handleChange}
            type="radio"
            checked={uploadType === "folder"}
            label="Complete Assets Folder"
            value="folder"
          />
          <Form.Check
            onChange={handleChange}
            checked={uploadType === "file"}
            type="radio"
            label="Individual Assets"
            value="file"
          />
        </Col>
      </Form>
      {renderAssetUploader(uploadType)}
      <Button
        children={"back"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
      />
      <br />
      <Button children={"Submit"} onClick={handleSubmit} />
    </Container>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",

    alignItems: "center",
    backgroundColor: "white",
    marginTop: 30,
    marginBottom: 50,
    padding: 50,
  },
};
