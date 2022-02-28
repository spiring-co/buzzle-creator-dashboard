import React, { createContext, useReducer } from "react";
import { useAuth } from "services/auth";
import { firebaseAuth } from "services/firebase";
import segmentReducer from "./reducer";

const VideoTemplateContext = createContext();

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, {
    title: "",
    idCreatedBy: firebaseAuth.currentUser.uid, //fetch from localStorage
    src: "",
    type: "ae",
    versions: [],
    description: "",
    keywords: [],
    staticAssets: [],
    fonts: [],
    thumbnail: "",
  });

  return (
    <VideoTemplateContext.Provider
      value={[state, dispatch]}
      children={children}
    />
  );
};

export { VideoTemplateContext, StateProvider };
