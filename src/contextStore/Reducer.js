//action Types
export const ADD_SEGMENT = "ADD_SEGMENT";
export const REMOVE_SEGMENT = "REMOVE_SEGMENT";
export const EDIT_SEGMENT_KEYS = "EDIT_SEGMENT_KEYS";
export const SET_ACTIVE_INDEX = "SET_ACTIVE_INDEX";
export const REMOVE_FIELD = "REMOVE_FIELD";
export const SWAP_SEGMENT_FIELDS = "SWAP_SEGMENT_FIELDS";
export function segmentReducer(state, action) {
  switch (action.type) {
    case ADD_SEGMENT:
      state.push({
        title: "",
        subtitle: "",
        illustration: "",
        fields: []
      });
      return state;

    case REMOVE_SEGMENT:
      return state.filter((item, index) => index !== action.payload);
    case REMOVE_FIELD:
      return state.map((item, index) => {
        if (index === action.payload.activeIndex) {
          return {
            ...item,
            fields: item.fields.filter(
              (item, i) => i !== action.payload.fieldIndex
            )
          };
        } else return item;
      });
    case EDIT_SEGMENT_KEYS:
      state[action.payload.activeIndex] = {
        ...state[action.payload.activeIndex],
        ...action.payload.value
      };
      return state;
    case SWAP_SEGMENT_FIELDS:
      var { activeIndex, swapIndex, targetSwapIndex } = action.payload;
      [
        state[activeIndex].fields[swapIndex],
        state[activeIndex].fields[targetSwapIndex]
      ] = [
        state[activeIndex].fields[targetSwapIndex],
        state[activeIndex].fields[swapIndex]
      ];
      return state;
    default:
      throw new Error();
  }
}
