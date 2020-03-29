import Home from "pages/Home";
import Landing from "pages/Landing";
import Login from "pages/Login";
import Register from "pages/Register";
import React, { useEffect } from "react";
import {
  Link,
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import useAuth from "services/auth";

// FilePickerScreen and FormSchemaBuilder
//Just to Show working, will be removed when work with the flow

function App() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <div style={{ margin: "auto", width: "65%", marginBottom: "100px" }}>
      <Router>
        {isAuthenticated && (
          <button style={{ float: "right", display: "block" }} onClick={logout}>
            Logout
          </button>
        )}
        <Link to="/home">
          <h1>
            <img
              src={require("./assets/logo.png")}
              style={{ height: "2rem", margin: "0px 10px 10px 0px" }}
              alt="Pharaoh Logo"
            />
            Pharaoh
          </h1>
        </Link>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />

            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Route path="/home" component={Home} />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
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
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
export default App;
