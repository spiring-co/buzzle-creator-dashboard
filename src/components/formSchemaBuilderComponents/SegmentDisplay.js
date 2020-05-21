import React, { useContext, useState, useEffect } from "react";
import FormBuilderSegment from "components/formSchemaBuilderComponents/FormBuilderSegment";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";

import { Button } from '@material-ui/core'

const MAX_SEGMENT_COUNT = 5;
export default ({
  isEdit,
  activeVersionIndex,
  editVersion,
  compositions,
  setActiveVersionIndex,
  openVersionDisplay,
}) => {
  const { addSegment, removeSegment } = useActions();

  const [videoObj] = useContext(SegmentsContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);

  const _addSegment = () => {
    addSegment(activeVersionIndex);
    setActiveIndex(activeIndex + 1);
  };

  const deleteSegment = () => {
    const fields = videoObj.versions[activeVersionIndex].form.segments[
      activeIndex
    ].fields.map((i) => i.name);
    setUsedFields(usedFields.filter((i) => !fields.includes(i)));
    activeIndex !== 0 && goToPreviousSegment();
    removeSegment(activeVersionIndex, activeIndex);
  };

  const goToNextSegment = () => {
    setActiveIndex(activeIndex + 1);
  };
  const goToPreviousSegment = () => {
    setActiveIndex(activeIndex - 1);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Button
        color="primary"
        variant="contained"
        onClick={_addSegment}
        disabled={
          videoObj.versions[activeVersionIndex].form.segments.length >
          MAX_SEGMENT_COUNT
        }
        children="+ Add Segment"
      />

      <Button
        color="secondary"
        variant="outlined"
        onClick={deleteSegment}
        disabled={
          videoObj.versions[activeVersionIndex].form.segments.length <= 1
        }
        children="- Delete Segment"
      />
      <br />
      <Button
        onClick={goToPreviousSegment}
        className="rounded _bg-state-warning"
        disabled={activeIndex < 1}
        children="< Go To previous"
      />
      <Button
        onClick={goToNextSegment}
        color="primary"
        variant="contained"
        disabled={
          activeIndex >=
          videoObj.versions[activeVersionIndex].form.segments.length - 1
        }
        children="Go Next Segment >"
      />

      <FormBuilderSegment
        compositions={compositions}
        editVersion={editVersion}
        usedFields={usedFields}
        setUsedFields={setUsedFields}
        activeVersionIndex={activeVersionIndex}
        activeIndex={activeIndex}
      />
      <p
        children={`On section ${activeIndex + 1} of ${
          videoObj.versions[activeVersionIndex].form.segments.length
          }`}
      />
      <Button
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
