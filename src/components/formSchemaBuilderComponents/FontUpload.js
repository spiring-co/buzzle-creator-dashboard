import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { getLayersFromComposition } from "../../services/helper";
import FontUploader from "./FontUploader";

export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const [fontList, setFontList] = useState([]);

  const [fontsStatus, setFontsStatus] = useState([]);
  // takes all font used in template
  useEffect(() => {
    // Object.keys(compositions).forEach((comp) => {
    var array = [];
    for (let i = 0; i < 2; i++) {
      array = array.concat(
        Array.from(
          new Set([
            ...fontList,
            ...getLayersFromComposition(
              compositions[Object.keys(compositions)[i]],
              "textLayers"
            ).map((item) => item.font),
          ])
        )
      );
    }
    setFontList(array);
    //console.log(array, fontList);
    fetchFontStatus(array);
  }, []);

  useEffect(() => {
    // if all fonts extracted call
    //fetchFontStatus()
  }, [fontList]);

  const fetchFontStatus = async (array) => {
    console.log(array);
    try {
      const response = await fetch(
        `http://localhost:4488/getFontInstallableStatus`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fontArray: array }),
        }
      );
      const result = await response.json();
      console.log(result);
      setFontsStatus(await result.json());
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container fluid style={styles.container}>
      <h3>Upload Font Files</h3>
      <h5 style={{ color: "grey" }}>
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </h5>
      <Container
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        {fontList.map((font, index) => (
          <FontUploader fontName={font} fontStatus={fontsStatus[index]} />
        ))}
      </Container>
      <Button
        children={"back"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
      />
      <br />
      <Button
        children={"Next"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}
      />
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
    marginBottom: 30,
    padding: 50,
  },
};
