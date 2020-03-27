import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./services/Login";
import Registration from "./pages/register";
import React from "react";
import FilePickerScreen from "./pages/FilePickerScreen";
import FormBuilderScreen from "./pages/FormBuilderScreen";
// FilePickerScreen and FormSchemaBuilder
//Just to Show working, will be removed when work with the flow
const NavBar = () => (
  <div>
    <Link to="/home">Home</Link>
    <Link to="/registration">Register</Link>
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
            <Route path="/registration" exact component={Registration} />
            <Route path="/filepicker" exact component={FilePickerScreen} />
            <Route path="/formbuilder" exact component={FormBuilderScreen} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
