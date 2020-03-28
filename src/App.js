import FilePickerScreen from "pages/FilePickerScreen";
import FormBuilderScreen from "pages/FormBuilderScreen";
import Home from "pages/Home";
import Register from "pages/Register";
import React, { useState } from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "services/Login";

// FilePickerScreen and FormSchemaBuilder
//Just to Show working, will be removed when work with the flow
const NavBar = () => (
  <div>
    <Link to="/home">Home</Link>
    <Link to="/register">Register</Link>
    <Link to="/">Login</Link>
  </div>
);

function App() {
  return (
    <div>
      <h1>Pharaoh 🐈</h1>
      <Router>
        <div className="App">
          <NavBar />
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/home" exact component={Home} />
            <Route path="/register" exact component={Register} />
            <Route path="/filepicker" exact component={FilePickerScreen} />
            <Route path="/formbuilder" exact component={FormBuilderScreen} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
