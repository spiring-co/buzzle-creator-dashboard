import React from "react";

import {
  ADD_SEGMENT,
  EDIT_SEGMENT_KEYS,
  REMOVE_FIELD,
  REMOVE_SEGMENT,
  EDIT_VIDEO_KEYS,
  EDIT_VERSION_KEYS,
  ADD_VERSION,
  REMOVE_VERSION,
  LOAD_STATE,
  RESET_STATE,
  SWAP_SEGMENT_FIELDS
} from "./Reducer";
import { SegmentsContext } from "./store";

export default function useActions() {
  const [state, dispatch] = React.useContext(SegmentsContext);

  return {
    editVideoKeys: function(value) {
      // value = : { title: "Video Title" }
      dispatch({
        type: EDIT_VIDEO_KEYS,
        payload: { value }
      });
    },
    addVersion: function(value) {
      // value = { comp_name: "main" }
      dispatch({ type: ADD_VERSION, payload: value });
    },
    editversionKeys: function(activeVersionIndex, value) {
      // value= { price: "900" }
      dispatch({
        type: EDIT_VERSION_KEYS,
        payload: {
          value,
          activeVersionIndex
        }
      });
    },
    removeVersion: function(activeVersionIndex) {
      dispatch({
        type: REMOVE_VERSION,
        payload: {
          activeVersionIndex
        }
      });
    },
    addSegment: function(activeVersionIndex) {
      dispatch({ type: ADD_SEGMENT, payload: { activeVersionIndex } });
    },

    resetVideo: function() {
      dispatch({ type: RESET_STATE });
    },

    setSegmentKeys: function(activeVersionIndex, activeIndex, value) {
      //value: {title:"sometitle"}
      dispatch({
        type: EDIT_SEGMENT_KEYS,
        payload: { activeVersionIndex, activeIndex, value }
      });
    },

    addSegmentField: function(activeVersionIndex, activeIndex, value) {
      //value  is fieldObject= {name:"",label:"",maxLength:""...}
      dispatch({
        type: EDIT_SEGMENT_KEYS,
        payload: {
          activeIndex,
          activeVersionIndex,
          value: {
            fields: [
              ...state.versions[activeVersionIndex].form.segments[activeIndex]
                .fields,
              value
            ]
          }
        }
      });
    },
    removeSegment: function(activeVersionIndex, activeIndex) {
      dispatch({
        type: REMOVE_SEGMENT,
        payload: { activeVersionIndex, segmentIndex: activeIndex }
      });
    },

    removeField: function(activeVersionIndex, activeIndex, fieldIndex) {
      dispatch({
        type: REMOVE_FIELD,
        payload: {
          activeVersionIndex,
          activeIndex,
          fieldIndex
        }
      });
    },
    editSegmentField: function(
      activeVersionIndex,
      activeIndex,
      editIndex,
      value
    ) {
      // value is field object
      dispatch({
        type: EDIT_SEGMENT_KEYS,
        payload: {
          activeVersionIndex,
          activeIndex,
          value: {
            fields: state.versions[activeVersionIndex].form.segments[
              activeIndex
            ].fields.map((item, index) => {
              if (index === editIndex) {
                return value;
              } else return item;
            })
          }
        }
      });
    },
    loadVideo: function(video) {
      dispatch({ type: LOAD_STATE, payload: video });
    },
    swapFields: function(
      activeVersionIndex,
      activeIndex,
      swapIndex,
      targetSwapIndex
    ) {
      dispatch({
        type: SWAP_SEGMENT_FIELDS,
        payload: { activeVersionIndex, activeIndex, swapIndex, targetSwapIndex }
      });
    }
  };
}
