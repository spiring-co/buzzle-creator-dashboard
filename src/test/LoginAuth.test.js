import * as Enzyme from "enzyme";
import { Form } from "react-bootstrap";
import Adapter from "enzyme-adapter-react-16";
import { MemoryRouter } from "react-router-dom";
Enzyme.configure({ adapter: new Adapter() });

import { shallow, mount } from "enzyme";
import React from "react";
import Login from "../pages/Login";

it("email check", () => {
  const wrapper = mount(<Login />);
  wrapper.find(<input type="email" />).simulate("change", {
    target: { name: "email", value: "krishankantsinghal@gmail.com" },
  });
  expect(wrapper).toEqual("krishankantsinghal");

});

// it("password check", () => {
//     wrapper = shallow(<Login />);
//     wrapper.find('input[type="password"]').simulate("change", {
//       target: { name: "password", value: "krishankant123" },
//     });
//     expect(wrapper).toEqual("krishankant123");
//   });
//   it("login check with right data", () => {
//     wrapper = shallow(<Login />);
//     wrapper.find('input[type="text"]').simulate("change", {
//       target: { name: "email", value: "krishankantsinghal@gmail.com" },
//     });
//     wrapper.find('input[type="password"]').simulate("change", {
//       target: { name: "password", value: "krishankant123" },
//     });
//     wrapper.find("button").simulate("click");
//     expect(wrapper).toBe(true);
//   });
//   it("login check with wrong data", () => {
//     wrapper = shallow(<Login />);
//     wrapper.find('input[type="text"]').simulate("change", {
//       target: { name: "email", value: "krishankantsinghal@gmail.com" },
//     });
//     wrapper.find('input[type="password"]').simulate("change", {
//       target: { name: "password", value: "krishankant1234" },
//     });
//     wrapper.find("button").simulate("click");
//     expect(wrapper).toBe(false);
//   });