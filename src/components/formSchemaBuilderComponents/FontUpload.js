import React, { useEffect, useState } from "react";

import { Button, Container, Typography } from '@material-ui/core'
import { getLayersFromComposition } from "services/helper";
import FontUploader from "./FontUploader";

export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const [fontList, setFontList] = useState([]);
  const [loading, setLoading] = useState(true);
  // takes all font used in template
  useEffect(() => {
    const allTextLayers = Object.values(compositions)
      .map((c) => getLayersFromComposition(c, "textLayers"))
      .flat();

    const fontNames = Array.from(new Set(allTextLayers.map((l) => l.font)));

    fetchFontStatus(fontNames)
      .then(setFontList)
      .catch(console.log)
      .finally(() => setLoading(false));

  }, []);

  const fetchFontStatus = async (fontArray) => {
    try {
      const response = await fetch(
        `http://localhost:4488/getFontInstallableStatus`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fontArray }),
        }
      );
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) {
    return (
      <Container style={styles.container}>
        <Typography variant="h5">Resolving Font...</Typography>
      </Container>
    );
  }
  return (
    <Container style={styles.container}>
      <Typography variant="h4" >Upload Font Files</Typography>
      <Typography variant="h6" style={{ color: "grey" }}>
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </Typography>
      <Container
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        {fontList.map((font, index) => (
          <FontUploader fontName={font.name} fontStatus={font.resolved} />
        ))}
      </Container>
      <Button color="primary"
        variant="contained"
        children={"back"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
      />
      <br />
      <Button variant="contained"
        color="primary"
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
