import React, { createContext, useReducer } from "react";

import segmentReducer from "./reducer";

const VideoTemplateContext = createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, {
    title: "",
    idCreator: "sjjsjjjkaaaa",   //fetch from localStorage
    src: "",
    versions: [],
    description: '',
    tags: [],
    staticAssets: "",
    idFontsUsed: [],
    thumbnail: '',
    isDeleted: false,
  });

  return (
    <VideoTemplateContext.Provider value={[state, dispatch]} children={children} />
  );
};

export { VideoTemplateContext, StateProvider };
