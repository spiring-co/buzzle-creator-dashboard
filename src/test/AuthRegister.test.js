import React from "react";
import RegisterAuth from "../services/RegisterAuth";
import renderer from "react-test-renderer";
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow, mount } from "enzyme";
import { act, wait } from "react-dom/test-utils";
const mountReactHook = (hook) => {
  const Component = ({ children }) => children(hook());
  const componentHook = {};
  let componentMount;
  act(() => {
    componentMount = Enzyme.shallow(
      <Component>
        {(hookValues) => {
          Object.assign(componentHook, hookValues);
          return null;
        }}
      </Component>
    );
  });
  return { componentMount, componentHook };
};
describe("RegisterAuth hook", () => {
  let setupComponent;
  let hook;
  beforeEach(() => {
    setupComponent = mountReactHook(RegisterAuth);
    hook = setupComponent.componentHook;
  });

  it("logs in with correct credentials", async (done) => {
    expect(hook.success).toEqual(null);
    await hook.submition({
      name: "abhaya",
      email: "purnivajpayee12@gmail.com",
      countryCode: "001",
      password: "Kauhsiki@12",
      gender: "Other",
      country: "American Samoa",
      phoneNumber: "9789928958",
      birthDate: "1900-03-04",
    });
    expect(hook.success).toEqual(true);
    done();
  });

  it("logs in with already used email credential", async (done) => {
    expect(hook.error).toEqual(null);
    await hook.submition({
      name: "abhaya",
      email: "vajpayeekaushiki20@gmail.com",
      countryCode: "001",
      password: "Kauhsiki@12",
      gender: "Other",
      country: "American Samoa",
      phoneNumber: "9789928958",
      birthDate: "1900-03-04",
    });
    expect(hook.error).toEqual({
      message: "the email is already used for registration",
    });
    done();
  });
});
