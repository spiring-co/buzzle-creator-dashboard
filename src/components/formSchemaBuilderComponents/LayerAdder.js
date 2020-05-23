import React, { useContext, useState, useEffect } from "react";
import LayerBuilder from "components/formSchemaBuilderComponents/LayerBuilder";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import { Button } from '@material-ui/core'

export default ({
  isEdit,
  activeVersionIndex,
  editVersion,
  compositions,
  setActiveVersionIndex,
  openVersionDisplay,
}) => {

  const [videoObj] = useContext(VideoTemplateContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <LayerBuilder
        compositions={compositions}
        editVersion={editVersion}
        usedFields={usedFields}
        setUsedFields={setUsedFields}
        activeVersionIndex={activeVersionIndex}
        activeIndex={activeIndex}
      />

      <Button
        style={{ marginTop: 10 }}
        color="primary"
        variant="contained"
        onClick={() => {
          if (!editVersion) {
            setActiveVersionIndex(activeVersionIndex + 1);
          }
          openVersionDisplay();
        }}
        children={
          isEdit ? "Save Edits" : editVersion ? "Save Edits" : "Create Version"
        }
      />
    </form>
  );
};
