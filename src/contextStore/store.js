import React, { createContext, useReducer } from "react";
import { segmentReducer } from "./Reducer";
const initialState = [
  {
    title: "",
    subtitle: "",
    illustration: "",
    fields: []
  }
];
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
