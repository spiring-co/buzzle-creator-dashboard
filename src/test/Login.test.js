import React from "react";
import Login from "../pages/Login";
import renderer from "react-test-renderer";

it("renders correctly when there are no Login", () => {
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
});
