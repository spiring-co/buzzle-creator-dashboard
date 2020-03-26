import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Login from "./services/Login";
import Registration from "./pages/register";

function App() {
  return (
    <div>
      <h1>Pharaoh 🐈</h1>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/home" exact component={Home} />
            <Route path="/registration" exact component={Registration} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
