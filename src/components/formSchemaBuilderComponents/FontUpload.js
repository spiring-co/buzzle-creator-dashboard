import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { SegmentsContext } from "contextStore/store";
import { getLayers } from "../../services/helper";
import FontUploader from "./FontUploader";

export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const [videoObj] = useContext(SegmentsContext);
  const [fontList, setFontList] = useState([]);

  // takes all font used in template
  useEffect(() => {
    Object.keys(compositions).map((comp) => {
      setFontList((fontList) =>
        Array.from(
          new Set([
            ...fontList,
            ...getLayers(compositions[comp], "textLayers").map(
              (item) => item.font
            ),
          ])
        )
      );
    });
  }, []);

  return (
    <div style={styles.container}>
      <h3>Upload Font Files</h3>
      <h5 style={{ color: "grey" }}>
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </h5>
      {fontList.map((font) => (
        <FontUploader fontName={font} />
      ))}
      <Button
        children={"back"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
      />
      <br />
      <Button
        children={"Next"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}
      />
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
