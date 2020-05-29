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
  onBack,
  onCancel
}) => {

  const [videoObj] = useContext(VideoTemplateContext);

  const [usedFields, setUsedFields] = useState([]);
  useEffect(() => {

    setUsedFields(videoObj.versions[activeVersionIndex].editableLayers.map(layer => layer.layerName))
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
      <div>
        <Button
          onClick={() => onBack()}
          size="small"
          style={{ width: 'fit-content', marginTop: 10 }}
          children="back"
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
      </div>
    </form>
  );
};
