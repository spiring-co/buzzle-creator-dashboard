import React, { useContext, useEffect } from "react";
import { Button } from "@material-ui/core";
import LayerBuilder from "./LayerBuilder";
import { VideoTemplateContext } from "contextStore/store";

export default ({
  isEdit,
  activeVersionIndex,
  editVersion,
  compositions,
  onSubmit,
  onBack,
  onCancel,
}) => {
  const [videoObj] = useContext(VideoTemplateContext);
  useEffect(() => { }, [isEdit]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}>
      <LayerBuilder
        compositions={compositions}
        editVersion={editVersion}
        activeVersionIndex={activeVersionIndex}
      />
      <div>
        <Button
          onClick={onBack}
          size="small"
          style={{ width: "fit-content", marginTop: 10 }}
          children="back"
        />
        <Button
          style={{ marginTop: 10 }}
          color="primary"
          variant="contained"
          onClick={onSubmit}
          children={"Next"}
        />
      </div>
    </form>
  );
};
