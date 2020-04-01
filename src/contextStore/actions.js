import React from "react";

import {
  ADD_SEGMENT,
  EDIT_SEGMENT_KEYS,
  REMOVE_FIELD,
  REMOVE_SEGMENT,
  RESET_STATE,
  SWAP_SEGMENT_FIELDS
} from "./reducer";
import { SegmentsContext } from "./store";

export default function useActions() {
  const [state, dispatch] = React.useContext(SegmentsContext);

  return {
    addSegment: function() {
      dispatch({ type: ADD_SEGMENT });
    },

    resetSegment: function() {
      dispatch({ type: RESET_STATE });
    },

    setSegmentKeys: function(activeIndex, value) {
      dispatch({
        type: EDIT_SEGMENT_KEYS,
        payload: { activeIndex, value }
      });
    },

    addSegmentField: function(activeIndex, value) {
      dispatch({
        type: EDIT_SEGMENT_KEYS,
        payload: {
          activeIndex,
          value: { fields: [...state[activeIndex].fields, value] }
        }
      });
    },
    removeSegment: function(activeIndex) {
      dispatch({ type: REMOVE_SEGMENT, payload: activeIndex });
    },
    removeField: function(activeIndex, fieldIndex) {
      dispatch({
        type: REMOVE_FIELD,
        payload: {
          activeIndex,
          fieldIndex
        }
      });
    },
    editSegmentField: function(activeIndex, value, editIndex) {
      const fields = (state[activeIndex].fields[editIndex] = value);
      dispatch({
        type: EDIT_SEGMENT_KEYS,
        payload: {
          activeIndex,
          value: {
            ...fields
          }
        }
      });
    },
    swapFields: function(activeIndex, swapIndex, targetSwapIndex) {
      dispatch({
        type: SWAP_SEGMENT_FIELDS,
        payload: { activeIndex, swapIndex, targetSwapIndex }
      });
    }
  };
}
