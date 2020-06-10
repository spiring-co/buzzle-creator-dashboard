import React, { useState } from "react";

export default function AssetUploader({
  uploadType,
  uploadFileName,
  assets,
  setAssets,
  assetsUri,
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(Boolean(assetsUri));

  const handleAssetUpload = (e) => {

    setLoading(true);
    if (uploadType === "folder") {

      setAssets(Object.assign([], e.target.files));
    } else {

      setAssets([...assets, ...e.target.files]);
    }
    setLoading(false);

    setResult(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        border: "1px solid grey",
        borderRadius: 20,
        padding: 20,
        margin: 20,
      }}
    >
      <p>
        <b>{uploadFileName}</b>
      </p>
      {loading ? (
        <p>Uploading...</p>
      ) : result ? (
        <p style={{ color: "green" }}>Success</p>
      ) : (
            <label
              style={{ padding: 5, border: "1px solid black", borderRadius: 10 }}
            >
              Upload Asset
              {uploadType === "folder" ? (
                <input
                  style={{ display: "none" }}
                  type="file"
                  name={uploadFileName}
                  webkitdirectory=""
                  mozdirectory=""
                  onChange={handleAssetUpload}
                />
              ) : (
                  <input
                    style={{ display: "none" }}
                    type="file"

                    name={uploadFileName}
                    onChange={handleAssetUpload}
                  />
                )}
            </label>
          )}
    </div>
  );
}
