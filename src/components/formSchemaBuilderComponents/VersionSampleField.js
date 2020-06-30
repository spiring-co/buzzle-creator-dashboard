import React, { useState, useContext, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import { VideoTemplateContext } from "contextStore/store";
import useActions from "contextStore/actions";
import FileUploader from "components/FileUploader";

export default ({
  isEdit,
  onClick,
  activeVersionIndex,
  editVersion,
  setActiveVersionIndex,
  openVersionDisplay,
  onBack,
  onCancel,
}) => {
  const [error, setError] = useState(null);
  const [videoObj] = useContext(VideoTemplateContext);
  const { editversionKeys } = useActions();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}>
      <FileUploader
        uploadDirectory={"samples"}
        name={"sample" + Math.random()}
        value={videoObj?.versions[activeVersionIndex]?.sample}
        onError={(e) => setError(e.message)}
        onChange={(url) =>
          editversionKeys(activeVersionIndex, {
            sample: url,
          })
        }
        fieldName={"sample"}
        label="Version Sample Video"
        onTouched={() => setError(null)}
        error={error}
        accept={"video/*"}
        helperText={
          "Sample Video of your template should be specific to version you are creating."
        }
      />

      <div>
        <Button
          onClick={() => onBack()}
          size="small"
          style={{ width: "fit-content", marginTop: 10 }}
          children="back"
        />
        <Button
          //disabled={!videoObj?.versions[activeVersionIndex]?.sample}
          style={{ marginTop: 10 }}
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => {
            if (!editVersion) {
              setActiveVersionIndex(activeVersionIndex + 1);
            }
            onClick();

            openVersionDisplay();
          }}
          children={
            isEdit
              ? "Save Edits"
              : editVersion
              ? "Save Edits"
              : "Create Version"
          }
        />
      </div>
    </form>
  );
};
