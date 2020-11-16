import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import VideoTemplateForm from "./VideoTemplateForm";
import VideoTemplatesTable from "./VideoTemplatesTable";
import VideoTemplateDrafts from "./VideoTemplateDrafts";
import VideoTemplateDetails from "./VideoTemplateDetails";
import VideoTemplatePublish from "./VideoTemplatePublish";

export default () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/`} exact component={VideoTemplatesTable} />
      <Route path={`${path}/:uid/edit`} component={VideoTemplateForm} />
      <Route path={`${path}/:id`} component={VideoTemplateDetails} />
      <Route path={`${path}/add`} component={VideoTemplateForm} />
      <Route path={`${path}/drafts`} component={VideoTemplateDrafts} />
      <Route path={`${path}/:id/publish`} component={VideoTemplatePublish} />

    </Switch>
  );
};
