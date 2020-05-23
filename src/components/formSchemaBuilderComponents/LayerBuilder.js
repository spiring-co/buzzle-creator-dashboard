/* eslint-disable default-case */
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import { getLayersFromComposition } from "services/helper";
import AddFields from "./AddFieldDialog";
import { Button, Paper, Typography } from '@material-ui/core'
import { Wallpaper, TextFields } from '@material-ui/icons'
export default ({
  compositions,
  activeIndex,
  usedFields,
  editVersion,
  activeVersionIndex,
  setUsedFields,
}) => {
  const [videoObj] = useContext(VideoTemplateContext);

  const {
    updateField,
    addField,
    removeField,
    swapFields,
    // restoreFieldsFromPreviousVersion,

  } = useActions();
  const [currentCompositionFields, setCurrentCompositionFields] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [restoreStatus, setRestoreStatus] = useState(false);
  // TODO deepCompare

  useEffect(() => {
    setCurrentCompositionFields([
      ...currentCompositionFields,
      ...getLayersFromComposition(
        compositions[videoObj?.versions[activeVersionIndex]?.composition],
        "textLayers"
      ).map((i) => i.name),
      ...getLayersFromComposition(
        compositions[videoObj?.versions[activeVersionIndex]?.composition],
        "imageLayers"
      ).map((i) => i.name),
      ...getLayersFromComposition(
        compositions[videoObj?.versions[activeVersionIndex]?.composition],
        "pickerLayers"
      ).map((i) => i.name),
    ]);
  }, []);

  useEffect(() => {
    if (
      !restoreStatus &&
      !editVersion &&
      videoObj.versions[0].title !== "" &&
      activeVersionIndex !== 0 &&
      videoObj.versions[activeVersionIndex].editableLayers.length === 0
    ) {
      if (
        window.confirm("Do you want to restore fields from previous version")
      ) {
        // make array of current comp fields

        // restoreFieldsFromPreviousVersion(
        //   activeVersionIndex,
        //   currentCompositionFields
        // );
        // // TODO proper rerender after restore
        // setRestoreStatus(true);
        // setValue(Math.random());
      }
    }
  }, []);

  useEffect(() => { }, [value]);
  //  function to extract layers from compositions, c is composition object and type is textLayer or imageLayer

  const handleAddField = (value) => {

    setUsedFields([...usedFields, value.layerName]);
    addField(activeVersionIndex, value);
  };

  const _editField = (index) => {
    setEditIndex(index);
    setIsDialogVisible(true);
  };

  const _deleteField = (item, index) => {
    setUsedFields(usedFields.filter((i) => i !== item.layerName));
    removeField(activeVersionIndex, activeIndex, index);
  };

  const _onDrop = (e, index) => {
    swapFields(
      activeVersionIndex,
      activeIndex,
      e.dataTransfer.getData("text/plain"),
      index
    );
    setValue(Math.random());
  };

  const editFieldValue = (value) => {
    //if user changed field name
    if (
      videoObj.versions[activeVersionIndex].editableLayers[
        editIndex
      ].layerName !== value.layerName
    ) {
      setUsedFields(
        usedFields.map((item) => {
          if (
            item ===
            videoObj.versions[activeVersionIndex].editableLayers[editIndex].layerName
          ) {
            return value.layerName;
          } else return item;
        })
      );
    }
    updateField(activeVersionIndex, editIndex, value);
    setEditIndex(null);
  };


  const renderFieldPreview = (item, index) => {
    return (
      <FieldPreviewContainer
        _editField={() => _editField(index)}
        _deleteField={() => _deleteField(item, index)}
        _onDrop={(e) => _onDrop(e, index)}
        index={index}
        children={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.type === 'data' ? <TextFields fontSize={70} /> : <Wallpaper />}
        </div>}
      />
    );
  };

  return (
    <Paper style={styles.container}>

      {videoObj.versions[activeVersionIndex].editableLayers.map(renderFieldPreview)}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setEditIndex(null);
          usedFields.length !== currentCompositionFields.length
            ? setIsDialogVisible(true)
            : alert("No layers in the composition");
        }}
        children="Add Field"
      />
      {isDialogVisible &&
        usedFields.length !== currentCompositionFields.length && (
          <AddFields
            textLayers={getLayersFromComposition(
              compositions[videoObj?.versions[activeVersionIndex]?.composition],
              "textLayers"
            )}
            imageLayers={getLayersFromComposition(
              compositions[videoObj?.versions[activeVersionIndex]?.composition],
              "imageLayers"
            )}
            usedFields={usedFields}
            field={
              videoObj.versions[activeVersionIndex].editableLayers[editIndex]
            }
            editField={editIndex !== null}
            toggleDialog={setIsDialogVisible}
            editFieldValue={editFieldValue}
            addField={handleAddField}

          />
        )}
    </Paper>
  );
};

const FieldPreviewContainer = ({
  _editField,
  _deleteField,
  _onDrop,
  index,
  children,
  ...props
}) => {
  return (
    <Paper
      style={styles.fieldPreview}
      draggable={true}
      onDrop={_onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragStart={(ev) => ev.dataTransfer.setData("text/plain", index)}
      {...props}
    >
      {children}
      <Button
        style={{ margin: 10, marginBottom: 0 }}
        variant="contained"
        color="primary"
        onClick={_editField}>Edit</Button>
      <Button
        style={{ margin: 10, marginBottom: 0 }}
        variant="outlined"
        color="secondary"
        onClick={_deleteField}>Delete</Button>
    </Paper>
  );
};

const styles = {
  container: {

    marginTop: 10, marginBottom: 10,
    padding: 15,
  },
  fieldPreview: { padding: 20, margin: 10 },
};
