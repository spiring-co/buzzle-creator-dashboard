import React, { useContext, useEffect, useState } from "react";

export default function AssetUploader({ uploadType, uploadFileName, accept }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch call
  }, []);

  const handleAssetUpload = (e) => {
    console.log(e.target.files);
    setLoading(true);
    // upload to s3
    setLoading(false);
    // set uri in result and add uri of asset to global videoObj
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
              accept={`${accept}/*`}
              name={uploadFileName}
              onChange={handleAssetUpload}
            />
          )}
        </label>
      )}
    </div>
  );
}
