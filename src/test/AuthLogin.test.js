import React from "react";
import Login from "../pages/Login";
import { render } from "@testing-library/react";
import { shallow } from "enzyme";
import * as Enzyme from "enzyme";

import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });
jest.mock("../services/auth");

test("login service", (done) => {
  const wrapper = shallow(<Login />);
  setTimeout(() => {
    wrapper.update();
    expect(wrapper.find('input[name="email"]').length).toEqual(
      "abcd123@gmail.com"
    );
    expect(wrapper.find('input[name="password"]').length).toEqual("123@123");
  });
  done();
});
