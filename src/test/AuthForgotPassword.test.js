import React from "react";
import ForgotPasswordAuth from "../services/ForgotPasswordAuth";
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
describe("ForgotPasswordAuth hook", () => {
  let setupComponent;
  let hook;
  beforeEach(() => {
    setupComponent = mountReactHook(ForgotPasswordAuth);
    hook = setupComponent.componentHook;
  });

  it("logs in with correct credentials", async (done) => {
    expect(hook.otpEmailSent).toEqual(false);
    await hook.sendPasswordResetOtp({
      email: "vajpayeekaushiki20@gmail.com",
    });
    expect(hook.otpEmailSent).toEqual(true);
    done();
  });

  it("logs in with correct credentials", async (done) => {
    expect(hook.error).toEqual(null);
    await hook.sendPasswordResetOtp({
      email: "",
    });
    expect(hook.error).toEqual("syntax error");
    done();
  });

  it("logs in with correct credentials", async (done) => {
    expect(hook.error).toEqual(null);
    await hook.sendPasswordResetOtp({
      email: "vaji_123@gmail.com",
    });
    expect(hook.error).toEqual("email not registered");
    done();
  });
});
