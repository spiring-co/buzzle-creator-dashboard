import Home from "pages/Home";
import Landing from "pages/Landing";
import Login from "pages/Login";
import Register from "pages/Register";
import React from "react";
import Navbars from "./components/Navbars";
import {
  Link,
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import useAuth from "services/auth";

function App() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div>
      {" "}
      <Navbars auth={isAuthenticated} log={logout} />
      <div style={{ margin: "auto", width: "40%", textAlign: "center" }}>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />

            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Route path="/home" component={Home} />
            </PrivateRoute>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

function PrivateRoute({ isAuthenticated, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
export default App;
