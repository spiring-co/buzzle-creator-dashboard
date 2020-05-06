//action Types
export const ADD_SEGMENT = "ADD_SEGMENT";
export const REMOVE_SEGMENT = "REMOVE_SEGMENT";
export const EDIT_SEGMENT_KEYS = "EDIT_SEGMENT_KEYS";
export const SET_ACTIVE_INDEX = "SET_ACTIVE_INDEX";
export const REMOVE_FIELD = "REMOVE_FIELD";
export const SWAP_SEGMENT_FIELDS = "SWAP_SEGMENT_FIELDS";
export const RESET_STATE = "RESET_STATE";
export const LOAD_STATE = "LOAD_STATE";
export const ADD_VERSION = "ADD_VERSION";
export const REMOVE_VERSION = "REMOVE_VERSION";
export const EDIT_VIDEO_KEYS = "EDIT_VIDEO_KEYS";
export const EDIT_VERSION_KEYS = "EDIT_VERSION_KEYS";
export const RESTORE_FIELDS = "RESTORE_FIELDS";

export default (state, action) => {
  switch (action.type) {
    //payload : activeVersionIndex,currentCompositionFields
    case RESTORE_FIELDS:
      var filteredSegments = state.versions[0].form.segments.map((segment) => {
        return {
          ...segment,
          fields: Object.assign(
            [],
            ...segment.fields.filter((field) =>
              action.payload.currentCompositionFields.includes(field.name)
            )
          ),
        };
      });
      state.versions[
        action.payload.activeVersionIndex
      ].form.segments = filteredSegments;

      return state;
    //payload: action.payload.value={key:action.payload.value}
    case EDIT_VIDEO_KEYS:
      return { ...state, ...action.payload.value };

    //payload:{comp_name:action.payload.value}
    case ADD_VERSION:
      state.versions.push({
        ...action.payload,
        title: "",
        description: "",
        price: "",
        sample: "",
        form: {
          segments: [
            {
              title: "",
              fields: [],
            },
          ],
        },
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

    //payload: action.payload.activeVersionIndex,action.payload.value={title:action.payload.value}
    case EDIT_VERSION_KEYS:
      state.versions[action.payload.activeVersionIndex][
        Object.keys(action.payload.value)
      ] = Object.values(action.payload.value)[0];

      return state;

    //payload has action.payload.activeVersionIndex
    case ADD_SEGMENT:
      state.versions[action.payload.activeVersionIndex].form.segments.push({
        title: "",
        fields: [],
      });
      return state;

    //payload:{action.payload.segmentIndex} of segment to be removed and {action.payload.activeVersionIndex}
    case REMOVE_SEGMENT:
      return {
        ...state,
        versions: state.versions.map((item, index) => {
          if (index === action.payload.activeVersionIndex) {
            return {
              ...item,
              form: {
                segments: item.form.segments.filter(
                  (item, i) => i !== action.payload.segmentIndex
                ),
              },
            };
          } else return item;
        }),
      };

    //payload:{action.payload.activeIndex, action.payload.activeVersionIndex, action.payload.fieldIndex}
    //TODO could be implemented more efficiently using array indices
    case REMOVE_FIELD:
      state = {
        ...state,
        versions: state.versions.map((item, index) => {
          if (index === action.payload.activeVersionIndex) {
            return {
              ...item,
              form: {
                segments: item.form.segments.map((segment, i) => {
                  if (i === action.payload.activeIndex) {
                    return {
                      ...segment,
                      fields: segment.fields.filter(
                        (field, j) => j !== action.payload.fieldIndex
                      ),
                    };
                  } else return segment;
                }),
              },
            };
          } else return item;
        }),
      };
      return state;

    //payload: {activeIndex, value,activeVersionIndex}
    case EDIT_SEGMENT_KEYS:
      state.versions[action.payload.activeVersionIndex].form.segments[
        action.payload.activeIndex
      ] = {
        ...state.versions[action.payload.activeVersionIndex].form.segments[
          action.payload.activeIndex
        ],
        ...action.payload.value,
      };
      return state;

    //payload: { action.payload.activeIndex, action.payload.swapIndex, action.payload.targetaction.payload.SwapIndex ,action.payload.activeVersionIndex}
    case SWAP_SEGMENT_FIELDS:
      [
        state.versions[action.payload.activeVersionIndex].form.segments[
          action.payload.activeIndex
        ].fields[action.payload.swapIndex],
        state.versions[action.payload.activeVersionIndex].form.segments[
          action.payload.activeIndex
        ].fields[action.payload.targetSwapIndex],
      ] = [
        state.versions[action.payload.activeVersionIndex].form.segments[
          action.payload.activeIndex
        ].fields[action.payload.targetSwapIndex],
        state.versions[action.payload.activeVersionIndex].form.segments[
          action.payload.activeIndex
        ].fields[action.payload.swapIndex],
      ];
      return state;

    // load segments to edit , payload = video object
    case LOAD_STATE:
      return action.payload;
    //payload: nul
    case RESET_STATE:
      return {
        //fetch from localStorage
        creatorId: "sjjsjjjkaaaa",
        tags: [],
        versions: [],
        isDeleted: false,
        title: "",
        description: "",
        assetsUri: "",
        fonts: [],
        fileUrl: "",
      };
    default:
      throw new Error("Action not recognized");
  }
};
