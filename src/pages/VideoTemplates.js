import AddVideoTemplate from "pages/AddVideoTemplate";
import React from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
export default () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h3>Your Video Templates</h3>
      <br />
      <Switch>
        <Route path={`${path}/`} exact component={CreatorVideoTemplates} />
        <Route path={`${path}/add`} component={AddVideoTemplate} />
      </Switch>
    </div>
  );
};

const CreatorVideoTemplates = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <p>You have no templates. Add one using the button below.</p>
      <br />
      <Link to={`${url}/add`}>
        <button>+ Add Template</button>
      </Link>
    </div>
  );
};
