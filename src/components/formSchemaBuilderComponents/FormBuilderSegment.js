/* eslint-disable default-case */
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import { getLayers } from "../../services/helper";
import AddFields from "./AddFieldDialog";

export default ({
  compositions,
  activeIndex,
  usedFields,
  editVersion,
  activeVersionIndex,
  setUsedFields,
}) => {
  const [videoObj] = useContext(SegmentsContext);

  const {
    editSegmentField,
    addSegmentField,
    removeField,
    swapFields,
    restoreFieldsFromPreviousVersion,
    setSegmentKeys,
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
      ...getLayers(
        compositions[videoObj?.versions[activeVersionIndex]?.comp_name],
        "textLayers"
      ).map((i) => i.name),
      ...getLayers(
        compositions[videoObj?.versions[activeVersionIndex]?.comp_name],
        "imageLayers"
      ).map((i) => i.name),
      ...getLayers(
        compositions[videoObj?.versions[activeVersionIndex]?.comp_name],
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
      videoObj.versions[activeVersionIndex].form.segments[activeIndex].fields
        .length === 0
    ) {
      if (
        window.confirm("Do you want to restore fields from previous version")
      ) {
        // make array of current comp fields

        restoreFieldsFromPreviousVersion(
          activeVersionIndex,
          currentCompositionFields
        );
        // TODO proper rerender after restore
        setRestoreStatus(true);
        setValue(Math.random());
      }
    }
  }, []);

  useEffect(() => {}, [value]);
  //  function to extract layers from compositions, c is composition object and type is textLayer or imageLayer

  const addField = (value) => {
    setUsedFields([...usedFields, value.name]);
    console.log(usedFields.length);
    addSegmentField(activeVersionIndex, activeIndex, value);
  };

  const _editField = (index) => {
    setEditIndex(index);
    setIsDialogVisible(true);
  };

  const _deleteField = (item, index) => {
    setUsedFields(usedFields.filter((i) => i !== item.name));
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
      videoObj.versions[activeVersionIndex].form.segments[activeIndex].fields[
        editIndex
      ].name !== value.name
    ) {
      setUsedFields(
        usedFields.map((item) => {
          if (
            item ===
            videoObj.versions[activeVersionIndex].form.segments[activeIndex]
              .fields[editIndex].name
          ) {
            return value.name;
          } else return item;
        })
      );
    }
    editSegmentField(activeVersionIndex, activeIndex, editIndex, value);
    setEditIndex(null);
  };

  if (
    activeIndex < 0 ||
    videoObj.versions[activeVersionIndex].form.segments[activeIndex] == null
  ) {
    return "Add a segment to continue";
  }

  const renderFieldPreview = (item, index) => {
    return (
      <FieldPreviewContainer
        _editField={() => _editField(index)}
        _deleteField={() => _deleteField(item, index)}
        _onDrop={(e) => _onDrop(e, index)}
        index={index}
        children={<p>{JSON.stringify(item)}</p>}
      />
    );
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        value={
          videoObj.versions[activeVersionIndex].form.segments[activeIndex].title
        }
        type="text"
        placeholder="Enter Section Title"
        onChange={(e) => {
          setValue(Math.random());
          setSegmentKeys(activeVersionIndex, activeIndex, {
            title: e.target.value,
          });
        }}
      />
      {videoObj.versions[activeVersionIndex].form.segments[
        activeIndex
      ].fields.map(renderFieldPreview)}
      <button
        onClick={() => {
          usedFields.length !== currentCompositionFields.length
            ? setIsDialogVisible(true)
            : alert("All Fields in this version are used up");
        }}
        children="Add Field"
      />
      {isDialogVisible &&
        usedFields.length !== currentCompositionFields.length && (
          <AddFields
            textLayers={getLayers(
              compositions[videoObj?.versions[activeVersionIndex]?.comp_name],
              "textLayers"
            )}
            imageLayers={getLayers(
              compositions[videoObj?.versions[activeVersionIndex]?.comp_name],
              "imageLayers"
            )}
            usedFields={usedFields}
            field={
              videoObj.versions[activeVersionIndex].form.segments[activeIndex]
                .fields[editIndex]
            }
            editField={editIndex !== null}
            toggleDialog={setIsDialogVisible}
            editFieldValue={editFieldValue}
            addField={addField}
            name={
              videoObj.versions[activeVersionIndex].form.segments[activeIndex]
                .title
            }
          />
        )}
    </div>
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
    <div
      style={styles.fieldPreview}
      draggable={true}
      onDrop={_onDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragStart={(ev) => ev.dataTransfer.setData("text/plain", index)}
      {...props}
    >
      {children}
      <button onClick={_editField}>Edit</button>
      <button onClick={_deleteField}>Delete</button>
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid black",
    margin: "auto",
    padding: 15,
  },
  fieldPreview: { border: " black solid 1px", padding: 20, margin: 10 },
};
