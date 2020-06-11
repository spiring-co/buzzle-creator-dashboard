import { Button, Container, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getLayersFromComposition } from "services/helper";
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import FontUploader from "./FontUploader";

export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const [fontList, setFontList] = useState(["MetalMania-Regular"]);
  const [loading, setLoading] = useState(true);
  // takes all font used in template
  useEffect(() => {
    const allTextLayers = Object.values(compositions)
      .map((c) => getLayersFromComposition(c, "textLayers"))
      .flat();

    const fontNames = Array.from(new Set(allTextLayers.map((l) => l.font)));
    console.log(fontNames);
    fetchFontStatus(fontNames)
      .then(setFontList)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [compositions]);

  const fetchFontStatus = async (fontArray) => {
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
  };
  if (loading) {
    return <Typography variant="h5">Resolving Font...</Typography>;
  }
  return (
    <div>
      <Typography variant="h5">Upload Font Files</Typography>
      <Typography style={{ color: "grey" }}>
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </Typography>
      <Container
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {fontList.map((font, index) => (
          <FontUploader
            key={index}
            fontName={font.name}
            fontStatus={font.resolved}
          />
        ))}
      </Container>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          startIcon={<ArrowBack />}
          style={{ margin: 10 }}
          color="primary"
          variant="outlined"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}>
          Back
        </Button>

        <Button
          endIcon={<ArrowForward />}
          style={{ margin: 10 }}
          color="primary"
          variant="contained"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
