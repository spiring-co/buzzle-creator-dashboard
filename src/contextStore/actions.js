import React from "react";

import {
  EDIT_VIDEO_KEYS,
  ADD_FIELD,
  UPDATE_FIELD,
  REMOVE_FIELD,
  // ADD_VERSION,
  EDIT_VERSION_KEYS,
  REMOVE_VERSION,
  LOAD_STATE,
  RESET_STATE,
  RESTORE_FIELDS
} from "./reducer";
import { VideoTemplateContext } from "./store";

export default function useActions() {
  const [state, dispatch] = React.useContext(VideoTemplateContext);

  return {
    restoreFieldsFromPreviousVersion: function (
      activeVersionIndex,
      currentCompositionFields
    ) {
      dispatch({
        type: RESTORE_FIELDS,
        payload: { activeVersionIndex, currentCompositionFields },
      });
    },
    editVideoKeys: function (value) {
      // value = : { title: "Video Title" }
      dispatch({
        type: EDIT_VIDEO_KEYS,
        payload: { value },
      });
    },
    // addVersion: function (value) {
    //   // value = { composition: "main" }
    //   dispatch({ type: ADD_VERSION, payload: value });
    // },
    editversionKeys: function (activeVersionIndex, value) {
      // value= { price: "900" }
      dispatch({
        type: EDIT_VERSION_KEYS,
        payload: {
          value,
          activeVersionIndex,
        },
      });
    },
    removeVersion: function (activeVersionIndex) {
      dispatch({
        type: REMOVE_VERSION,
        payload: {
          activeVersionIndex,
        },
      });
    },

    resetVideo: function (id) {
      dispatch({ type: RESET_STATE, payload: id });
    },

    addField: function (activeVersionIndex, field) {
      //value  is fieldObject= {name:"",label:"",maxLength:""...}
      dispatch({
        type: ADD_FIELD,
        payload: {
          activeVersionIndex,
          field
        },
      });
    },

    removeField: function (activeVersionIndex, fieldIndex) {
      dispatch({
        type: REMOVE_FIELD,
        payload: {
          activeVersionIndex,
          fieldIndex,
        },
      });
    },
    updateField: function (activeVersionIndex, fieldIndex, field) {
      // value is field object
      dispatch({
        type: UPDATE_FIELD,
        payload: {
          activeVersionIndex,
          fieldIndex,
          field
        },
      });
    },

    loadVideo: function (video) {
      dispatch({ type: LOAD_STATE, payload: video });
    },
  };
} 
