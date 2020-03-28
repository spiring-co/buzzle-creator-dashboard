import FilePickerScreen from "pages/FilePickerScreen";
import FormBuilderScreen from "pages/FormBuilderScreen";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import React from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";

// FilePickerScreen and FormSchemaBuilder
//Just to Show working, will be removed when work with the flow

function App() {
  return (
    <div style={{ margin: "auto", width: "65%", marginBottom: "100px" }}>
      <h1>Pharaoh 🐈</h1>
      <Router>
        <div className="App">
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
