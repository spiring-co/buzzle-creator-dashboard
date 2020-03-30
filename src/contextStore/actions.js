import React from "react";
import {
  ADD_SEGMENT,
  REMOVE_SEGMENT,
  REMOVE_FIELD,
  EDIT_SEGMENT_KEYS,
  SWAP_SEGMENT_FIELDS,
  RESET_STATE
} from "./Reducer";
import { store } from "./store";

export function useActions() {
  const { dispatch, state } = React.useContext(store);

  function addSection() {
    dispatch({ type: ADD_SEGMENT, payload: state });
  }

  function resetSegment() {
    dispatch({ type: RESET_STATE });
  }

  function setSegmentKeys(activeIndex, value) {
    dispatch({
      type: EDIT_SEGMENT_KEYS,
      payload: { activeIndex, value }
    });
  }

  function addSegmentField(activeIndex, value) {
    dispatch({
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeIndex,
        value: { fields: [...state[activeIndex].fields, value] }
      }
    });
  }
  function removeSegment(activeIndex) {
    dispatch({ type: REMOVE_SEGMENT, payload: activeIndex });
  }
  function removeField(activeIndex, fieldIndex) {
    dispatch({
      type: REMOVE_FIELD,
      payload: {
        activeIndex,
        fieldIndex
      }
    });
  }
  function editSegmentField(activeIndex, value, editIndex) {
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
  }
  function swapFields(activeIndex, swapIndex, targetSwapIndex) {
    dispatch({
      type: SWAP_SEGMENT_FIELDS,
      payload: { activeIndex, swapIndex, targetSwapIndex }
    });
  }
  return {
    swapFields,
    addSection,
    setSegmentKeys,
    addSegmentField,
    editSegmentField,
    removeSegment,
    removeField,
    resetSegment
  };
}
