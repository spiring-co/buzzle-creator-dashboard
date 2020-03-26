import React, { useState, useContext } from "react";
import Segment from "./Segment";
import { useActions } from "../../contextStore/actions";
import { store } from "../../contextStore/store";

function FormSchemaBuilder() {
  const { state, dispatch } = useContext(store);
  const { addSection } = useActions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);
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

  return (
    <div
      style={{
        margin: 25,

        display: "flex",
        justifyContent: "center"
      }}
    >
      <p>
        On section {activeIndex + 1} of {state.length}
      </p>
      <div style={{ alignSelf: "center" }}>
        <button onClick={prevSegment} disabled={activeIndex === 0}>
          Go To previous
        </button>
      </div>
      <Segment
        usedFields={usedFields}
        setUsedFields={setUsedFields}
        prevSegment={prevSegment}
        activeIndex={activeIndex}
      />
      <div style={{ alignSelf: "center" }}>
        <button onClick={addSegment}>Add Section</button>
      </div>
      <div style={{ alignSelf: "center" }}>
        <button
          onClick={nextSegment}
          disabled={activeIndex + 1 === state.length}
        >
          Go Next Segment
        </button>
        <button onClick={() => console.log(state[activeIndex])}>
          show state
        </button>
      </div>
    </div>
  );
}
export default FormSchemaBuilder;
