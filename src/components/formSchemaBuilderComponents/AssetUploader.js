import React, { useState } from "react";
import { Tooltip } from "@material-ui/core"
import upload from "services/s3Upload";
import { Close } from "@material-ui/icons"
export default function AssetUploader({
  asset,
  handleDelete,
  setAssets,
}) {
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState(Boolean(asset?.src));
  const [progress, setProgress] = useState('0%')
  const [error, setError] = useState(null)
  const handleAssetUpload = async (e) => {
    try {
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;
      setLoading(true)
      const task = upload(
        `staticAssets/${file.name}`,
        file
      )
      task.on('httpUploadProgress', ({ loaded, total }) => setProgress(`${parseInt(loaded * 100 / total)}%`))
      const { Location: uri } = await task.promise()
      setLoading(false)
      setAssets(uri)
      setSrc(true);
      setLoading(false);
    } catch (err) {
      setError(err)
    }
  };

  return (
    <div
      style={{
        display: "flex",
        marginTop: 4,
        paddingLeft: 5, paddingRight: 5,
        background: "lightgrey", alignItems: "center"
      }}
    ><label
      style={{
        padding: 5,
        margin: 5,
        marginTop: 0, marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        background: "white",
        border: "1px solid grey",
        fontSize: "13.3333px",
        fontFamily: "Arial",
        borderRadius: 5
      }}
    >
        {src ? 'Change Asset' : "Upload Asset"}

        <input
          style={{ display: "none" }}
          type="file"
          name={asset?.name}
          onChange={handleAssetUpload}
        />

      </label>

      <p style={{ fontSize: 13, marginLeft: 5, marginRight: 5, color: src ? "#3742fa" : "black" }}>
        <b>{asset?.name} {loading && `(${progress})`}</b>
      </p>
      {loading ?
        <div
          style={{
            height: 13,
            width: 80,
            margin: 5,
            marginTop: 0,
            marginBottom: 0,
            border: "1px solid white",
            transition: "background-color 0.5s ease",
            background: `linear-gradient(90deg, #3742fa ${progress}, #fff ${progress})`
          }} />
        :

        <Tooltip
          arrow={true}
          placement="right"
          title="Remove Asset">
          <Close
            onClick={handleDelete}
            align="right"
            style={{
              margin: 5,
              marginTop: 0,
              marginBottom: 0,
              color: "grey"
            }} fontSize="small" />
        </Tooltip>}

    </div>
  );
}
