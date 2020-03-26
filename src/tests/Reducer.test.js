import React from "react";
import { render } from "@testing-library/react";
import {
  ADD_SEGMENT,
  REMOVE_SEGMENT,
  REMOVE_FIELD,
  EDIT_SEGMENT_KEYS,
  SWAP_SEGMENT_FIELDS,
  segmentReducer
} from "../contextStore/Reducer";

const initalState = [
  {
    title: "",
    subtitle: "",
    illustration: "",
    fields: [
      {
        type: "test",
        name: "test",
        maxLength: "edit",
        required: true
      }
    ]
  }
];

test("Add segments correctly", () => {
  expect(segmentReducer(initalState, { type: ADD_SEGMENT }).length).toBe(2);
});

test("Remove segments correctly", () => {
  expect(
    segmentReducer(initalState, { type: REMOVE_SEGMENT, payload: 1 }).length
  ).toBe(1);
});
test("Edit Segment keys correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: { activeIndex: 0, value: { subtitle: "editedSubtitle" } }
    })[0].subtitle
  ).toBe("editedSubtitle");
});
test("Add Fields correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeIndex: 0,
        value: { fields: [...initalState[0].fields, ...initalState[0].fields] }
      }
    })[0].fields.length
  ).toBe(2);
});
test("Edit Fields Value at index 1 correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeIndex: 0,
        value: {
          fields: initalState[0].fields.map((item, index) => {
            if (index === 1) {
              return {
                ...initalState[0].fields[1],
                maxLength: "edit Max Length Success"
              };
            } else return item;
          })
        }
      }
    })[0].fields[1].maxLength
  ).toBe("edit Max Length Success");
});
test("Remove Field at index 1 correctly", () => {
  expect(
    segmentReducer(initalState, {
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeIndex: 0,
        value: {
          fields: initalState[0].fields.filter((item, index) => index !== 1)
        }
      }
    })[0].fields[0]
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
      type: EDIT_SEGMENT_KEYS,
      payload: {
        activeIndex: 0,
        value: {
          fields: initalState[0].fields.filter((item, index) => index !== 1)
        }
      }
    })[0].fields[0]
  ).not.toMatchObject({
    type: "wrong Info",
    name: "test",
    maxLength: "edit",
    required: true
  });
});
