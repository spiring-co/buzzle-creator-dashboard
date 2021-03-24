import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import VideoTemplateForm from "./VideoTemplateForm";
import VideoTemplatesTable from "./VideoTemplatesTable";
import VideoTemplateDrafts from "./VideoTemplateDrafts";
import VideoTemplateDetails from "./VideoTemplateDetails";
import VideoTemplatePublish from "./VideoTemplatePublish";
import Page from "common/Page";

export default () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/`} exact
        render={props => (
          <Page {...props} component={VideoTemplatesTable} title="Buzzle | Video Templates" />
        )} />
      <Route path={`${path}/add`}
        render={props => (
          <Page {...props} component={VideoTemplateForm} title="Buzzle | Create Video Template" />
        )} />
      <Route path={`${path}/drafts`}
        render={props => (
          <Page {...props} component={VideoTemplateDrafts} title="Buzzle | Drafted Templates" />
        )} />
      <Route path={`${path}/:uid/edit`}
        render={props => (
          <Page {...props} component={VideoTemplateForm} title="Buzzle | Edit Video Template" />
        )} />
      <Route path={`${path}/:id/publish`}
        render={props => (
          <Page {...props} component={VideoTemplatePublish} title="Buzzle | Publish Template" />
        )} />
      <Route path={`${path}/:id`}
        render={props => (
          <Page {...props} component={VideoTemplateDetails} title="Buzzle | Video Details" />
        )} />
    </Switch>
  );
};
