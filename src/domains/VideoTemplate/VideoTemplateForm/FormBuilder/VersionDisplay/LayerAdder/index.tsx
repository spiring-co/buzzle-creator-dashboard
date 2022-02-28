import React, { useContext, useEffect } from "react";
import { Button } from "@material-ui/core";
import LayerBuilder from "./LayerBuilder";
import { VideoTemplateContext } from "contextStore/store";
import { VideoTemplate } from "services/buzzle-sdk/types";
type IProps = {
  activeVersionIndex: number,
  editVersion: boolean,
  compositions: any,
  onSubmit: Function,
  onBack: Function,
}
export default ({
  activeVersionIndex,
  editVersion,
  compositions,
  onSubmit,
  onBack,
}: IProps) => {
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
          onClick={() => onBack()}
          size="small"
          style={{ width: "fit-content", marginTop: 10 }}
          children="back"
        />
        <Button
          style={{ marginTop: 10 }}
          color="primary"
          variant="contained"
          onClick={() => onSubmit()}
          children={"Next"}
        />
      </div>
    </form>
  );
};
