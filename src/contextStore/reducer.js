//action Types
export const EDIT_VIDEO_KEYS = "EDIT_VIDEO_KEYS";
export const ADD_VERSION = "ADD_VERSION";
export const REMOVE_VERSION = "REMOVE_VERSION";
export const EDIT_VERSION_KEYS = "EDIT_VERSION_KEYS";
export const ADD_FIELD = "ADD_FIELD";
export const UPDATE_FIELD = "UPDATE_FIELD";
export const REMOVE_FIELD = "REMOVE_FIELD";
export const SWAP_FIELDS = "SWAP_FIELDS";
export const RESET_STATE = "RESET_STATE";
export const LOAD_STATE = "LOAD_STATE";
export const RESTORE_FIELDS = "RESTORE_FIELDS";

export default (state, action) => {
  switch (action.type) {
    //payload : activeVersionIndex,currentCompositionFields
    // case RESTORE_FIELDS:
    //   var filteredSegments = state.versions[0].form.segments.map((segment) => {
    //     return {
    //       ...segment,
    //       fields: Object.assign(
    //         [],
    //         ...segment.fields.filter((field) =>
    //           action.payload.currentCompositionFields.includes(field.name)
    //         )
    //       ),
    //     };
    //   });
    //   state.versions[
    //     action.payload.activeVersionIndex
    //   ].form.segments = filteredSegments;

    //   return state;
    //payload: action.payload.value={key:action.payload.value}
    case EDIT_VIDEO_KEYS:
      return { ...state, ...action.payload.value };

    //payload:{composition:action.payload.value}
    case ADD_VERSION:
      state.versions.push({
        ...action.payload,
        title: "",
        description: "",
        sample: "",
        editableLayers: []
      });

      return state;

    //payload : action.payload.activeVersionIndex
    case REMOVE_VERSION:
      return {
        ...state,
        versions: state.versions.filter(
          (item, index) => index !== action.payload.activeVersionIndex
        ),
      };

    //payload: action.payload.activeVersionIndex,
    //action.payload.value={title:action.payload.value}
    case EDIT_VERSION_KEYS:
      state.versions[action.payload.activeVersionIndex] = {
        ...state.versions[action.payload.activeVersionIndex], ...action.payload.value
      }
      return Object.assign({}, state);

    //payload:{action.payload.activeVersionIndex, action.payload.fieldIndex}
    //TODO could be implemented more efficiently using array indices
    case REMOVE_FIELD:
      state = {
        ...state,
        versions: state.versions.map((item, index) => {
          if (index === action.payload.activeVersionIndex) {
            return {
              ...item,
              editableLayers:
                item.editableLayers.filter((field, fieldIndex) =>
                  action.payload.fieldIndex !== fieldIndex)
            }
          } else return item;
        }),
      };
      return state;

    //payload: {value,activeVersionIndex}
    // value is field Obj
    case ADD_FIELD:
      state.versions[action.payload.activeVersionIndex].editableLayers.push(action.payload.value)
      console.log("field added :)", state)
      return Object.assign({}, state);

    //payload: {value,activeVersionIndex,fieldIndex}
    // value is field Obj
    case UPDATE_FIELD:
      state.versions[action.payload.activeVersionIndex].editableLayers[action.payload.fieldIndex] = action.payload.value
      return Object.assign({}, state);

    // payload: {  action.payload.swapIndex, action.payload.targetSwapIndex ,action.payload.activeVersionIndex}
    case SWAP_FIELDS:
      [
        state.versions[action.payload.activeVersionIndex].editableLayers[action.payload.swapIndex],
        state.versions[action.payload.activeVersionIndex].editableLayers[action.payload.targetSwapIndex],
      ] = [
          state.versions[action.payload.activeVersionIndex].editableLayers[action.payload.targetSwapIndex],
          state.versions[action.payload.activeVersionIndex].editableLayers[action.payload.swapIndex],
        ];
      return state;

    // load segments to edit , payload = video object
    case LOAD_STATE:
      return action.payload;
    //payload: nul
    case RESET_STATE:
      return {
        title: "",
        idCreator: localStorage.getItem('creatorId'),   //fetch from localStorage
        src: "",
        versions: [],
        description: '',
        tags: [],
        staticAssets: [],
        idFontsUsed: [],
        thumbnail: '',
        isDeleted: false,
      };
    default:
      throw new Error("Action not recognized");
  }
};
