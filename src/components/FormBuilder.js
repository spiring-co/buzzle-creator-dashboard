import Segment from "components/formSchemaBuilderComponents/Segment.js";
import { useActions } from "contextStore/actions";
import { StateProvider, store } from "contextStore/store";
import React, { useContext, useState, useEffect } from "react";

function FormSchemaBuilder(props) {
  const { state } = useContext(store);
  const { addSection, resetSegment } = useActions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);
  useEffect(() => {
    resetSegment();
  }, []);
  const addSegment = () => {
    setActiveIndex(activeIndex + 1);
    addSection();
  };

  const prevSegment = () => {
    setActiveIndex(activeIndex - 1);
  };
  const nextSegment = () => {
    setActiveIndex(activeIndex + 1);
  };

  const handleSubmitForm = async () => {
    props.submitForm(state);
  };
  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <button onClick={prevSegment} disabled={activeIndex === 0}>
          Go To previous
        </button>
        <button
          onClick={nextSegment}
          disabled={activeIndex + 1 === state.length}
        >
          Go Next Segment
        </button>
      </div>
      <Segment
        usedFields={usedFields}
        setUsedFields={setUsedFields}
        prevSegment={prevSegment}
        activeIndex={activeIndex}
      />
      <p>
        On section {activeIndex + 1} of {state.length}
      </p>
      <div>
        <button onClick={addSegment}>Add Section</button>
        <span> </span>
        <br />
        <button onClick={handleSubmitForm}>Submit Form</button>
      </div>
    </div>
  );
}

export default function FormBuilderScreen(props) {
  return (
    <StateProvider>
      <FormSchemaBuilder {...props} />
    </StateProvider>
  );
}
