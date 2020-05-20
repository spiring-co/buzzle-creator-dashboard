import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { extractStructureFromFile } from "services/ae";
import styled from "styled-components";
import { s3FileReader, getLayersFromComposition } from "services/helper";

export default ({ value, onData, name, isInvalid }) => {
  const [hasPickedFile, setHasPickedFile] = useState(false);
  const [hasExtractedData, setHasExtractedData] = useState(false);
  const [error, setError] = useState(null);
  const [compositions, setCompositions] = useState(null);
  //handle extract layers on mount
  useEffect(() => {
    if (value) {
      setHasPickedFile(true);
      // get file data frm s3
      // s3FileReader(value).then(extractStructureFromFile).then(onData).catch(setError);
      setHasExtractedData(true);
    }
  }, []);
  const handlePickFile = async (e) => {
    try {
      e.preventDefault();
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;
      setHasPickedFile(true);
      setCompositions(await extractStructureFromFile(file));

      setHasExtractedData(true);
    } catch (error) {
      setError(error);
    }
  };
  useEffect(() => {
    onData(compositions);
  }, [compositions]);
  function getTotalLayers() {
    var length = 0;
    const allLayers = Object.values(compositions.data)
      .map((c) => {
        var { textLayers, imageLayers } = getLayersFromComposition(c);
        return [...textLayers, ...imageLayers];
      })
      .flat();
    return allLayers.length;
  }
  return (
    <Container
      className="text-muted p-4 bg-white"
      onDragOver={(e) => e.preventDefault()}
      onDrop={hasPickedFile ? null : handlePickFile}
      onChange={hasPickedFile ? null : handlePickFile}
      for={name}
    >
      <LabelContent>
        {error && <p className={"text-danger"}>{error.message}</p>}
        {!hasPickedFile && (
          <>
            <p>Drag Your File Here OR</p>
            <PickerButton>
              Pick File</PickerButton>
            <br />
            <input
              className="invisible"
              isInvalid={isInvalid}
              id={name}
              name={name}
              type="file"
              accept={[".aepx", ".aep"]}
            />
          </>
        )}
        {hasPickedFile &&
          (hasExtractedData ? (
            <>
              <p className={"text-success"}>{`${
                Object.keys(compositions.data).length
                } compositions and ${getTotalLayers()} layers extracted.`}</p>
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
              <p>Extracting Layer and compositions ...</p>
            ))}
      </LabelContent>
    </Container>
  );
};

const Container = styled.label`
  border: dashed #ccc;
  display: block;
  height: 10rem;
  border-radius: 0.2rem;
  text-align: center;
  position: relative;
`;
const LabelContent = styled.div`
 display:flex;
 flex-direction:column;
 align-items:center;
 justify-content:center;
`;

const PickerButton = styled.div`

  background:#3f51b5; color: #fff;
  padding: 10px;
  padding-top: 6px;
   padding-bottom: 6px;
  border-radius: 5px;
  width: fit-content;
`
