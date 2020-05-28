import { Button, CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { extractStructureFromFile } from "services/ae";
import { getLayersFromComposition, s3FileReader } from "services/helper";
import styled from "styled-components";

export default ({ value, onData, name, onTouched, onError }) => {
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
  }, []);
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
    >
      <LabelContent>
        {!hasPickedFile && (
          <>
            <p>Drag Your File Here OR</p>
            <PickerButton>Pick File</PickerButton>
            <br />
            <input
              className="invisible"
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
              <p style={{ color: 'green' }}>{`
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
      </LabelContent>
    </Container>
  );
};

const Container = styled.label`
  border: dashed #ccc;
  display: flex;
  height: 10rem;
  border-radius: 0.2rem;
  text-align: center;

  justify-content: center;
`;
const LabelContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PickerButton = styled.div`
  background: #3f51b5;
  color: #fff;
  padding: 10px;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 5px;
  width: fit-content;
`;
