import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { extractStructureFromFile } from "services/ae";
import styled from "styled-components";

export default ({ value, onData, name, isInvalid }) => {
  const [hasPickedFile, setHasPickedFile] = useState(false);
  const [hasExtractedData, setHasExtractedData] = useState(false);
  const [error, setError] = useState(null);

  const handlePickFile = async (e) => {
    try {
      e.preventDefault();
      const file =
        (e?.target?.files ?? [null])[0] ||
        (e?.dataTransfer?.files ?? [null])[0];
      if (!file) return;
      setHasPickedFile(true);
      onData(await extractStructureFromFile(file));
      setHasExtractedData(true);
    } catch (error) {
      setError(error);
    }
  };

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
            <Button as={"div"}>Pick File</Button>
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
              <p>Good to go!</p>
              <Button
                as={"div"}
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
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
