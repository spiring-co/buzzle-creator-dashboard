import React, { useState } from "react";
import LayerBuilder from "components/formSchemaBuilderComponents/LayerBuilder";
import { Button } from "@material-ui/core";

export default ({
  isEdit,
  activeVersionIndex,
  editVersion,
  compositions,
  setActiveVersionIndex,
  openVersionDisplay,
}) => {
  const [activeIndex] = useState(0);
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
        disabled={usedFields.length === 0}
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
