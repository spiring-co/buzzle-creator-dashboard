import React, { createContext, useReducer } from "react";

import segmentReducer from "./reducer";

const SegmentsContext = createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, [
    { title: "", fields: [] }
  ]);

  return (
    <SegmentsContext.Provider value={[state, dispatch]} children={children} />
  );
};

export { SegmentsContext, StateProvider };
