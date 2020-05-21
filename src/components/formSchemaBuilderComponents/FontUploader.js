import React, { useContext, useEffect, useState } from "react";
import { SegmentsContext } from "contextStore/store";
import useActions from "contextStore/actions";

export default function FontUploader({ fontName, fontStatus }) {
  const [videoObj] = useContext(SegmentsContext);

  const { editVideoKeys } = useActions();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(
    fontStatus ? true : videoObj.fonts.map((f) => f.name).includes(fontName)
  );

  const [error, setError] = useState(null);

  // takes all font used in template
  useEffect(() => {
    setLoading(false);
    setResult(
      fontStatus ? true : videoObj.fonts.map((f) => f.name).includes(fontName)
    );
  }, [fontStatus]);

  const handleFontUpload = async (e) => {
    try {
      setError(null);
      setLoading(true);
      var data = new FormData();
      data.append("file", e.target.files[0]);

      // var response = await fetch(
      //   "https://infinite-atoll-19947.herokuapp.com/upload_file",
      //   {
      //     mode: "no-cors",
      //     method: "POST",

      //     body: data,
      //   }
      // );

      // var result = await response.text();
      // console.log(result);
      // if (response.ok) {
      //   editVideoKeys({
      //     fonts: [...videoObj.fonts, { name: fontName, uri: result }],
      //   });
      editVideoKeys({
        fonts: [...videoObj.fonts, { name: fontName, uri: true }],
      });
      setLoading(false);
      setResult(true);
      return result;
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
