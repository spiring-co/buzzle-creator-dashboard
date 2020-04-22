import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { act, wait } from "react-dom/test-utils";
import login from "services/auth";
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
describe("login hook", () => {
  let setupComponent;
  let hook;
  beforeEach(() => {
    setupComponent = mountReactHook(login);
    hook = setupComponent.componentHook;
  });
  it("logs in with correct credentials", async (done) => {
    expect(hook.isAuthenticated).toEqual(false);
    await hook.login("shivam.sasalol@yahoo.com", "password");
    expect(hook.isAuthenticated).toEqual(true);
    await hook.logout();
    done();
  });
  it("does not log in with incorrect credentials", async (done) => {
    expect(hook.isAuthenticated).toEqual(false);
    await expect(hook.login("example@yahoo.com", "password")).rejects.toEqual(
      Error("Email is not registered")
    );
    expect(hook.isAuthenticated).toEqual(false);
    done();
  });

  it("does not log in with valid email and inValid password", async (done) => {
    expect(hook.isAuthenticated).toEqual(false);
    await expect(
      hook.login("shivam.sasalol@yahoo.com", "passwo")
    ).rejects.toEqual(Error());
    expect(hook.isAuthenticated).toEqual(false);
    done();
  });

  it("does not log in with null email and inValid password", async (done) => {
    expect(hook.isAuthenticated).toEqual(false);
    await expect(hook.login("", "password")).rejects.toEqual(
      Error("Email is required")
    );
    expect(hook.isAuthenticated).toEqual(false);
    done();
  });

  it("does not log in with  email and null password", async (done) => {
    expect(hook.isAuthenticated).toEqual(false);
    await expect(hook.login("shivam.sasalol@yahoo.com", "")).rejects.toEqual(
      Error()
    );
    expect(hook.isAuthenticated).toEqual(false);
    done();
  });

  it("does not log in with null email and null password", async (done) => {
    expect(hook.isAuthenticated).toEqual(false);
    await expect(hook.login("", "")).rejects.toEqual(
      Error("Email is required")
    );
    expect(hook.isAuthenticated).toEqual(false);
    done();
  });
  it("does not log in with null email and null password", async (done) => {
    expect(hook.isAuthenticated).toEqual(false);
    await expect(hook.login("", "")).rejects.toEqual(
      Error("Email is required")
    );
    expect(hook.isAuthenticated).toEqual(false);
    done();
  });
});
