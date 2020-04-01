import React, { createContext, useReducer } from "react";

import segmentReducer from "./Reducer";

const SegmentsContext = createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, {
    //fetch from localStorage
    creatorId: "sjjsjjjkaaaa",
    tags: [],
    versions: [],
    isDeleted: false,
    title: "",
    description: ""
  });

  return (
    <SegmentsContext.Provider value={[state, dispatch]} children={children} />
  );
};

export { SegmentsContext, StateProvider };
