import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import AddVideoTemplate from "pages/AddVideoTemplate";
import VideoTemplatesTable from "pages/VideoTemplatesTable";
import VideoTemplateDetails from "pages/VideoTemplateDetails";
import VideoTemplatDrafts from 'pages/VideoTemplatDrafts'
import VideoTemplatePublish from 'pages/VideoTemplatePublish'

export default () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/`} exact component={VideoTemplatesTable} />
      <Route path={`${path}/drafts`} component={VideoTemplatDrafts} />
      <Route path={`${path}/:id/publish`} component={VideoTemplatePublish} />
      <Route path={`${path}/add`} component={AddVideoTemplate} />
      <Route path={`${path}/:uid/edit`} component={AddVideoTemplate} />
      <Route path={`${path}/:id`} component={VideoTemplateDetails} />
    </Switch>
  );
};
