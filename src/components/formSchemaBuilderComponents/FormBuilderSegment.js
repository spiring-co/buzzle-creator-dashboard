import React, { useContext, useEffect, useState } from "react";

import useActions from "../../contextStore/actions";
import { SegmentsContext } from "../../contextStore/store";
import AddFields from "./AddFieldDialog";

export default ({ activeIndex, usedFields, setUsedFields }) => {
  const [segments] = useContext(SegmentsContext);
  const {
    editSegmentField,
    addSegmentField,
    removeField,
    swapFields,
    setSegmentKeys
  } = useActions();

  const [editIndex, setEditIndex] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [value, setValue] = useState(null);
  // TODO deepCompare
  useEffect(() => {}, [activeIndex, segments, value]);

  const openEditDialog = index => {
    // TODO async dialog
    // const values = await showEditPrompt(initialValues);
    setEditIndex(index);
    setIsDialogVisible(true);
  };

  const addField = value => {
    setUsedFields([...usedFields, value.name]);
    addSegmentField(activeIndex, value);
  };

  const _editField = () => {};

  const _deleteField = () => {};

  const editFieldValue = value => {
    //if user changed field name
    if (segments[activeIndex].fields[editIndex].name !== value.name) {
      setUsedFields(
        usedFields.map(item => {
          if (item === segments[activeIndex].fields[editIndex].name) {
            return value.name;
          } else return item;
        })
      );
    }
    editSegmentField(activeIndex, value, editIndex);
    setEditIndex(null);
  };

  if (activeIndex < 0 || segments[activeIndex] == null) {
    return "Add a segment to continue";
  }

  const renderFieldPreview = (item, index) => {
    return (
      <FieldPreviewContainer
        _editField={_editField}
        _deleteField={_deleteField}
        _onDrop={null}
        index={index}
        children={<p>{JSON.stringify(item)}</p>}
      />
    );
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        value={segments[activeIndex].title}
        type="text"
        placeholder="Enter Section Title"
        onChange={e => {
          setValue(Math.random());
          setSegmentKeys(activeIndex, { title: e.target.value });
        }}
      />
      {segments[activeIndex].fields.map(renderFieldPreview)}
      <button onClick={() => setIsDialogVisible(true)} children="Add Field" />
      {isDialogVisible && (
        <AddFields
          usedFields={usedFields}
          field={segments[activeIndex].fields[editIndex]}
          editField={editIndex !== null}
          toggleDialog={setIsDialogVisible}
          editFieldValue={editFieldValue}
          addField={addField}
          name={segments[activeIndex].title}
        />
      )}
    </div>
  );
};
const styles = {
  container: {
    border: "1px solid black",
    margin: "auto",
    padding: 15
  },
  fieldPreview: { border: " black solid 1px", padding: 20, margin: 10 }
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
      onDragOver={e => e.preventDefault()}
      onDragStart={ev => ev.dataTransfer.setData("text/plain", index)}
      {...props}
    >
      {children}
      <button onClick={_editField}>Edit</button>
      <button onClick={_deleteField}>Delete</button>
    </div>
  );
};