import React from "react";
import ForgotPassword from "../pages/ForgotPassword";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow, mount } from "enzyme";

it("renders correctly when there are no Login", () => {
  const tree = renderer.create(<ForgotPassword />).toJSON();
  expect(tree).toMatchSnapshot();
});

const updateField = (wrapper, name, value) => {
  wrapper.simulate("change", {
    persist: () => {},
    target: {
      name,
      value,
    },
  });
};

const wrapper = mount(<ForgotPassword />);
const validValue = "vajpayeekaushiki20@gmail.com";

it("Should update subject input field on change", () => {
  updateField(wrapper.find('input[name="email"]'), "email", validValue);
  expect(wrapper.find('input[name="email"]').props().value).toEqual(validValue);
});
