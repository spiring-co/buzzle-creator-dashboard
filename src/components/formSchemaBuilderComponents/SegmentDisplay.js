import React, { useContext, useState, useEffect } from "react";
import FormBuilderSegment from "components/formSchemaBuilderComponents/FormBuilderSegment";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import { Form, Button } from "react-bootstrap";

const MAX_SEGMENT_COUNT = 5;
export default ({
  edit,
  activeVersionIndex,
  editVersion,
  compositions,
  setActiveVersionIndex,
  openVersionDisplay,
}) => {
  const { addSegment, editversionKeys, removeSegment } = useActions();

  const [videoObj] = useContext(SegmentsContext);
  const [value, setValue] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);

  useEffect(() => {}, [value]);

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
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <p>
        <strong>{edit ? "Edit Version Details" : "Add Version Details"}</strong>
      </p>
      <Form.Control
        onChange={(e) => {
          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            title: e.target.value,
          });
        }}
        placeholder="Enter Version Title"
        type="text"
        value={videoObj.versions[activeVersionIndex].title}
      />
      <Form.Control
        onChange={(e) => {
          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            description: e.target.value,
          });
        }}
        placeholder="Enter Version Description"
        type="text"
        value={videoObj.versions[activeVersionIndex].description}
      />
      <Form.Control
        onChange={(e) => {
          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            price: e.target.value,
          });
        }}
        placeholder="Enter Version Price"
        type="number"
        value={videoObj.versions[activeVersionIndex].price}
      />
      <p>
        <strong>{edit ? "Edit Segments" : "Add Segments"}</strong>
      </p>
      <Button
        onClick={_addSegment}
        disabled={
          videoObj.versions[activeVersionIndex].form.segments.length >
          MAX_SEGMENT_COUNT
        }
        children="+ Add Segment"
      />

      <Button
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
        className="rounded _bg-state-warning"
        disabled={
          activeIndex >=
          videoObj.versions[activeVersionIndex].form.segments.length - 1
        }
        children="Go Next Segment >"
      />
      <FormBuilderSegment
        compositions={compositions}
        edit={edit}
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
        onClick={() => {
          if (!editVersion) {
            setActiveVersionIndex(activeVersionIndex + 1);
          }
          openVersionDisplay();
        }}
        children={edit ? "Back To Versions" : "Create Version"}
      />
    </Form>
  );
};
