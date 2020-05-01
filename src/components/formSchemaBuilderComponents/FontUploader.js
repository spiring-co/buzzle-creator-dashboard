import React, { useContext, useEffect, useState } from "react";
import { SegmentsContext } from "contextStore/store";
import useActions from "contextStore/actions";

export default function FontUploader({ fontName, fontStatus }) {
  const [videoObj] = useContext(SegmentsContext);
  const { editVideoKeys } = useActions();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(fontStatus);
  const [error, setError] = useState(null);

  // takes all font used in template
  useEffect(() => {
    // fetch call
    setResult(videoObj.fonts.map((i) => i.name).includes(fontName));
    //fetchFontInstallbleStatus(fontName).then((response) => setResult(response));
    setLoading(false);
  }, [fontStatus]);

  const handleFontUpload = (e) => {
    try {
      setError(null);
      setLoading(true);
      // upload to s3
      // get the url
      // set the url
      editVideoKeys({
        fonts: [...videoObj.fonts, { name: fontName, uri: "here comes uri" }],
      });

      setLoading(false);
      // set uri in result and add uri to global videoObj
      setResult(true);
    } catch (err) {
      setLoading(false);
      setError("Failed, Retry?");
    }
  };

  return (
    <div style={styles.container}>
      <p>
        <b>{fontName}</b>
      </p>
      <p style={{ color: "red" }}>{error}</p>
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
