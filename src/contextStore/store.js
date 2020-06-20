import React, { createContext, useReducer } from "react";
import segmentReducer from "./reducer";

const VideoTemplateContext = createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, {
    title: "",
    idCreator: "1kDWnfYrk", //fetch from localStorage
    src: "",
    versions: [],
    description: "",
    tags: [],
    staticAssets: [],
    fonts: [],
    thumbnail: "",
    isDeleted: false,
  });

  return (
    <VideoTemplateContext.Provider
      value={[state, dispatch]}
      children={children}
    />
  );
};

export { VideoTemplateContext, StateProvider };
