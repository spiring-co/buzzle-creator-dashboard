import React from "react";
import Register from "../pages/Register";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow, mount } from "enzyme";

it("renders correctly when there are no Login", () => {
  const tree = renderer.create(<Register />).toJSON();
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
const wrapper = mount(<Register />);
const validName = "divesh";
const validValue = "divesh123@gmail.com";
const validPassword = "sdfjsdbbf";
const validGender = "Male";
const validPhone = "9898989898";
const validBirth = "20-7-1998";
const validCountry = "america";

it("Should update name input field on change", () => {
  updateField(wrapper.find('input[name="name"]'), "name", validName);
  expect(wrapper.find('input[name="name"]').props().value).toEqual(validName);
});

it("Should update subject input password field on change", () => {
  updateField(
    wrapper.find('input[name="password"]'),
    "password",
    validPassword
  );
  expect(wrapper.find('input[name="password"]').props().value).toEqual(
    validPassword
  );
});

it("Should update email input field on change", () => {
  updateField(wrapper.find('input[name="email"]'), "email", validName);
  expect(wrapper.find('input[name="email"]').props().value).toEqual(validName);
});

// it("Should update gender input field on change", () => {
//   const dropdown_list = wrapper.find('select[name="gender"]');
//   const options = dropdown_list
//     .find("option")
//     .change(dropdown_list)
//     .change(options.withText("Male"))
//     .expect(citySelect.value)
//     .eql("Male");
// });

it("Should update phone input field on change", () => {
  updateField(
    wrapper.find('input[name="phoneNumber"]'),
    "phoneNumber",
    validPhone
  );
  expect(wrapper.find('input[name="phoneNumber"]').props().value).toEqual(
    validPhone
  );
});

it("Should update birth input field on change", () => {
  updateField(wrapper.find('input[name="birthDate"]'), "birthDate", validBirth);
  expect(wrapper.find('input[name="birthDate"]').props().value).toEqual(
    validBirth
  );
});

// it("Should update country input field on change", () => {
//   updateField(wrapper.find('input[name="country"]'), "country", validCountry);
//   expect(wrapper.find('input[name="country"]').props().value).toEqual(
//     validCountry
//   );
// });
