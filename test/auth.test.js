import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { act, wait } from "react-dom/test-utils";
import useAuth from "services/auth";

Enzyme.configure({ adapter: new Adapter() });

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

describe("useAuth hook", () => {
  let setupComponent;
  let hook;

  beforeEach(() => {
    setupComponent = mountReactHook(useAuth);
    hook = setupComponent.componentHook;
  });

  it("logs in with correct credentials", async () => {
    expect(hook.isAuthenticated).toEqual(false);
    await hook.login("shivam.sasalol@yahoo.com", "password");
    expect(hook.isAuthenticated).toEqual(true);
    await hook.logout();
  });

  it("does not log in with incorrect credentials", async () => {
    expect(hook.isAuthenticated).toEqual(false);
    await expect(hook.login("example@yahoo.com", "password")).rejects.toEqual(
      Error("Your email is not registered.")
    );
    expect(hook.isAuthenticated).toEqual(false);
  });
});
