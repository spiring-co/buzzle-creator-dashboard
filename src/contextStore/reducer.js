import { useAuth } from "services/auth";
import { firebaseAuth } from "services/firebase";

//action Types
export const EDIT_VIDEO_KEYS = "EDIT_VIDEO_KEYS";
// export const ADD_VERSION = "ADD_VERSION";
export const REMOVE_VERSION = "REMOVE_VERSION";
export const EDIT_VERSION_KEYS = "EDIT_VERSION_KEYS";
export const ADD_FIELD = "ADD_FIELD";
export const UPDATE_FIELD = "UPDATE_FIELD";
export const REMOVE_FIELD = "REMOVE_FIELD";
export const RESET_STATE = "RESET_STATE";
export const LOAD_STATE = "LOAD_STATE";
export const RESTORE_FIELDS = "RESTORE_FIELDS";
export const SWAP_FIELDS = "SWAP_FIELDS";
export const UPDATE_FIELD_CHANGES = 'UPDATE_FIELD_CHANGES';




function shiftValueByIndex(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
  //list, startIndex, endIndex
  // if (dropIndex >= arr.length) {
  //   var k = dropIndex - arr.length + 1;
  //   while (k--) {
  //     arr.push(undefined);
  //   }
  // }
  // arr.splice(dropIndex, 0, arr.splice(dragIndex, 1)[0]);
  // return arr; // for testing
};
export default (state, action) => {
  switch (action.type) {
    //payload : activeVersionIndex, updatedFields 
    case UPDATE_FIELD_CHANGES:
      const updatedFields = state.versions[action.payload.activeVersionIndex].fields.map(({ type, rendererData, constraints, placeholder, label }, index) => {
        const field = rendererData?.layerName + rendererData?.property
        if (action.payload.updatedFields.includes(field)) {
          return state.versions[0].fields[action.payload.updatedFields.indexOf(field)]
        } else return ({ type, rendererData, constraints, placeholder, label })
      })
      state.versions[action.payload.activeVersionIndex].fields = updatedFields;

      return Object.assign({}, state);
    //payload : activeVersionIndex,currentCompositionFields
    case RESTORE_FIELDS:
      const fields = state.versions[action?.payload?.restoreVersionIndex || 0].fields.filter(({ rendererData }) =>
        (action.payload.currentCompositionFields||[]).includes(rendererData.layerName)
      );

      state.versions[action.payload.activeVersionIndex].fields = fields;

      return Object.assign({}, state);

    //payload:action.payload.activeVersionIndex,action.payload.swapIndex,action.payload.targetSwapIndex
    case SWAP_FIELDS:
      state.versions[action.payload.activeVersionIndex].fields = shiftValueByIndex(state.versions[action.payload.activeVersionIndex].fields, action.payload.swapIndex, action.payload.targetSwapIndex)
      return Object.assign({}, state);
    //payload: action.payload.value={key:action.payload.value}
    case EDIT_VIDEO_KEYS:
      return { ...state, ...action.payload.value };

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
        ...state.versions[action.payload.activeVersionIndex],
        fields: state.versions[action.payload.activeVersionIndex]?.fields ?? [],
        ...action.payload.value,
      };
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
              fields: item.fields.filter(
                (field, fieldIndex) => action.payload.fieldIndex !== fieldIndex
              ),
            };
          } else return item;
        }),
      };
      return state;

    //payload: {field,activeVersionIndex}
    case ADD_FIELD:
      state.versions[action.payload.activeVersionIndex].fields.push(
        { ...action.payload.field }
      );
      return Object.assign({}, state);

    //payload: {field,activeVersionIndex,fieldIndex}
    case UPDATE_FIELD:
      state.versions[action.payload.activeVersionIndex].fields[
        action.payload.fieldIndex
      ] = { ...action.payload.field };
      return Object.assign({}, state);

    // load segments to edit , payload = video object
    case LOAD_STATE:
      return action.payload;
    //payload: nul
    case RESET_STATE:
      return {
        title: "",
        idCreatedBy: firebaseAuth.currentUser.uid,
        type: action.payload?.type,
        src: "",
        versions: [],
        description: "",
        keywords: [],
        staticAssets: [],
        fonts: [],
        thumbnail: "",
      };
    default:
      throw new Error("Action not recognized");
  }
};
