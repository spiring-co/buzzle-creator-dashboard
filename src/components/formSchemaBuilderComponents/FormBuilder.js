import FormBuilderSegment from "components/formSchemaBuilderComponents/FormBuilderSegment";
import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";

const MAX_SEGMENT_COUNT = 5;

function FormBuilder({ submitForm, edit, video }) {
  const [segments] = useContext(SegmentsContext);
  console.log(segments);
  const { addSegment, resetSegment, loadSegment, removeSegment } = useActions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);

  useEffect(() => {
    edit ? loadSegment(video) : resetSegment();
  }, [segments]);

  const _addSegment = () => {
    addSegment();
    setActiveIndex(activeIndex + 1);
  };

  const deleteSegment = () => {
    const fields = segments[activeIndex].fields.map(i => i.name);
    setUsedFields(usedFields.filter(i => !fields.includes(i)));
    activeIndex !== 0 && goToPreviousSegment();
    removeSegment(activeIndex);
  };

  const goToPreviousSegment = () => {
    setActiveIndex(activeIndex - 1);
  };
  const goToNextSegment = () => {
    setActiveIndex(activeIndex + 1);
  };

  const handleSubmitForm = async () => {
    submitForm(segments);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={_addSegment}
        disabled={segments.length > MAX_SEGMENT_COUNT}
        children="+ Add Segment"
      />

      <button
        onClick={deleteSegment}
        disabled={segments.length <= 1}
        children="- Delete Segment"
      />
      <br />
      <button
        onClick={goToPreviousSegment}
        className="rounded _bg-state-warning"
        disabled={activeIndex < 1}
        children="< Go To previous"
      />
      <button
        onClick={goToNextSegment}
        className="rounded _bg-state-warning"
        disabled={activeIndex >= segments.length - 1}
        children="Go Next Segment >"
      />
      <FormBuilderSegment
        usedFields={usedFields}
        setUsedFields={setUsedFields}
        activeIndex={activeIndex}
      />
      <p children={`On section ${activeIndex + 1} of ${segments.length}`} />
      <button onClick={handleSubmitForm} children="Submit Form" />
    </div>
  );
}

export default props => {
  return (
    <StateProvider>
      <FormBuilder {...props} />
    </StateProvider>
  );
};
