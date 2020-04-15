import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { extractStructureFromFile } from "services/ae";
import styled from "styled-components";

export default ({ value, onData, name, isInvalid }) => {
  const [hasPickedFile, setHasPickedFile] = useState(false);
  const [hasExtractedData, setHasExtractedData] = useState(false);

  const handlePickFile = async (e) => {
    e.preventDefault();
    const file =
      (e?.target?.files ?? [null])[0] || (e?.dataTransfer?.files ?? [null])[0];
    if (!file) return;
    setHasPickedFile(true);
    onData(await extractStructureFromFile(file));
    setHasExtractedData(true);
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
        {!hasPickedFile && (
          <>
            <p>Drag Your File Here OR</p>
            <Button as={"div"}>Pick File</Button>
            <HiddenFileInput
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
const HiddenFileInput = styled.input`
  display: none;
`;
