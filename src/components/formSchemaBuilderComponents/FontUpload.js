import {
  Button,
  Container,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getLayersFromComposition } from "services/helper";
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import FontUploader from "./FontUploader";
import useActions from "contextStore/actions";
import { Fonts } from "services/api";
export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const { editVideoKeys } = useActions();
  const [fontList, setFontList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false)
  // takes all font used in template
  useEffect(() => {
    const allTextLayers = Object.values(compositions)
      .map((c) => getLayersFromComposition(c, "textLayers"))
      .flat();

    const fontNames = Array.from(new Set(allTextLayers.map((l) => l.font)));

    // this is without checking font Status
    Promise.all(fontNames.map((f) => Fonts.getStatus(f))).then((data) => {
      setFontList(data);
      setLoading(false);
    });

  }, [compositions]);

  useEffect(() => {
    editVideoKeys({ fonts: fontList });
    setIsValid(fontList.every(i => !!i.src))
  }, [fontList]);

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h5">Upload Font Files</Typography>
      <Typography style={{ color: "grey" }}>
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </Typography>
      {loading ? (
        <>
          <CircularProgress size={20} style={{ marginTop: 30 }} />
          <p>Resolving Font...</p>
        </>
      ) : (
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 20,
              marginTop: 20,
            }}>
            {fontList.length !== 0 ? (
              fontList.map((font, index) => (
                <FontUploader
                  key={index}
                  font={font}
                  handleDelete={() => {
                    setFontList(fontList.filter((a, i) => i !== index));
                  }}
                  setFont={(value) => {
                    fontList[index] = { ...fontList[index], ...value };
                    setFontList(fontList.map((font, i) => i === index
                      ? ({ ...font, ...value })
                      : font));
                  }}
                />
              ))
            ) : (
                <p>No Font Found!</p>
              )}
          </Container>
        )}
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
          disabled={!isValid}
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
