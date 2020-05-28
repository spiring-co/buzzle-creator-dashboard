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

  const [usedFields, setUsedFields] = useState([]);
  useEffect(() => {
    if (isEdit) {
      setUsedFields(videoObj.versions[activeVersionIndex].editableLayers.map(layer => layer.layerName))
    }
  }, [isEdit])
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
