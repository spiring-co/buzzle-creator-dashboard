import { Button, CircularProgress, Container, Input } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { extractStructureFromFile } from "services/ae";
import { getLayersFromComposition } from "services/helper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      border: " dashed #ccc",
      display: "flex",
      height: "10rem",
      borderRadius: "0.2rem",
      textAlign: "center",
      justifyContent: "center",
    },
    label: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    spacedText: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    invisible: {
      opacity: 0,
      height: 0,
      width: 0,
    },
  })
);
export default ({ value, onData, name, onTouched, onError }) => {
  const classes = useStyles();

  const [hasPickedFile, setHasPickedFile] = useState(false);
  const [hasExtractedData, setHasExtractedData] = useState(false);
  const [compositions, setCompositions] = useState(null);
  //handle extract layers on mount
  useEffect(() => {
    if (value) {
      setHasPickedFile(true);
      // get file data frm s3
      // s3FileReader(value).then(extractStructureFromFile).then(onData).catch(setError);
      setHasExtractedData(true);
    }
  }, [value]);

  const handlePickFile = async (e) => {
    try {
      e.preventDefault();
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;

      setHasPickedFile(true);

      const data = await extractStructureFromFile(file);
      console.log(data);
      setCompositions(data.data);
      setHasExtractedData(true);

      onData(data);
      onTouched(true);
    } catch (error) {
      console.error(error.message);
      setHasPickedFile(false);
      onError(error);
    }
  };
  useEffect(() => {
    console.log(compositions);
  }, [compositions]);

  function getTotalLayers(c) {
    try {
      const allLayers = Object.values(c)
        .map((c) => {
          var { textLayers, imageLayers } = getLayersFromComposition(c);
          return [...textLayers, ...imageLayers];
        })
        .flat();
      return allLayers.length;
    } catch (err) {
      onError(err);
    }
  }
  return (
    <Container
      onDragOver={(e) => e.preventDefault()}
      onDrop={hasPickedFile ? null : handlePickFile}
      onChange={hasPickedFile ? null : handlePickFile}
      for={name}
      className={classes.content}
    >
      <div>
        {!hasPickedFile && (
          <div as="label" htmlFor={name} className={classes.label}>
            <p>Drag Your File Here OR</p>
            <Button variant="contained" onClick={(e) => e.preventDefault()}>
              Pick File
              <Input
                className={classes.invisible}
                id={name}
                name={name}
                type="file"
                accept={[".aepx", ".aep"]}
              />
            </Button>
            <br />
          </div>
        )}
        {hasPickedFile &&
          (hasExtractedData ? (
            <>
              <p className={"text-success"}>{`
              ${Object.keys(compositions || {}).length} compositions &
              ${getTotalLayers(compositions)} layers extracted.`}</p>
              <Button
                color="primary"
                variant="contained"
                children="Change"
                onClick={() => {
                  setHasPickedFile(false);
                  setHasExtractedData(false);
                }}
              />
            </>
          ) : (
            <>
              <CircularProgress style={{ margin: 10 }} size={28} />
              <p>Extracting Layer and compositions ...</p>
            </>
          ))}
      </div>
    </Container>
  );
};
