import React, { createContext, useReducer } from "react";

import segmentReducer from "./reducer";

const SegmentsContext = createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, {
    //fetch from localStorage
    creatorId: "sjjsjjjkaaaa",
    tags: [],
    versions: [],
    isDeleted: false,
    title: "",
    description: "",
    assetsUri: "",
    fonts: [],
    fileUrl: "",
  });

  return (
    <SegmentsContext.Provider value={[state, dispatch]} children={children} />
  );
};

export { SegmentsContext, StateProvider };
