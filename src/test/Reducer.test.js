import { render } from "@testing-library/react";
import React from "react";

import segmentReducer, {
  ADD_SEGMENT,
  EDIT_SEGMENT_KEYS,
  REMOVE_FIELD,
  REMOVE_SEGMENT,
  EDIT_VIDEO_KEYS,
  EDIT_VERSION_KEYS,
  ADD_VERSION,
  REMOVE_VERSION,
  SWAP_SEGMENT_FIELDS
} from "../contextStore/Reducer";

const BLANK_FIELD = {
  type: "test",
  name: "test",
  maxLength: "edit",
  required: true
};

const initalState = {
  //fetch from localStorage
  creatorId: "sjjsjjjkaaaa",
  tags: [],
  versions: [],
  isDeleted: false,
  title: "",
  description: ""
};

//edit_video_keys
test("Edit Video Title Correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_VIDEO_KEYS,
      payload: { value: { title: "Video Title" } }
    }).title
  ).toBe("Video Title");
});

//add version 0
test("Add Version 0 Correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: ADD_VERSION,
      payload: { comp_name: "main" }
    }).versions[0].comp_name
  ).toBe("main");
});
//add version 1
test("Add Version 1 Correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: ADD_VERSION,
      payload: { comp_name: "second" }
    }).versions[1].comp_name
  ).toBe("second");
});

// edit_version_keys of version 0
test("Edit price of version 0", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_VERSION_KEYS,
      payload: {
        value: { price: "900" },
        activeVersionIndex: 0
      }
    }).versions[0].price
  ).toBe("900");
});
// edit_version_keys of version 1
test("Edit price of version 1", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_VERSION_KEYS,
      payload: {
        value: { price: "70" },
        activeVersionIndex: 1
      }
    }).versions[1].price
  ).toBe("70");
});

// remove version 0
test("Remove version at index 0", () => {
  expect(
    segmentReducer(initalState, {
      type: REMOVE_VERSION,
      payload: {
        activeVersionIndex: 0
      }
    }).versions.length
  ).toBe(1);
});
//adds segment in version 0
test("Add segments correctly in version 0", () => {
  expect(
    segmentReducer(initalState, {
      type: ADD_SEGMENT,
      payload: { activeVersionIndex: 0 }
    }).versions[0].form.segments.length
  ).toBe(2);
});

//remove segment 1 in version 0
test("Remove segments correctly in version 0 and segment 1", () => {
  expect(
    segmentReducer(initalState, {
      type: REMOVE_SEGMENT,
      payload: { activeVersionIndex: 0, segmentIndex: 1 }
    }).versions[0].form.segments.length
  ).toBe(1);
});

// EDIT segment key in version 0 segment 0
test("Edit Segment keys correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeVersionIndex: 0,
        activeIndex: 0,
        value: { subtitle: "editedSubtitle" }
      }
    }).versions[0].form.segments[0].subtitle
  ).toBe("editedSubtitle");
});

// Add field in segment 0 in version 0
test("Add Fields correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeVersionIndex: 0,
        activeIndex: 0,
        value: {
          fields: [BLANK_FIELD]
        }
      }
    }).versions[0].form.segments[0].fields.length
  ).toBe(1);
});
// Add another field in segment 0 in version 0
test("Add Fields correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeIndex: 0,
        activeVersionIndex: 0,
        value: {
          fields: [
            ...initalState.versions[0].form.segments[0].fields,
            BLANK_FIELD
          ]
        }
      }
    }).versions[0].form.segments[0].fields.length
  ).toBe(2);
});

// EDIT_FIELD FieldIndex 1, activeIndex:0, activeVersionIndex:0
test("Edit Fields Value at index 1 correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeVersionIndex: 0,
        activeIndex: 0,
        value: {
          fields: initalState.versions[0].form.segments[0].fields.map(
            (item, index) => {
              if (index === 1) {
                return {
                  ...initalState.versions[0].form.segments[0].fields[1],
                  maxLength: "edit Max Length Success"
                };
              } else return item;
            }
          )
        }
      }
    }).versions[0].form.segments[0].fields[1].maxLength
  ).toBe("edit Max Length Success");
});

// removes field at FieldIndex 1, activeVersionIndex:0 and activeIndex:0
test("Remove Field at index 1 correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: REMOVE_FIELD,
      payload: {
        fieldIndex: 1,
        activeVersionIndex: 0,
        activeIndex: 0
      }
    }).versions[0].form.segments[0].fields[0]
  ).toMatchObject({
    type: "test",
    name: "test",
    maxLength: "edit",
    required: true
  });
});

test("Remove Field at index 1 Not correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: REMOVE_FIELD,
      payload: {
        fieldIndex: 1,
        activeVersionIndex: 0,
        activeIndex: 0
      }
    }).versions[0].form.segments[0].fields[0]
  ).not.toMatchObject({
    type: "wrong Info",
    name: "test",
    maxLength: "edit",
    required: true
  });
});
