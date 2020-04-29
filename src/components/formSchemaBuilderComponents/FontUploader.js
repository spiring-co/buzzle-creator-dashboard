import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { fetchFontInstallbleStatus } from "services/ae";
export default function FontUploader({ fontName }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(false);
  const [error, setError] = useState(null);

  // takes all font used in template
  useEffect(() => {
    // fetch call
    fetchFontInstallbleStatus(fontName).then((response) => setResult(response));
    setLoading(false);
  }, []);

  const handleFontUpload = (e) => {
    setLoading(true);
    // upload to s3
    setLoading(false);
    // set uri in result and add uri to global videoObj
    setResult(true);
  };

  return (
    <div style={styles.container}>
      <p>
        <b>{fontName}</b>
      </p>
      {loading ? (
        <p>Resolving...</p>
      ) : result ? (
        <p style={{ color: "green" }}>Success</p>
      ) : (
        <label
          style={{ padding: 5, border: "1px solid black", borderRadius: 10 }}
        >
          Upload Font
          <input
            id={fontName}
            style={{ display: "none" }}
            type="file"
            name={fontName}
            accept={[".ttf", ".otf"]}
            onChange={handleFontUpload}
          />
        </label>
      )}
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    border: "1px solid grey",
    borderRadius: 20,
    padding: 20,
    margin: 20,
  },
};
